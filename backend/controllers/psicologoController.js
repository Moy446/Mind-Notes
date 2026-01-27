import ListaVinculacion from "../models/ListaVinculacion.js";
import Psicologo from "../models/Psicologo.js";
import Bcrypt from 'bcryptjs';
import cookieCtrl from "../helpers/cookiesControll.js";

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
                Nombre: nombre,
                Eemail: email,
                Apellido: req.body.apellido || null,
                FechaInicio: req.body.fechaInicio || new Date(),
                FechaFin: req.body.fechaFin || null,
                Cedula: req.body.cedula || null,
                FotoPerfil: req.body.fotoPerfil || null
            };
            const modelPsicologo = new Psicologo();
            const user = await modelPsicologo.create(allData);
            const accessToken = cookieCtrl.signAccess({ id: user.idPsicologo, role: 'psicologo' });
            const refreshToken = cookieCtrl.signRefresh({ id: user.idPsicologo, role: 'psicologo' });
            cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
            res.status(201).json({ success: true, idPsicologo: user.idPsicologo, nombre: user.nombre });
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
            const accessToken = cookieCtrl.signAccess({ id: psicologo.idPsicologo, role: 'psicologo' });
            const refreshToken = cookieCtrl.signRefresh({ id: psicologo.idPsicologo, role: 'psicologo' });
            cookieCtrl.setAuthCookies(res, accessToken, refreshToken);
            res.status(200).json({ success: true, idPsicologo: psicologo.idPsicologo, nombre: psicologo.nombre });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error en el servidor: ' + error.message });
        }
    }

    //Funcion para listar los pacientes asociados a un psicologo
    async vincularPacientes(req, res) {
        const idPsicologo = req.params.Psicologo;
        const listaVinculacionModel = new ListaVinculacion();
        try {
            await listaVinculacionModel.create(idPsicologo, req.body.idPaciente);
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

    // NUEVO: obtener pacientes vinculados a un psicólogo
    async obtenerPacientesVinculados(req, res) {
        const { idPsicologo } = req.params;
        const listaVinculacionModel = new ListaVinculacion();
        try {
            const data = await listaVinculacionModel.findByPsicologo(idPsicologo);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener pacientes: ' + error.message });
        }
    }

}

export default new PsicologoController;