import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzJkdt4Q40zAuZ2LeD1JYr1G5ycjQpVA4",
  authDomain: "pingme-61742.firebaseapp.com",
  projectId: "pingme-61742",
  storageBucket: "pingme-61742.firebasestorage.app",
  messagingSenderId: "562287468579",
  appId: "1:562287468579:web:8b8b9b7ed6aa879e70d196",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
