import { clienteAxios } from "@/core/API/clienteAxios";

export const recoverPassword = async (email: string) => {
    email = email.trim().toLowerCase();
    try {
        const resp = await clienteAxios.post('/auth/solicitar-recuperacion', { email });
        return resp.data;
    } catch (error) {
        console.error('Error al recuperar contraseña:', error?.response?.data?.message);
        throw error;
    }
}