import axios from 'axios';

const axiosCLient = axios.create({
    baseURL: 'https://firestore.googleapis.com/v1/projects/internship-2022/databases/(default)/documents/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosCLient.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosCLient.interceptors.response.use(
    function (response) {
        return response.data.documents;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosCLient;
