import Constants from 'expo-constants';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '@/core/interfaces/User';

// Configuración de Google OAuth
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;

const getBackendBaseUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';

  try {
    const parsed = new URL(rawUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
};

const BACKEND_URL =
  getBackendBaseUrl(process.env.EXPO_PUBLIC_BACKEND_URL_ANDROID) ||
  getBackendBaseUrl(process.env.EXPO_PUBLIC_BACKEND_URL) ||
  'http://localhost:5000';
let isConfigured = false;

const configureGoogleSignin = () => {
  if (isConfigured) return;

  if (!WEB_CLIENT_ID) {
    throw new Error('Falta EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB para Google Sign-In');
  }

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID || undefined,
    offlineAccess: false,
  });

  isConfigured = true;
};

/**
 * Intercambia el ID token de Google por tokens de sesión del backend
 */
export const exchangeGoogleTokenForBackendAuth = async (
  idToken: string,
  role?: 'paciente' | 'psicologo'
): Promise<{
  success: boolean;
  accessToken?: string;
  user?: User;
  message?: string;
  role?: string;
}> => {
  try {
    const payload: { idToken: string; role?: 'paciente' | 'psicologo' } = { idToken };
    if (role) {
      payload.role = role;
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/google/mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include' // Incluir cookies en la solicitud
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || 'Error en la autenticación'
      };
    }

    const normalizedUser: User | undefined = data?.user
      ? {
          idUsuario: data.user.id || data.user.idUsuario,
          email: data.user.email,
          nombre: data.user.nombre,
          role: data.role || role || 'paciente',
          suscripcion: data.user.suscripcion || ''
        }
      : undefined;

    return {
      success: true,
      accessToken: data.accessToken,
      role: data.role,
      user: normalizedUser,
      message: data.message
    };
  } catch (error) {
    console.error('Error intercambiando token de Google con backend:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor'
    };
  }
};

/**
 * Inicia el flujo de autenticación con Google
 */
export const loginWithGoogle = async (
  role?: 'paciente' | 'psicologo'
): Promise<{
  success: boolean;
  accessToken?: string;
  user?: User;
  role?: string;
  message?: string;
}> => {
  try {
    if (Constants.appOwnership === 'expo') {
      return {
        success: false,
        message: 'Google login requiere un Dev Build nativo. Expo Go no soporta este flujo.'
      };
    }

    configureGoogleSignin();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const result = await GoogleSignin.signIn();

    if (result.type === 'success') {
      const idToken = result.data.idToken;

      if (!idToken) {
        return {
          success: false,
          message: 'No se pudo obtener el idToken de Google'
        };
      }

      const backendResponse = await exchangeGoogleTokenForBackendAuth(idToken, role);

      if (backendResponse.success) {
        return {
          success: true,
          accessToken: backendResponse.accessToken,
          user: backendResponse.user,
          role: backendResponse.role || role,
          message: 'Autenticación exitosa'
        };
      }

      return {
        success: false,
        message: backendResponse.message || 'Error en la autenticación'
      };
    }

    return {
      success: false,
      message: 'Autenticación cancelada por el usuario'
    };
  } catch (error) {
    console.error('Error en loginWithGoogle:', error);

    const errorCode = (error as { code?: string } | null)?.code;
    if (errorCode === 'DEVELOPER_ERROR' || errorCode === '10') {
      return {
        success: false,
        message:
          'Configuracion de Google invalida (DEVELOPER_ERROR). Verifica que el cliente Android y el cliente Web pertenezcan al mismo proyecto de Google Cloud, y que el SHA-1 registrado coincida con el de esta app.'
      };
    }

    return {
      success: false,
      message: 'Error al iniciar autenticación con Google'
    };
  }
};
