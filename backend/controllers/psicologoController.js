import ListaPaciente from "../models/ListaPaciente.js";
import Psicologo from "../models/Psicologo.js";
import Bcrypt from 'bcryptjs';
import jwtControl from "../helpers/jwtControl.js";

class PsicologoController {
    constructor(){

    }
    //Funcion para probar la conexion con la base de datos
    async probarConexion(req, res) {
        const listaPaciente = new ListaPaciente();
        const data = await listaPaciente.selectAll();
        res.status(200).json(data);
    }
    //Funcion para registrar un nuevo psicologo en la base de datos
    async registrarPsicologoBD(req, res) {
        try {
            const { nombre, email, password, passwordConfirm } = req.body;
            
            if (password !== passwordConfirm) {
                return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
            }

            const allData = {
                Password: password,
                nombre,
                email,
                apellido: req.body.apellido || '',
                fechaInicio: req.body.fechaInicio || new Date(),
                fechaFin: req.body.fechaFin || null,
                cedula: req.body.cedula || '',
                fotoPerfil: req.body.fotoPerfil || ''
            };
            const modelPsicologo = new Psicologo();
            const resultado = await modelPsicologo.create(allData);
            const jwt = new jwtControl();
            const token = await jwt.generateToken(resultado.idPsicologo.toString(), nombre, 'psicologo');
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(201).json({ success: true, idPsicologo: resultado.idPsicologo, token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al registrar: ' + error.message });
        }
    } 

    //Funcion para iniciar sesion como psicologo
    async loginPsicologo  (req, res)  {
        try {
            const { email, password } = req.body;
            const psicologoModel = new Psicologo();
            const psicologo = await psicologoModel.findByEmail(email);
            if (!psicologo) {
                return res.status(404).json({ success: false, message: 'Psicologo no encontrado' });
            }
            const isPasswordValid = await Bcrypt.compare(password, psicologo.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
            const jwt = new jwtControl();
            const token = await jwt.generateToken(psicologo.idPsicologo.toString(), psicologo.nombre, 'psicologo');
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.status(200).json({ success: true, idPsicologo: psicologo.idPsicologo, token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }
    }

    //Funcion para listar los pacientes asociados a un psicologo
    async vincularPacientes(req, res) {
        const idPsicologo = req.params.Psicologo;
        const listaPacienteModel = new ListaPaciente();
        try {
            listaPacienteModel.create(req.body.idPaciente, idPsicologo);
            res.status(201).json({
                success: true,
                message: 'Paciente vinculado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al vincular el paciente: ' + error.message
            });
        }
    }

}

export default new PsicologoController;