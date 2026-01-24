const API_URL = 'http://localhost:5000/api';

export const authService = {
  async loginPaciente(email, password) {
    try {
      const response = await fetch(`${API_URL}/loginPaciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar las cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar el token y id en localStorage
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('idPaciente', data.idPaciente);
      localStorage.setItem('userType', 'paciente');

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async loginPsicologo(email, password) {
    try {
      const response = await fetch(`${API_URL}/loginPsicologo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar las cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar el token e id en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('idPsicologo', data.idPsicologo);
      localStorage.setItem('userType', 'psicologo');

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async registrarPaciente(nombre, email, password, passwordConfirm) {
    try {
      const response = await fetch(`${API_URL}/registrarPaciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, password, passwordConfirm }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async registrarPsicologo(nombre, email, password, passwordConfirm) {
    try {
      const response = await fetch(`${API_URL}/registrarPsicologo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, password, passwordConfirm }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      return { success: true, ...data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('idPaciente');
    localStorage.removeItem('idPsicologo');
    localStorage.removeItem('userType');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUserType() {
    return localStorage.getItem('userType');
  },

  getUserId() {
    const type = localStorage.getItem('userType');
    if (type === 'psicologo') return localStorage.getItem('idPsicologo');
    if (type === 'paciente') return localStorage.getItem('idPaciente');
    return null;
  },

  getUserRole() {
    return localStorage.getItem('userType');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
