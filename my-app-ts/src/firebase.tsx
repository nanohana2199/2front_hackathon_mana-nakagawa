import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY as string,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN as string,
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID as string,
  appId: process.env.REACT_APP_APP_ID as string,
};
console.log("API Key:", process.env.REACT_APP_API_KEY);
console.log("Auth Domain:", process.env.REACT_APP_AUTH_DOMAIN);
console.log("Project ID:", process.env.REACT_APP_PROJECT_ID);
console.log("Storage Bucket:", process.env.REACT_APP_STORAGE_BUCKET);
console.log("Messaging Sender ID:", process.env.REACT_APP_MESSAGEING_SENDER_ID);
console.log("App ID:", process.env.REACT_APP_APP_ID);


const app =initializeApp(firebaseConfig);

export const auth =getAuth(app);
