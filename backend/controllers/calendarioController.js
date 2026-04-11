import Cita from '../models/Cita.js';
import Agenda from '../models/Agenda.js';
import Usuario from '../models/Usuario.js';
import ListaVinculacion from '../models/ListaVinculacion.js';

class CalendarioController {

    calcularHora(tiempo){
        const [hora, minutos] = tiempo.split(':').map(Number);
        return hora + minutos / 60;
    }

    toMinutes = (hora) => {
        const [h, m] = hora.split(':');
        return parseInt(h) * 60 + parseInt(m);
    };


    loadCalendar = async (req,res) => {
        const agenda = new Agenda();
        const psicologoData = req.user;
        const idUsuario = psicologoData.idUsuario;
        try {
            const datosAgenda = await agenda.getAgenda(idUsuario);
            const formattedAgenda = datosAgenda.map(cita =>({
                id:cita.idCita,
                idPaciente: cita.idPaciente,
                nombre:cita.nombrePaciente,
                img:cita.fotoPaciente,
                horaI: cita.horaInicio,
                horaF: cita.horaFin,
                fecha: `${cita.fechaCita.getFullYear()}-${cita.fechaCita.getMonth()+1}-${cita.fechaCita.getDate()}`,
                estado: cita.status
            }));   
            res.status(200).json({success:true, formattedAgenda});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al buscar en la agenda: ' + error.message });
        }
    }

    loadPsycologist = async (req,res) =>{
        const {idUsuario} = req.user
        const listaVinculacion = new ListaVinculacion()
        try {
            const listaPsicologos = await listaVinculacion.findByPaciente(idUsuario)
            const data = listaPsicologos.map(psi => ({
                idPsicologo: psi.idPsicologo,
                nombrePsicologo: psi.nombrePsicologo,
                fotoPerfilPsicologo: psi.fotoPerfilPsicologo
            }))
            res.status(200).json({success:true, data});    
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al obtener los psicologos: ' + error.message });
        }   
    }

    loadCalendarPacient = async (req,res) => {
        const agenda = new Agenda();
        const {idUsuario} = req.user;
        const {idPsicologo} = req.params
        try {
            const datosAgenda = await agenda.getAgenda(idPsicologo);
            const formattedAgenda = datosAgenda.map(cita =>({
                id: cita.idPaciente.toString() == idUsuario.toString() ? cita.idCita : null,
                nombre: cita.idPaciente.toString() == idUsuario.toString() ?cita.nombrePaciente: 'reservado',
                img: cita.idPaciente.toString() == idUsuario.toString() ? cita.fotoPaciente : null,
                horaI: cita.horaInicio,
                horaF: cita.horaFin,
                fecha: `${cita.fechaCita.getFullYear()}-${cita.fechaCita.getMonth()+1}-${cita.fechaCita.getDate()}`,
                estado: cita.idPaciente.toString() == idUsuario.toString() ? cita.status : 'programada'
            }))
            res.status(200).json({success:true, formattedAgenda});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al buscar en la agenda: ' + error.message });
        }

    }

