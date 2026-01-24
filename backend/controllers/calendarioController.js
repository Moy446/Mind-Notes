import Cita from '../models/Cita.js';
import Agenda from '../models/Agenda.js';
import Paciente from '../models/Paciente.js';
import Psicologo from '../models/Psicologo.js';
import ListaPaciente from '../models/ListaPaciente.js';

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
                año: cita.fechaCita.split('-')[0],
                mes: cita.fechaCita.split('-')[1],
                dia: cita.fechaCita.split('-')[2],
                estado: cita.status
        }));   
            res.status(200).json({success:true, formattedAgenda});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al buscar en la agenda: ' + error.message });
        }
    }

    crearCita = async (req,res) => {
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin} = req.body;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{
            //Borrar
            const idPsicologo = "694b01541fb1a9eadec23c53";
            const nombrePsicologo = "Dr. Psicologo Test";
            //

            //validar que no haya citas en el mismo horario
            const agenda = new Agenda();
            const citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idPsicologo);
            for (let cita of citasDelDia){
                if (horaInicio < cita.horaFin && horaInicio > cita.horaInicio || horaFin > cita.horaInicio && horaFin < cita.horaFin){
                    throw new Error('Ya existe una cita en el mismo horario');
                }
            }
            const cita = new Cita();
            const paciente = new Paciente();
            const psicologo = new Psicologo();
            const datosPaciente = await paciente.findById(idPaciente);
            const datosPsicologo = await psicologo.findById(idPsicologo);
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
            const result = await cita.create(nuevaCita);  
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
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin} = req.body;
        const {idCita} = req.params;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{

            //Borrar
            const idPsicologo = "694b01541fb1a9eadec23c53";
            const nombrePsicologo = "Dr. Psicologo Test";
            //

            const agenda = new Agenda();
            //validar que no haya citas en el mismo horario
            const citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idPsicologo);
            for (let cita of citasDelDia){
                if (horaInicio < cita.horaFin && horaFin > cita.horaInicio && idCita != cita.idCita){
                    throw new Error('Ya existe una cita en el mismo horario');
                }
            }
            const cita = new Cita();
            const paciente = new Paciente();
            const psicologo = new Psicologo();
            const datosPaciente = await paciente.findById(idPaciente);
            const datosPsicologo = await psicologo.findById(idPsicologo);
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
            const resultadoCita = await cita.editCita(idCita, datosActualizados);  
            const nuevaAgenda = {
                idCita,
                idPsicologo,
                idPaciente, //falta ver donde guarda eric estos valores
                horaInicio,
                horaFin,
                fechaCita, 
                fotoPaciente: datosPaciente.fotoPerfil,
                fotoPsicologo: datosPsicologo.fotoPerfil,
                nombrePaciente,
                nombrePsicologo, //falta ver donde guarda eric estos valores
                status: 'reagendada',
            }
            const resultadoAgenda = await agenda.update(idCita, nuevaAgenda);
            if (resultadoAgenda.matchedCount === 0 || resultadoCita.matchedCount === 0) {
                throw new Error("No se encontró la agenda para actualizar");
            }
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

    async cargarPacientes(req, res){
        const listaPacientes = new ListaPaciente();
        const nombresPacientes = await listaPacientes.getAll();
        res.status(200).json({success:true, nombresPacientes});
    }

}
export default new CalendarioController;