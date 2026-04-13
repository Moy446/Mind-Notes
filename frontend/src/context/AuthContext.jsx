import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

// Función auxiliar para normalizar fotoPerfil
const normalizeFotoPerfil = (user) => {
  if (!user) return user;

  if (user.fotoPerfil) {
    // Si ya es URL completa o es una ruta local (/src/...), dejar como está
    if (!user.fotoPerfil.startsWith('http') && !user.fotoPerfil.startsWith('/')) {
      // Es una ruta relativa (uploads/images/...), construir URL completa
      return {
        ...user,
        fotoPerfil: `${process.env.VITE_BACKEND_BASE_URL}/${user.fotoPerfil}`
      };
    }
  }

  return user;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Al montar el componente, verifica si hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (session.authenticated && session.user) {
          setUser(normalizeFotoPerfil(session.user));
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        // Obtener sesión completa desde el servidor
        const session = await authService.getSession();
        if (session.authenticated && session.user) {
          setUser(normalizeFotoPerfil(session.user));
          setAuthenticated(true);
          return { success: true, user: session.user, role: result.role };
        }
      }
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, message: error.message };
    }
  };

  const refresh = async () => {
    try {
      const result = await authService.refresh();
      if (result.success) {
        const session = await authService.getSession();
        if (session.authenticated && session.user) {
          setUser(normalizeFotoPerfil(session.user));
        }
      }
      return result;
    } catch (error) {
      console.error('Error al refrescar sesión:', error);
      return { success: false, message: error.message };
    }
  };

  const updateUser = (updates) => {
    setUser(prev => normalizeFotoPerfil({ ...prev, ...updates }));
  };

  const value = {
    user,
    loading,
    authenticated,
    login,
    logout,
    refresh,
    updateUser, // NUEVO
    getUserId: () => user?.id || null,
    getUserRole: () => user?.role || null,
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}