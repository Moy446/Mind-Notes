import axios from 'axios';

export const clienteAxios = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
    withCredentials: true,
})