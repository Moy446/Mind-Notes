import Cita from '../models/Cita.js';
import Agenda from '../models/Agenda.js';
import ListaPsicologo from '../models/ListaPsicologo.js';

class CalendarioController {
    constructor(){
        
    }

    loadCalendar(req,res){
        const listaPsicologos = new ListaPsicologo();
        const listaPacientes = listaPsicologos.getAllPacients(req.params.idPsicologo);
        if (!listaPacientes){
            res.render('calendario'/*vista calendario */, {
                listaPacientes: ['No tiene ningun paciente asignado']
            });
        }
        res.render('calendario'/*vista calendario */, {
            listaPacientes: listaPacientes
        });
    }

    async crearCita(req,res){
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo} = req.body;
        const duracion = horaFin - horaInicio;
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
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin, idPsicologo,nombrePsicologo,idCita} = req.body;
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
            await cita.editCita(/*req.params.idCita*/idCita, datosActualizados);  
            //falta agregarla en la agenda
            res.status(201).json({ success: true, message: 'Cita editada exitosamente' });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al editar la cita: ' + error.message });
        }
    }

    async eliminarCita(req,res){
        try{
            const {idCita} = req.body;
            /* ver los params */
            const cita = new Cita();
            await cita.editCita(idCita, {estado: 'cancelada'});  
            //falta agregarla en la agenda
            res.status(201).json({ success: true, message: 'Cita cancelada exitosamente' });
        }catch(error){
            res.status(500).json({ success: false, message: 'Error al crear la cita: ' + error.message });
        }
    }

    async cargarCitas(req,res){
        const citas = new Cita();
        const citasDisponibles = await citas.getAllWeek();
        res.json(citasDisponibles);
    }

}
export default new CalendarioController;