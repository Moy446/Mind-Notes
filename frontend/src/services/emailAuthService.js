import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
    /**
     * Solicita recuperación de contraseña
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async solicitarRecuperacion(email) {
        try {
            const response = await axios.post(`${API_URL}/auth/solicitar-recuperacion`, {
                email
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al procesar la solicitud'
            };
        }
    },

    /**
     * Cambia la contraseña con token
     * @param {string} token - Token de recuperación
     * @param {string} newPassword - Nueva contraseña
     * @param {string} confirmPassword - Confirmación de contraseña
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async cambiarPassword(token, newPassword, confirmPassword) {
        try {
            const response = await axios.post(`${API_URL}/auth/cambiar-password`, {
                token,
                newPassword,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al cambiar la contraseña'
            };
        }
    },

    /**
     * Verifica la cuenta con token
     * @param {string} token - Token de verificación
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async verificarCuenta(token) {
        try {
            const response = await axios.get(`${API_URL}/auth/verificar-cuenta/${token}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al verificar la cuenta'
            };
        }
    },

    /**
     * Reenvía el correo de verificación
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} { success: boolean, message: string }
     */
    async reenviarVerificacion(email) {
        try {
            const response = await axios.post(`${API_URL}/auth/reenviar-verificacion`, {
                email
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al reenviar el correo'
            };
        }
    }
};
