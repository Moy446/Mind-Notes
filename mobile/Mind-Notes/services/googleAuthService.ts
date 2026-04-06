import * as WebBrowser from 'expo-web-browser';

// Lazy load Google auth solo cuando se necesite (evita cargar módulos nativos en Expo Go)
let Google: any = null;

// Configuración de Google OAuth
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID ;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Cierra automáticamente el navegador web después de autenticación
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  try {
    if (!Google) {
      Google = require('expo-auth-session/providers/google');
    }

    const AuthSession = require('expo-auth-session');

    if (!WEB_CLIENT_ID || !ANDROID_CLIENT_ID) {
      console.warn('Faltan EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB o EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID para Google OAuth');
      return { request: null, response: null, promptAsync: null };
    }

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'mindnotes',
      path: 'oauthredirect'
    });
    
    const [request, response, promptAsync] = Google.useAuthRequest({
      webClientId: WEB_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID,
      redirectUri
    });

    return { request, response, promptAsync };
  } catch (error) {
    console.warn('Google Auth no disponible en Expo Go:', error);
    return { request: null, response: null, promptAsync: null };
  }
};

/**
 * Intercambia el ID token de Google por tokens de sesión del backend
 */
export const exchangeGoogleTokenForBackendAuth = async (
  idToken: string,
  role: 'paciente' | 'psicologo' = 'paciente'
): Promise<{
  success: boolean;
  message?: string;
  role?: string;
}> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/google/mobile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken,
        role
      }),
      credentials: 'include' // Incluir cookies en la solicitud
    });

    const data = await response.json();
    return data;
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
  promptAsync: any,
  role: 'paciente' | 'psicologo' = 'paciente'
): Promise<{
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  message?: string;
}> => {
  try {
    const result = await promptAsync();

    if (result?.type === 'success') {
      const { id_token } = result.params;
      
      // Intercambiar el token de Google por tokens del backend
      const backendResponse = await exchangeGoogleTokenForBackendAuth(id_token, role);

      if (backendResponse.success) {
        return {
          success: true,
          role: backendResponse.role || role,
          message: 'Autenticación exitosa'
        };
      } else {
        return {
          success: false,
          message: backendResponse.message || 'Error en la autenticación'
        };
      }
    } else if (result?.type === 'cancel') {
      return {
        success: false,
        message: 'Autenticación cancelada por el usuario'
      };
    } else {
      return {
        success: false,
        message: 'Error desconocido en la autenticación'
      };
    }
  } catch (error) {
    console.error('Error en loginWithGoogle:', error);
    return {
      success: false,
      message: 'Error al iniciar autenticación con Google'
    };
  }
};
