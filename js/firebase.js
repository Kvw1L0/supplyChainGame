import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "supplychain-2e10b.firebaseapp.com",
  databaseURL: "https://supplychain-2e10b-default-rtdb.firebaseio.com",
  projectId: "supplychain-2e10b",
  storageBucket: "supplychain-2e10b.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const dbFirestore = getFirestore(app);
export const dbRealtime = getDatabase(app);
