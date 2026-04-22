import { listenGameState, processWeek, initGameDB } from '../services/logic.js';

const btnProcess = document.getElementById('btn-advance');

listenGameState((data) => {
    document.getElementById('admin-week').innerText = data.currentWeek;
    let allReady = true;
    
    ['retailer', 'wholesaler', 'distributor', 'factory'].forEach(role => {
        const span = document.querySelector(`#status-${role} .badge`);
        if (data.roles[role].hasPlayedThisTurn) {
            span.innerText = "LISTO (" + data.roles[role].lastOrderPlaced + ")";
            span.className = "badge ready-text";
        } else {
            span.innerText = "Esperando...";
            span.className = "badge";
            allReady = false;
        }
    });
    
    btnProcess.disabled = !allReady;
});

btnProcess.addEventListener('click', async () => {
    btnProcess.disabled = true; btnProcess.innerText = "CALCULANDO...";
    const demand = parseInt(document.getElementById('next-demand').value);
    await processWeek(demand);
    btnProcess.innerText = "PROCESAR SEMANA";
});

document.getElementById('btn-init-db').addEventListener('click', () => {
    if(confirm("¿Seguro? Esto reiniciará toda la partida a la Semana 1.")) initGameDB();
});
