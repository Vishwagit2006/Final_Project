// config/firebase.js

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAvSANVJMPOql3UlHnvfVAk6fX6gETGskc",
    authDomain: "reshare-hub.firebaseapp.com",
    projectId: "reshare-hub",
    storageBucket: "reshare-hub.firebasestorage.app",
    messagingSenderId: "931094152412",
    appId: "1:931094152412:web:08c886e206cf25f9992019"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Export initialized services
export { auth, db };