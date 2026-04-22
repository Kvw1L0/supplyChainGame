import { dbFirestore } from '../config/firebase.js';
import { doc, onSnapshot, updateDoc, setDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const SESSION_REF = doc(dbFirestore, "sessions", "session_001");

export async function submitOrder(role, amount) {
    await updateDoc(SESSION_REF, {
        [`roles.${role}.lastOrderPlaced`]: amount,
        [`roles.${role}.hasPlayedThisTurn`]: true
    });
}

export function listenGameState(callback) {
    onSnapshot(SESSION_REF, (docSnap) => {
        if (docSnap.exists()) callback(docSnap.data());
    });
}

export async function processWeek(consumerDemand) {
    await runTransaction(dbFirestore, async (transaction) => {
        const docSnap = await transaction.get(SESSION_REF);
        const data = docSnap.data();
        const roles = data.roles;
        const chain = ['retailer', 'wholesaler', 'distributor', 'factory'];
        let despachos = { retailer: 0, wholesaler: 0, distributor: 0, factory: 0 };

        chain.forEach((role, idx) => {
            let node = roles[role];
            node.inventory += (node.pendingDeliveries.shift() || 0);
            let demanda = (role === 'retailer') ? consumerDemand : roles[chain[idx - 1]].lastOrderPlaced;
            let req = demanda + node.backlog;
            let envia = Math.min(node.inventory, req);
            node.inventory -= envia;
            node.backlog = req - envia;
            despachos[role] = envia;
        });

        roles.retailer.pendingDeliveries.push(despachos.wholesaler);
        roles.wholesaler.pendingDeliveries.push(despachos.distributor);
        roles.distributor.pendingDeliveries.push(despachos.factory);
        roles.factory.pendingDeliveries.push(roles.factory.lastOrderPlaced);

        chain.forEach(r => { roles[r].hasPlayedThisTurn = false; roles[r].lastOrderPlaced = 0; });
        transaction.update(SESSION_REF, { currentWeek: data.currentWeek + 1, roles: roles });
    });
}

// Función de desarrollo para crear la partida inicial desde el Admin
export async function initGameDB() {
    const baseNode = { inventory: 15, backlog: 0, lastOrderPlaced: 0, hasPlayedThisTurn: false, pendingDeliveries: [4, 4] };
    await setDoc(SESSION_REF, { currentWeek: 1, roles: { retailer: {...baseNode}, wholesaler: {...baseNode}, distributor: {...baseNode}, factory: {...baseNode} } });
}
