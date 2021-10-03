import * as firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6wssOxvgprxnc1uThRZ5iV952KNLXFXg",
  authDomain: "ecommerce-sodimac.firebaseapp.com",
  projectId: "ecommerce-sodimac",
  storageBucket: "ecommerce-sodimac.appspot.com",
  messagingSenderId: "772825092742",
  appId: "1:772825092742:web:b29831cf90cbf20a6fb707",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
