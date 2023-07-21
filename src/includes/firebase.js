import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCugGmpDqOSNLBLDuXfwIg06E2SmbITqyw',
  authDomain: 'vue-music-b7360.firebaseapp.com',
  projectId: 'vue-music-b7360',
  storageBucket: 'vue-music-b7360.appspot.com',
  messagingSenderId: '413403283408',
  appId: '1:413403283408:web:469e11023de81ba6ac83d5'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')

export { auth, db, usersCollection, storage, songsCollection }
