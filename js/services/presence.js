import { dbRealtime } from '../config/firebase.js';
import { ref, onValue, set, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export function setOnlineStatus(role) {
    const statusRef = ref(dbRealtime, `status/${role}`);
    const connectedRef = ref(dbRealtime, ".info/connected");
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            set(statusRef, "online");
            onDisconnect(statusRef).set("offline");
        }
    });
}

export function sendPing(role) {
    set(ref(dbRealtime, `pings/${role}`), serverTimestamp());
}

export function listenToPingsAndStatus(callbackPing, callbackStatus) {
    onValue(ref(dbRealtime, 'pings'), (snap) => callbackPing(snap.val() || {}));
    onValue(ref(dbRealtime, 'status'), (snap) => callbackStatus(snap.val() || {}));
}
