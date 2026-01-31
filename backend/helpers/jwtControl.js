import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Usuario from '../models/Usuario.js';

class jwtControl {
  //Funcion para generar un token JWT
  async generateToken(id, nombre, role) {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id, nombre, role },
      secretKey,
      { expiresIn: '7d' }
    );
    return token;
  }

  async verifyToken(token) {
    const secretKey = process.env.JWT_SECRET;
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    try {
      const decoded = jwt.verify(token, secretKey);
      const usuarioModel = new Usuario();
      const user = await usuarioModel.findById(decoded.id);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que el rol coincida con el tipo de usuario
      if (decoded.role === 'paciente' && user.esPsicologo) {
        throw new Error('Tipo de usuario incorrecto');
      }
      if (decoded.role === 'psicologo' && !user.esPsicologo) {
        throw new Error('Tipo de usuario incorrecto');
      }

      return { role: decoded.role, user };
    } catch (error) {
      throw new Error('Token inválido: ' + error.message);
    }
  }
}

export default jwtControl;