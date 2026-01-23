import Cita from '../models/Cita.js';
import Agenda from '../models/Agenda.js';
import Usuario from '../models/Usuario.js';
import ListaVinculacion from '../models/ListaVinculacion.js';

class CalendarioController {
    constructor(){
    }

    calcularHora(tiempo){
        const [hora, minutos] = tiempo.split(':').map(Number);
        return hora + minutos / 60;
    }

    loadCalendar = async (req,res) => {
        const agenda = new Agenda();
        //obtener idPsicologo de session o token
        const idPsicologo = "694b01541fb1a9eadec23c53";
        try {
            const datosAgenda = await agenda.getAgenda(idPsicologo); //ver como lo hace el eric
            const formattedAgenda = datosAgenda.map(cita =>({
                id:cita.idCita,
                nombre:cita.nombrePaciente,
                img:cita.fotoPaciente,
                horaI: this.calcularHora(cita.horaInicio),
                horaF: this.calcularHora(cita.horaFin),
                año: cita.fechaCita.split('-')[2],
                mes: cita.fechaCita.split('-')[1],
                dia: cita.fechaCita.split('-')[0],
                estado: cita.status
        }));   
            res.status(200).json({success:true, formattedAgenda});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al buscar en la agenda: ' + error.message });
        }
    }

    crearCita = async (req,res) => {
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo} = req.body;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{
            const nuevaCita = {
                idPaciente,
                idPsicologo : idPsicologo,/*req.params.idPsicologo,*/
                nombrePaciente,
                nombrePsicologo : nombrePsicologo,/*req.params.nombrePsicologo,*/
                fechaCita,
                horaInicio,
                horaFin,
                duracion,
                estado: 'programada'
            } 
            const cita = new Cita();
            const result = await cita.create(nuevaCita);  
            const paciente = new Paciente();
            const psicologo = new Psicologo();
            const datosPaciente = await paciente.findById(idPaciente);
            const datosPsicologo = await psicologo.findById(idPsicologo);
            const agenda = new Agenda();
            const nuevaAgenda = {
                idCita: result.insertedId,
                idPsicologo,
                idPaciente,
                horaInicio,
                horaFin,
                fechaCita, 
                fotoPaciente: datosPaciente.fotoPerfil,
                fotoPsicologo: datosPsicologo.fotoPerfil,
                nombrePaciente,
                nombrePsicologo, //falta ver donde guarda eric estos valores
                estado: 'programada',
            }
            await agenda.create(nuevaAgenda);
            res.status(201).json({ success: true, message: 'Cita creada exitosamente',result:result });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al crear la cita: ' + error.message });
        }
    }

    editarCita = async (req,res) =>{
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo} = req.body;
        const {idCita} = req.params;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{
            const datosActualizados = {
                idPaciente,
                idPsicologo : idPsicologo,
                nombrePaciente,
                nombrePsicologo : nombrePsicologo,
                fechaCita,
                horaInicio,
                horaFin,
                duracion,
                estado: 'reagendada'
            } 
            const cita = new Cita();
            await cita.editCita(idCita, datosActualizados);  
            //falta agregarla en la agenda
            const paciente = new Paciente();
            const psicologo = new Psicologo();
            const datosPaciente = await paciente.findById(idPaciente);
            const datosPsicologo = await psicologo.findById(idPsicologo);
            const agenda = new Agenda();
            const nuevaAgenda = {
                idCita,
                idPsicologo,
                idPaciente,
                horaInicio,
                horaFin,
                fechaCita, 
                fotoPaciente: datosPaciente.fotoPerfil,
                fotoPsicologo: datosPsicologo.fotoPerfil,
                nombrePaciente,
                nombrePsicologo, //falta ver donde guarda eric estos valores
                estado: 'programada',
            }
            await agenda.create(nuevaAgenda);
            res.status(201).json({ success: true, message: 'Cita editada exitosamente' });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al editar la cita: ' + error.message });
        }
    }

    async eliminarCita(req,res){
        try{
            /* ver los params */
            const {idCita} = req.params;
            const cita = new Cita();
            await cita.editCita(idCita, {estado: 'cancelada'});  
            //falta agregarla en la agenda
            res.status(201).json({ success: true, message: 'Cita cancelada exitosamente' });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al crear la cita: ' + error.message });
        }
    }

    async cargarCita(req,res){
        try {
            const {idCita} = req.params;
            const cita = new Cita();
            const datosCita = await cita.getCitaById(idCita);
            if (!datosCita) {
                return res.status(404).json({ success: false, message: 'Cita no encontrada' });
            }
            const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin} = datosCita;
            const usuarioModel = new Usuario();    
            const datosPaciente = await usuarioModel.findById(idPaciente); 
            const {fotoPerfil} = datosPaciente;
            res.status(200).json({success:true, cita:{
                idPaciente,
                nombrePaciente,
                fechaCita,
                horaInicio,
                horaFin,
                fotoPerfil
            }});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la informacion de la cita del paciente: ' + error.message });
        }
    }

    async obtenerNombresPacientes(req, res){
        const listaVinculacion = new ListaVinculacion();
        const nombresPacientes = await listaVinculacion.getAll();
        res.status(200).json({success:true, nombresPacientes});
    }

}
export default new CalendarioController;