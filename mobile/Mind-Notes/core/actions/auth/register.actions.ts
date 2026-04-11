import { clienteAxios } from "@/core/API/clienteAxios";


export const registerPsicologo = async (nombre: string, email: string, password: string, passwordConfirm: string) => {
    email = email.trim().toLowerCase();
    try {
        const response = await clienteAxios.post('/registrarPsicologo', { nombre, email, password, passwordConfirm });
        return response.data;
    } catch (error) {
        console.error('Error al registrar psicólogo:', error?.response?.data?.message);
        throw error;
    }
}
export const registerPaciente = async (nombre: string, email: string, password: string, passwordConfirm: string) => {
    email = email.trim().toLowerCase();
    try {
        const response = await clienteAxios.post('/registrarPaciente', { nombre, email, password, passwordConfirm });
        return response.data;
    } catch (error) {
        console.error('Error al registrar paciente:', error?.response?.data?.message);
        throw error;
    }
}