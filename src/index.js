import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBLEECaOWavFsxgwnqr9VnPe6HjUaS7rnU",
  authDomain: "training-todos-dc1d2.firebaseapp.com",
  databaseURL: "https://training-todos-dc1d2-default-rtdb.firebaseio.com",
  projectId: "training-todos-dc1d2",
  storageBucket: "training-todos-dc1d2.appspot.com",
  messagingSenderId: "104931018588",
  appId: "1:104931018588:web:197fa2ed20d54a2367e399",
  measurementId: "G-4R8VF9NWKN"
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
