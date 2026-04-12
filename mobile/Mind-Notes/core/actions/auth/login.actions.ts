import { clienteAxios } from "@/core/API/clienteAxios";
import { User } from "@/core/interfaces/User";

export interface AuthResponse {
    success:     boolean;
    idUsuario:   string;
    email:       string;
    nombre:      string;
    role:        string;
    suscripcion?: string;
    token:       string;
}

const returnUserToken = (data:AuthResponse):{user:User, token:string} =>{
    const { idUsuario, email, nombre, role, suscripcion, token} = data;
    const user: User = {
        idUsuario,
        email,
        nombre,
        role,
        suscripcion: suscripcion ? suscripcion : ''
    }
    return { user, token };
}

export const authLogin = async (email: string, password: string) => {
    email = email.trim().toLowerCase();
    try {

        const {data} = await clienteAxios.post<AuthResponse>('/login', { email, password });
        return returnUserToken(data);

    } catch (error) {
        console.log(error);
        return null
    }
}


export const checkSessionStatus = async (): Promise<{user: User, token: string} | null> => {
    try {
        const {data} = await clienteAxios.post<AuthResponse>('/refresh');
        return returnUserToken(data);
    } catch (error) {
        console.log('Sesión no activa o token expirado');
        return null;
    }
}

//TODO: falta el register


export const authLogout = async () => {
    try {
        await clienteAxios.post<AuthResponse>('/logout'); 
    } catch (error) {
        console.log(error);
    }
}