import {auth, db} from "./firebase-auth"
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {getDoc} from '@firebase/firestore';
import {collection, getDocs, setDoc, doc} from "firebase/firestore";


export function signout(setUserState: Dispatch<SetStateAction<string>>) {
    signOut(auth).then(() => {
        console.log("logged out");
        // Sign-out successful.
        setUserState("Login");
    })
}

export function checkUserState(setUserState: Dispatch<SetStateAction<string>>) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("changed to signout")
            setUserState("Signout");
        } else {
            console.log("not signed in")
        }
    });
}

export function signupUser(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            console.log("user signed up !")
            const user = userCredential.user;
            console.log(user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, " : ", errorMessage);
            // ..
        });
}

export function loginUser(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("congrats , user signed in ")
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            console.log("credential do not match !!");
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export async function setBoardData(user: string, pid: string, content: string, sceneVersion: number) {
    try {
        await setDoc(doc(db, user, pid), {
            content: content,
            // content: "demo",
            sceneVersion: sceneVersion
        });
        console.log("task successfully completed");
    } catch (e) {
        console.error('Unsuccessful', e);
    }
}

export async function getBoardData(user: string, pid: string, sceneVersion: number) {
    try {
        const docRef = doc(db, user, pid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
            // console.log("Document data:", docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            return null
            // console.log("No such document!");
        }
    } catch (error) {
        console.error('Unable to find doc with id ' + user);
    }
}

export async function getUserData(user: string) {
    try {
        console.log("fetching started:", user);
        const docRef = collection(db, user);
        const docSnaps = await getDocs(docRef);

        const events = docSnaps.docs.map((doc: any) => ({id: doc.id, ...doc.data()}));
        console.log(events);
        return events;
    } catch (err) {
        console.log(err);
        // throw err;
    }
}
