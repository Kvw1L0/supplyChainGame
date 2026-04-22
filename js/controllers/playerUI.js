import { submitOrder, listenGameState } from '../services/logic.js';
import { setOnlineStatus, sendPing } from '../services/presence.js';

// NOTA: Para probar distintos roles, cambia este valor a 'wholesaler', 'distributor', o 'factory'
const MY_ROLE = "retailer"; 
let orderVal = 0;

setOnlineStatus(MY_ROLE);

document.getElementById('player-role').innerText = MY_ROLE.toUpperCase();

listenGameState((data) => {
    const node = data.roles[MY_ROLE];
    document.getElementById('current-week').innerText = data.currentWeek;
    document.getElementById('inventory-display').innerText = node.inventory;
    document.getElementById('backlog-display').innerText = node.backlog;
    
    const btn = document.getElementById('btn-submit');
    if (!node.hasPlayedThisTurn) {
        btn.disabled = false; btn.innerText = "ENVIAR PEDIDO"; btn.style.background = "var(--neon-blue)";
    }
});

document.getElementById('btn-plus').addEventListener('click', () => { 
    orderVal++; document.getElementById('order-input').value = orderVal; sendPing(MY_ROLE); 
    if(navigator.vibrate) navigator.vibrate(15);
});
document.getElementById('btn-minus').addEventListener('click', () => { 
    if(orderVal > 0) orderVal--; document.getElementById('order-input').value = orderVal; sendPing(MY_ROLE); 
});

document.getElementById('btn-submit').addEventListener('click', async (e) => {
    e.target.disabled = true; e.target.innerText = "ESPERANDO..."; e.target.style.background = "#333";
    if(navigator.vibrate) navigator.vibrate([50,30,50]);
    await submitOrder(MY_ROLE, orderVal);
    orderVal = 0; document.getElementById('order-input').value = 0;
});
