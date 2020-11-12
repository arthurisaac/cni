import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyCdH0yyo4hSTvLx3_xSEmPQieu8PGOeAXQ",
    authDomain: "cniburkina.firebaseapp.com",
    projectId: "cniburkina"
});

const db = firebaseConfig.firestore();

export {db};
