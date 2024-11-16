import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHkdWQ_1JqHR3m1XskMFAeO0P-8lPH_Wc",
  authDomain: "connectify-12.firebaseapp.com",
  projectId: "connectify-12",
  storageBucket: "connectify-12.appspot.com",
  messagingSenderId: "834273509342",
  appId: "1:834273509342:web:31326c19991579d0e3a74f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };