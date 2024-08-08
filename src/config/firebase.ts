import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAlclcqRfQSC0XoGN0dAmERg3D_I9BS4Cs",
  authDomain: "harry-potter-characters-6c424.firebaseapp.com",
  projectId: "harry-potter-characters-6c424",
  storageBucket: "harry-potter-characters-6c424.appspot.com",
  messagingSenderId: "590537532191",
  appId: "1:590537532191:web:589b5baca7d87b05bec62a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);