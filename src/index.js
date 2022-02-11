import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyAYra19yRgh16x3FzFfnKnm42NG7jGbklk',
    authDomain: 'internship-2022.firebaseapp.com',
    projectId: 'internship-2022',
    storageBucket: 'internship-2022.appspot.com',
    messagingSenderId: '833584677021',
    appId: '1:833584677021:web:8375e594d2885d56361474',
    measurementId: 'G-V3Q36V5WCG',
};

initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
