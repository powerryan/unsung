
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  projectId: process.env.REACT_APP_FIREBASE_PROJ,
  storageBucket: process.env.REACT_APP_FIREBASE_STOR,
  messagingSenderId: process.env.REACT_APP_FIREBASE_ID,
  appId: process.env.REACT_APP_FIREBASE_APP,
  measurementId: process.env.REACT_APP_FIREBASE_MEAS
};
const firebaseApp = initializeApp(firebaseConfig);
const store = getStorage(firebaseApp);
export { store };
