import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cob-kb-demo.firebaseapp.com",
  projectId: "cob-kb-demo",
  storageBucket: "cob-kb-demo.firebasestorage.app",
  messagingSenderId: "952258726764",
  appId: "1:952258726764:web:6109a1671d1a0358110149",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };
