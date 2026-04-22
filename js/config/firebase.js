import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCY9_D3Dyh2oRZ4A1EzBPck3RtsDRNkbnY",
    authDomain: "supplychain-2e10b.firebaseapp.com",
    databaseURL: "https://supplychain-2e10b-default-rtdb.firebaseio.com",
    projectId: "supplychain-2e10b",
    storageBucket: "supplychain-2e10b.firebasestorage.app",
    messagingSenderId: "877411976306",
    appId: "1:877411976306:web:862f033082386c3e24eeeb"
  };

const app = initializeApp(firebaseConfig);
export const dbFirestore = getFirestore(app);
export const dbRealtime = getDatabase(app);
