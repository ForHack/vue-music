import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCugGmpDqOSNLBLDuXfwIg06E2SmbITqyw',
  authDomain: 'vue-music-b7360.firebaseapp.com',
  projectId: 'vue-music-b7360',
  storageBucket: 'vue-music-b7360.appspot.com',
  messagingSenderId: '413403283408',
  appId: '1:413403283408:web:469e11023de81ba6ac83d5'
}

export default firebase.initializeApp(firebaseConfig)
