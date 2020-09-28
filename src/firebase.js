import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyD1lXEh42iJviusJQGKL4KF5KrLEtq1dz4",
  authDomain: "ecomproject-f7875.firebaseapp.com",
  databaseURL: "https://ecomproject-f7875.firebaseio.com",
  projectId: "ecomproject-f7875",
  storageBucket: "ecomproject-f7875.appspot.com",
  messagingSenderId: "124707770336",
  appId: "1:124707770336:web:40963cb6b7155ca160a585"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;