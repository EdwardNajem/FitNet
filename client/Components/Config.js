
//export const API_URL = 'http://192.168.1.10:8080'; //Edward Home
// export const API_URL = 'http://172.16.128.39:8080'; //UNI WIFI
// export const API_URL = 'http://10.1.0.108:8080'; //WIFI ROADSTER
//export const API_URL = 'http://192.168.66.243:8080'; //Edward 3G
// export const API_URL = 'http://172.23.48.1:8080'; //The Nook
//export const API_URL = 'http://192.168.0.102:8080'; //Ralph Home
// export const API_URL = 'http://192.168.8.119:8080'; //Ralph Kaa
  export const API_URL = 'http://192.168.1.106:8080'; //Ahmad Hom

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
