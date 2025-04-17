// This file is kept for future Firebase integration
// Currently using Expo notifications for push notifications

import { initializeApp } from '@react-native-firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqF9nnVC-4uUC1QITMWsTVe1sywbnTl3M",
  authDomain: "tradestorm-109aa.firebaseapp.com",
  projectId: "tradestorm-109aa",
  storageBucket: "tradestorm-109aa.firebasestorage.app",
  messagingSenderId: "99285292215",
  appId: "1:99285292215:web:e0821a1a81b5aeb382a932",
  measurementId: "G-CXC015Z8DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app; 