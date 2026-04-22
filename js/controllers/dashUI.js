import { listenGameState } from '../services/logic.js';
import { listenToPingsAndStatus } from '../services/presence.js';

let lastPings = { retailer: 0, wholesaler: 0, distributor: 0, factory: 0 };

// Escucha el avance de las semanas
listenGameState((data) => {
    document.getElementById('dash-week').innerText = data.currentWeek;
});

// Escucha el RTDB para la magia en vivo
listenToPingsAndStatus(
    (pings) => {
        // Efecto WOW: Si el timestamp del ping cambió, hacemos parpadear la luz
        Object.keys(pings).forEach(role => {
            if (pings[role] !== lastPings[role]) {
                lastPings[role] = pings[role];
                const indicator = document.querySelector(`#dash-${role} .status-indicator`);
                if(indicator) {
                    indicator.classList.add('ping-anim');
                    setTimeout(() => indicator.classList.remove('ping-anim'), 300);
                }
            }
        });
    },
    (status) => {
        // Actualiza quién está conectado
        Object.keys(status).forEach(role => {
            const txt = document.querySelector(`#dash-${role} .conn-status`);
            if(txt) {
                txt.innerText = status[role] === 'online' ? '🟢 Conectado' : '🔴 Desconectado';
                txt.style.color = status[role] === 'online' ? '#4caf50' : '#ff4d4d';
            }
        });
    }
);
