import dbClient from "../config/dbClient.js";
import Psicologo from "../models/Psicologo.js";

/* Modelo de datos para ListaPsicologo
   Aqui unicamente se definen las operaciones relacionadas con la coleccion de ListaPsicologos
   en la base de datos MongoDB
   Operaciones como crear, buscar por ID de paciente, etc.
   Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class ListaPsicologo {
    constructor() {
        this.colListaPsicologo = dbClient.db.collection('listaPsicologos');
    }
    async create(idPaciente, idPsicologo) {
        const psicologo = new Psicologo();
        try {
            const listaPsicologo = {
                idPsicologo: idPsicologo,
                nombrePsicologo: await psicologo.findNameById(idPsicologo),
                idPaciente: idPaciente,                
                fotoPerfil: null,
                ultimoMensaje: null,
            };
            const resultado = await this.colListaPsicologo.insertOne(listaPsicologo);
            return resultado;
        } catch (error) {
            console.error("Error al crear la lista de psicologos:", error);
            throw error;
        }
    }
    async findPsicologoByIdPaciente(idPaciente) {
        try {
            const listaPsicologos = await this.colListaPsicologo.find({ idPaciente: idPaciente }).toArray();
            return listaPsicologos;
        } catch (error) {
            throw new Error('Error al obtener la lista de psicologos: ' + error.message);
        }
    }
    async getAllPacients(idPsicologo){
        try{
            const listaPacientes = await this.colListaPsicologo.find({idPsicologo}).toArray();
            return listaPacientes;
        }catch(error){
            throw new Error('Error al obtener todos los pacientes: ' + error.message);
        }
    }
}

export default ListaPsicologo;