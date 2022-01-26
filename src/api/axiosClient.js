import axios from 'axios';

const axiosCLient = axios.create({
    baseURL: 'https://training-todos-dc1d2-default-rtdb.firebaseio.com/',
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
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosCLient;
