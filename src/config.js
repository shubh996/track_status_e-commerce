import firebase from 'firebase';
require('firebase/firestore');

var FirebaseKeys = {
  apiKey: "AIzaSyD08o83XLBTOdLCWGFfiMFAURqC_1w1Ao0",
  authDomain: "statusapp-19926.firebaseapp.com",
  projectId: "statusapp-19926",
  storageBucket: "statusapp-19926.appspot.com",
  messagingSenderId: "918688288986",
  appId: "1:918688288986:web:ac0c820c3000a603a195e3"
};


const keys = firebase.initializeApp(FirebaseKeys);
 
 export default keys 
  
 

 
  
 

