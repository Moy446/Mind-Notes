import cita from '../models/Cita.js';

class CalendarioController {
    constructor(){
        
    }

    crearCita(req,res){
        
    }

    editarCita(req,res){

    }
    eliminarCita(req,res){

    }

    async cargarCitas(req,res){
        const citas = new cita();
        const citasDisponibles = await citas.getAllWeek();
        res.json(citasDisponibles);
    }

}
export default new CalendarioController;