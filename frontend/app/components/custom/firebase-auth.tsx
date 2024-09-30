import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// hide this before making public
const firebaseConfig = {

    apiKey: "AIzaSyCGLIS1Ls8VPJbwOdurwJynaoXE95yyDXo",

    authDomain: "logic-whiteboard.firebaseapp.com",

    projectId: "logic-whiteboard",

    storageBucket: "logic-whiteboard.appspot.com",

    messagingSenderId: "624671178961",

    appId: "1:624671178961:web:55456c00b50820e1bb05f0",

    measurementId: "G-L8FS4CP7TZ"

};


// Initialize Firebease
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

