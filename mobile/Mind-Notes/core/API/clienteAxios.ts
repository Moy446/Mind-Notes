import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';
import axios from 'axios';
import { Platform } from 'react-native';

const stage = process.env.EXPO_PUBLIC_STAGE;

export const API_URL = 
    (stage === 'production') 
    ? process.env.EXPO_PUBLIC_BACKEND_URL 
    : (Platform.OS === 'ios')
        ? process.env.EXPO_PUBLIC_BACKEND_URL_IOS
        : process.env.EXPO_PUBLIC_BACKEND_URL_ANDROID;

console.log('API URL:', API_URL);

export const clienteAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

//Interceptor
clienteAxios.interceptors.request.use(async (config) => {
    const token = await SecureStorageAdapter.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})