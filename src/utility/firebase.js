// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD51VuzEDGnLXq2P_hheTWtUT5pJsEIvOc",
    authDomain: "product-image-9f820.firebaseapp.com",
    projectId: "product-image-9f820",
    storageBucket: "product-image-9f820.appspot.com",
    messagingSenderId: "493017975650",
    appId: "1:493017975650:web:2d85a8bc7c50a40c633a3b",
    measurementId: "G-L0BKQYE2QG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);