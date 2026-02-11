import clienteAxios from '../services/axios'

export const authService = {
  async loginPaciente(email, password) {
    try {
      const response = await clienteAxios.post('/loginPaciente', { email, password }, {
        withCredentials: true, // importante: permite enviar/recibir cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      // No guardas token en localStorage, confías en la cookie HttpOnly
      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  async loginPsicologo(email, password) {
    try {
      const response = await clienteAxios.post('/loginPsicologo', { email, password }, {
        withCredentials: true, // permite enviar/recibir cookies
      });

      const data = response.data;
      // No guardas token en localStorage, confías en la cookie HttpOnly
      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  async registrarPaciente(nombre, email, password, passwordConfirm) {
    try {
      const response = await clienteAxios.post('/registrarPaciente', { nombre, email, password, passwordConfirm });
      const data = response.data;

      if (!data) {
        throw new Error('Error en el registro');
      }

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  async registrarPsicologo(nombre, email, password, passwordConfirm) {
    try {
      const response = await clienteAxios.post('/registrarPsicologo', { nombre, email, password, passwordConfirm });
      const data = response.data;
      
      if (!data) {
        throw new Error('Error en el registro');
      }

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Obtener sesión actual verificando token con el servidor
  async getSession() {
    try {
      const { data } = await clienteAxios.get('/me', { withCredentials: true });
      return { authenticated: true, user: data.user };
    } catch (error) {
      return { authenticated: false, user: null };
    }
  },

  // Refrescar el access token
  async refresh() {
    try {
      await clienteAxios.post('/refresh', {}, { withCredentials: true });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // Logout: llama al servidor para limpiar cookies
  async logout() {
    await clienteAxios.post('/logout', {}, { withCredentials: true }).catch(() => {});
  },

  getToken() {
    // Ya no usas localStorage, solo verificas con getSession()
    return null;
  },

  getUserType() {
    // Usa getSession() para obtener el rol desde el servidor
    return null;
  },

  getUserId() {
    // Usa getSession() para obtener el id desde el servidor
    return null;
  },

  getUserRole() {
    // Usa getSession() para obtener el rol desde el servidor
    return null;
  },

  isAuthenticated() {
    // Llama a getSession() en lugar de revisar localStorage
    return this.getSession().then(session => session.authenticated);
  }
};
