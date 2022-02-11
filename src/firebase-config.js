import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyAYra19yRgh16x3FzFfnKnm42NG7jGbklk',
    authDomain: 'internship-2022.firebaseapp.com',
    projectId: 'internship-2022',
    storageBucket: 'internship-2022.appspot.com',
    messagingSenderId: '833584677021',
    appId: '1:833584677021:web:8375e594d2885d56361474',
    measurementId: 'G-V3Q36V5WCG',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();