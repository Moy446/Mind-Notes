import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const checkout = async (idUsuario, plan) => {
    try {
        const response = await axios.post(`${API_URL}/psicologo/checkout`, {
            idUsuario,
            plan
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        throw new Error(error.response?.data?.error || 'Error al crear sesión de pago');
    }

};

export const cancelSubscription = async () => {
    try {
        const response = await axios.post(`${API_URL}/psicologo/cancel-subscription`, {}, {
            withCredentials: true
        });
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        throw new Error(error.response?.data?.error || 'Error al cancelar suscripción');
    }
};

