import cron from 'node-cron';
import email from '../helpers/emailService.js';
import Cita from '../models/Cita.js';

const enviarNotificaciones = async()=>{
    try {
        console.log('Iniciando job de notificaciones...');
        // cron.schedule (MINUTO HORA DIA MES DIA_SEMANA)
        cron.schedule('0 8 * * *', async () =>{
            const hoy = new Date();
            const mananaUTC = new Date(Date.UTC(
                hoy.getUTCFullYear(),
                hoy.getUTCMonth(),
                hoy.getUTCDate() + 1,
                0, 0, 0, 0
            ));
            const finMananaUTC = new Date(Date.UTC(
                hoy.getUTCFullYear(),
                hoy.getUTCMonth(),
                hoy.getUTCDate() + 1,
                23, 59, 59, 999
            ));
            const citas = new Cita();
            const citasManana = await citas.searchByDate(mananaUTC, finMananaUTC);
            console.log('Citas encontradas para mañana:', citasManana.length);
            for (const cita of citasManana) {
                console.log(cita);
                await email.confirmarCita(cita.emailPaciente, cita.nombrePaciente, cita.fechaCita, cita._id, cita.nombrePsicologo);
                cita.notificado = true;
                await citas.editCita(cita._id, cita);
            }
        })
    }catch (error) {
        console.error('Error al enviar notificaciones:', error);
    }
}

export default enviarNotificaciones;