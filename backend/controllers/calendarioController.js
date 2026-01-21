import Cita from '../models/Cita.js';
import Agenda from '../models/Agenda.js';
import Paciente from '../models/Paciente.js';
import ListaPaciente from '../models/ListaPaciente.js';

class CalendarioController {
    constructor(){
    }

    async loadCalendar(req,res){
        const agenda = new Agenda();
        const datosAgenda = await agenda.getAgenda(req.params.idPsicologo); //ver como lo hace el eric
         
        if (!datosAgenda){
            res.render('calendario'/*vista calendario */, {
                datosAgenda: ['No tiene ningun paciente asignado']
            });
        }
        res.render('calendario'/*vista calendario */, {
            datosAgenda: datosAgenda
        });
    }

    async crearCita(req,res){
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo} = req.body;
        const duracion = horaFin - horaInicio; //checar como calcular la duracion
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
            await cita.create(nuevaCita);  
            //falta agregarla en la agenda
            res.status(201).json({ success: true, message: 'Cita creada exitosamente' });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al crear la cita: ' + error.message });
        }
    }

    async editarCita(req,res){
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo} = req.body;
        const {idCita} = req.params;
        const duracion = horaFin - horaInicio;
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
            const paciente = new Paciente();    
            const datosPaciente = await paciente.findById(idPaciente); 
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
        const listaPacientes = new ListaPaciente();
        const nombresPacientes = await listaPacientes.getAll();
        res.status(200).json({success:true, nombresPacientes});
    }

}
export default new CalendarioController;