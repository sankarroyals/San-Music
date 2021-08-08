import firebase from "firebase"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCn6ROgHHXQTRk9P8nrNQw1rR5BlkJxvGQ",
    authDomain: "fir-music-e5c1f.firebaseapp.com",
    projectId: "fir-music-e5c1f",
    storageBucket: "fir-music-e5c1f.appspot.com",
    messagingSenderId: "841438056502",
    appId: "1:841438056502:web:97dc7a8b31da7529038897"
  };
  firebase.initializeApp(firebaseConfig)
  // const usersCollection = projectFirestore.collection('users')
  const projectFirestore = firebase.firestore()
  const projectAuth = firebase.auth()
  const projectStorage = firebase.storage()
  
  projectFirestore.enablePersistence().catch((error)=>{
    console.log(`${error.code}`);
  })


  const timestamp = firebase.firestore.FieldValue.serverTimestamp
  export {projectFirestore,projectAuth,timestamp,projectStorage}

