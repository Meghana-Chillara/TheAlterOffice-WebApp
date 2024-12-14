import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAUWuYJ2-vqNXwFh1l8amiV5JuqjCT1SCE",
    authDomain: "web-application-b9e99.firebaseapp.com",
    projectId: "web-application-b9e99",
    storageBucket: "web-application-b9e99.firebasestorage.app",
    messagingSenderId: "830504262562",
    appId: "1:830504262562:web:1deaef38ba5ad3c5beb0fb",
    measurementId: "G-G965VVXK8D"
  };

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { firestore, auth,db,storage };
