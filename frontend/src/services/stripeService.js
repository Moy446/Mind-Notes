import clienteAxios from './axios.js';

export const checkout = async (plan) => {
    try {
        const response = await clienteAxios.post(`/psicologo/checkout`, {
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
        const response = await clienteAxios.post(`/psicologo/cancel-subscription`, {}, {
            withCredentials: true
        });
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        throw new Error(error.response?.data?.error || 'Error al cancelar suscripción');
    }
};

export const confirmCheckoutSession = async (sessionId) => {
    try {
        const response = await clienteAxios.post('/psicologo/checkout/confirm-session', {
            session_id: sessionId
        }, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error('Error al confirmar sesión de checkout:', error);
        throw new Error(error.response?.data?.error || 'Error al confirmar sesión de checkout');
    }
};

export const getSubscriptionStatus = async (userId) => {
    try {
        const response = await clienteAxios.post(`/psicologo/suscripcion/${userId}`, {}, {
            withCredentials: true
        });
        const data = await response.data;
        return data?.suscripcion === true;
    }
    catch (error) {
        console.error('Error al obtener el estado de la suscripción:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener el estado de la suscripción');
    }
};

