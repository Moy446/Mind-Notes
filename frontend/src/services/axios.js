import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

const clienteAxios = axios.create({
    baseURL: API_CONFIG.API_BASE,
    withCredentials: true, // Enviar cookies automáticamente
});

export default clienteAxios;
