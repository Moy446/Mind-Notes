import { authLogin, authLogout, checkSessionStatus } from "@/core/actions/auth/login.actions";
import { User } from "@/core/interfaces/User";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { create } from "zustand";

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthResponse {
    success: boolean;
    role?: string;
}

export interface AuthState {
    status: AuthStatus;
    user?: User;
    token?: string;

    //methods
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    changeStatus: (token?: string, user?: User) => boolean;
    checkStatus: () => Promise<void>;
}

export const UseAuthStore = create<AuthState>((set, get) => ({

    status: 'checking',
    user: undefined,
    token: undefined,

    changeStatus: (token?: string, user?: User) => {
        if (!token || !user) {
            set({
                status: 'unauthenticated',
                user: undefined,
                token: undefined
            });
            SecureStorageAdapter.deleteItem('token');
            return false;
        }
        set({
            status: 'authenticated',
            user: user,
            token: token
        });
        SecureStorageAdapter.setItem('token', token);
        return true;
    },
    login: async (email: string, password: string) => {
        const resp = await authLogin(email, password)
        console.log(resp)
        const success = get().changeStatus(resp?.token, resp?.user);
        return { success, role: resp?.user?.role };
    },
    logout: async () => {
        SecureStorageAdapter.deleteItem('token');
        set({
            status: 'unauthenticated',
            user: undefined,
            token: undefined
        })
        try {
            await authLogout();
        } catch (error) {
            console.log(error);
        }
    },
    checkStatus: async () => {
        const resp = await checkSessionStatus();
        console.log(resp)
        get().changeStatus(resp?.token, resp?.user);
    }
}))

