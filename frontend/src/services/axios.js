import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: process.env.VITE_BACKEND_URL,
    withCredentials: true, // Enviar cookies automáticamente
});

export default clienteAxios;
