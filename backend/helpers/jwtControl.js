import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Psicologo from '../models/Psicologo.js';
import Paciente from '../models/Paciente.js';

class jwtControl {
  //Funcion para generar un token JWT
  async generateToken(id, nombre, role) {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id, nombre, role },
      secretKey,
      { expiresIn: '1h' }
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
      // Verificar si el usuario es un paciente o un psicologo
      if (decoded.role === 'paciente') {
        const pacienteModel = new Paciente();
        const user = await pacienteModel.getUserById(decoded.id);
        if (user) {
          return { role: 'paciente', user };
        }
      } else if (decoded.role === 'psicologo') {
        const psicologoModel = new Psicologo();
        const user = await psicologoModel.findById(decoded.id);
        if (user) {
          return { role: 'psicologo', user };
        }
      }
      throw new Error('Usuario no encontrado');
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

export default jwtControl;