    crearCita = async (req,res) => {
        const {idUsuario,nombre:nombreUsuario,esPsicologo} = req.user;
        const {idUsuario:idAgendado,nombre:nombreAgendado, fechaCita, horaInicio, horaFin} = req.body;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{
            //obtener correo agendado
            const usuario = new Usuario();
            const emailAgendado = await usuario.findEmailById(idAgendado);

            //validar que este en el horario del psicologo
            let horarioPsicologo = []
            if (esPsicologo){
                horarioPsicologo = req.user.horario
            }else{
                horarioPsicologo = await usuario.getHorarioPsicologo(idAgendado)
            }
            if (!horarioPsicologo){
                throw new Error('El psicologo no a habilitado su horario de trabajo');
            }
            const dias = ["dom","lun","mar","mie","jue","vie","sab"];
            const fecha = new Date(fechaCita + "T00:00:00");
            const dia = dias[fecha.getDay()]
            const diaHorario = horarioPsicologo[dia];
            if (!diaHorario.activo){
                throw new Error('Ese dia no trabaja el psicologo');
            }
            const inicioTrabajo = this.toMinutes(diaHorario.inicio);
            const finTrabajo = this.toMinutes(diaHorario.fin);

            const inicioCita = this.toMinutes(horaInicio);
            const finCita = this.toMinutes(horaFin);
            if (inicioCita < inicioTrabajo || finCita > finTrabajo){
                throw new Error('La cita está fuera del horario laboral');
            }

            //validar que no haya citas en el mismo horario
            if (horaInicio >= horaFin) {
                throw new Error('La hora de inicio debe ser menor que la hora de fin');
            }
            const agenda = new Agenda();
            let citasDelDia = []
            if (esPsicologo){
                citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idUsuario.toString());
            }else{
                citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idAgendado);
            }
            for (let cita of citasDelDia){
                if (horaInicio < cita.horaFin && horaFin > cita.horaInicio){
                    throw new Error('Ya existe una cita en el mismo horario');
                }
            }
            //Subir cita
            const cita = new Cita();
            const listaVinculacion = new ListaVinculacion();
            let datos = {};
            if (esPsicologo) {
                datos = await listaVinculacion.findVinculacion(idUsuario.toString(),idAgendado);
            }else {
                datos = await listaVinculacion.findVinculacion(idAgendado, idUsuario.toString()); 
            }
            const nuevaCita = {
                idPaciente: esPsicologo ? idAgendado : idUsuario.toString(),
                idPsicologo : esPsicologo? idUsuario.toString() : idAgendado,
                nombrePaciente: esPsicologo? nombreAgendado : nombreUsuario,
                nombrePsicologo : esPsicologo? nombreUsuario : nombreAgendado,
                emailPaciente: esPsicologo?  emailAgendado : req.user.email ,
                fechaCita,
                horaInicio,
                horaFin,
                duracion,
                estado: 'programada'
            } 
            const result = await cita.create(nuevaCita);  
            const nuevaAgenda = {
                idCita: result.insertedId,
                idPsicologo : esPsicologo? idUsuario.toString() : idAgendado,
                idPaciente : esPsicologo ? idAgendado : idUsuario.toString(),
                horaInicio,
                horaFin,
                fechaCita, 
                fotoPaciente: datos.fotoPerfilPaciente,
                fotoPsicologo: datos.fotoPerfilPsicologo,
                nombrePaciente: esPsicologo? nombreAgendado : nombreUsuario,
                nombrePsicologo : esPsicologo? nombreUsuario : nombreAgendado,
                estado: 'programada',
            }
            await agenda.create(nuevaAgenda);
            res.status(201).json({ success: true, message: 'Cita creada exitosamente',result:result });
        }catch(error){
            res.status(500).json({ success: false, message: error.message });
        }
    }

    editarCita = async (req,res) =>{
        const {idUsuario,nombre:nombreUsuario,esPsicologo} = req.user;
        const {idUsuario:idAgendado,nombre:nombreAgendado, fechaCita, horaInicio, horaFin} = req.body;
        const {idCita} = req.params;
        const duracion = (this.calcularHora(horaFin) - this.calcularHora(horaInicio)) * 60;
        try{
            
            const usuario = new Usuario();
            const emailAgendado = await usuario.findEmailById(idAgendado);
            //validar que este en el horario del psicologo
            let horarioPsicologo = []
            if (esPsicologo){
                horarioPsicologo = req.user.horario
            }else{
                horarioPsicologo = await usuario.getHorarioPsicologo(idAgendado)
            }
            const dias = ["dom","lun","mar","mie","jue","vie","sab"];
            const fecha = new Date(fechaCita + "T00:00:00");
            const dia = dias[fecha.getDay()]
            const diaHorario = horarioPsicologo[dia];
            if (!diaHorario.activo){
                throw new Error('Ese dia no trabaja el psicologo');
            }
            const inicioTrabajo = this.toMinutes(diaHorario.inicio);
            const finTrabajo = this.toMinutes(diaHorario.fin);

            const inicioCita = this.toMinutes(horaInicio);
            const finCita = this.toMinutes(horaFin);
            if (inicioCita < inicioTrabajo || finCita > finTrabajo){
                throw new Error('La cita está fuera del horario laboral');
            }


            const agenda = new Agenda();
            //validar que no haya citas en el mismo horario
            let citasDelDia = []
            if (esPsicologo){
                citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idUsuario.toString());
            }else{
                citasDelDia =  await agenda.searchByDayAndPsychologist(fechaCita, idAgendado);
            }
            for (let cita of citasDelDia){
                if (horaInicio < cita.horaFin && horaFin > cita.horaInicio && idCita != cita.idCita){
                    throw new Error('Ya existe una cita en el mismo horario');
                }
            }
            //subir cita
            const cita = new Cita();
            const listaVinculacion = new ListaVinculacion();
            let datos = {};
            if (esPsicologo) {
                datos = await listaVinculacion.findVinculacion(idUsuario.toString(),idAgendado);
            }else {
                datos = await listaVinculacion.findVinculacion(idAgendado, idUsuario.toString()); 
            }
            const datosActualizados = {
                idPaciente: esPsicologo ? idAgendado : idUsuario,
                idPsicologo : esPsicologo ? idUsuario : idAgendado,
                nombrePaciente: esPsicologo? nombreAgendado : nombreUsuario,
                nombrePsicologo : esPsicologo? nombreUsuario : nombreAgendado,
                emailPaciente: esPsicologo?  emailAgendado : req.user.email ,
                fechaCita,
                horaInicio,
                horaFin,
                duracion,
                estado: 'reagendada'
                
            } 
            const resultadoCita = await cita.editCita(idCita, datosActualizados);  
            const nuevaAgenda = {
                idCita,
                idPaciente: esPsicologo ? idAgendado : idUsuario,
                idPsicologo : esPsicologo ? idUsuario : idAgendado,
                horaInicio,
                horaFin,
                fechaCita, 
                fotoPaciente: datos.fotoPerfilPaciente,
                fotoPsicologo: datos.fotoPerfilPsicologo,
                nombrePaciente: esPsicologo? nombreAgendado : nombreUsuario,
                nombrePsicologo : esPsicologo? nombreUsuario : nombreAgendado,
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
            const {esPsicologo} = req.user;
            const {idCita} = req.params;
            const cita = new Cita();
            const listaVinculacion = new ListaVinculacion();
            const datosCita = await cita.getCitaById(idCita);
            let informacionUsuario = {}
            if (!datosCita) {
                return res.status(404).json({ success: false, message: 'Cita no encontrada' });
            }

            const {fechaCita,horaInicio, horaFin} = datosCita;
            const fechaString = `${fechaCita.getFullYear()}-${(fechaCita.getMonth() + 1).toString().padStart(2,'0')}-${(fechaCita.getDate() + 1).toString().padStart(2,'0')}`;

            if (esPsicologo){
                const {idPaciente,nombrePaciente} = datosCita;
                const datosPaciente = await listaVinculacion.findByPaciente(idPaciente); 
                const {fotoPerfilPaciente} = datosPaciente;
                informacionUsuario = {
                    idUsuario : idPaciente,
                    nombre: nombrePaciente,
                    fechaCita:fechaString,
                    horaInicio:horaInicio, 
                    horaFin:horaFin,
                    fotoPerfil: fotoPerfilPaciente
                }
            }else{
                const {idPsicologo,nombrePsicologo} = datosCita;
                const datosPsicologo = await listaVinculacion.findByPsicologo(idPsicologo); 
                const {fotoPerfilPsicologo} = datosPsicologo;
                informacionUsuario = {
                    idUsuario : idPsicologo,
                    nombre: nombrePsicologo,
                    fechaCita:fechaString,
                    horaInicio:horaInicio, 
                    horaFin:horaFin,
                    fotoPerfil: fotoPerfilPsicologo
                }
            }
            res.status(200).json({success:true, cita: informacionUsuario});
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la informacion de la cita del paciente: ' + error.message });
        }
    }

    async cargarUsuarios(req, res){
            const {idUsuario, esPsicologo} = req.user;
        try {
            const listaVinculacion = new ListaVinculacion();
            let nombresUsuarios = []
            if(esPsicologo){
                nombresUsuarios = await listaVinculacion.findByPsicologo(idUsuario);
            }else{
                nombresUsuarios = await listaVinculacion.findByPaciente(idUsuario);
            }
            res.status(200).json({success:true, nombresUsuarios });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al cargar la lista de pacientes: ' + error.message });    
        }
    }

    async confirmarCita(req,res){
        try {
            const {id} = req.params;
            const {status} = req.query;
            const cita = new Cita();
            const agenda = new Agenda();
            await cita.updateStatus(id, status);
            await agenda.updateStatus(id, status);
            res.status(200).json({ success: true, message: 'Cita confirmada exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al confirmar la cita: ' + error.message });
        }
    }

}
export default new CalendarioController;