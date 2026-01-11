import dbClient from "../config/dbClient.js";
import Paciente from "../models/Paciente.js";
/* Modelo de datos para ListaPaciente
   Aqui unicamente se definen las operaciones relacionadas con la coleccion de ListaPacientes
   en la base de datos MongoDB
    Operaciones como crear, buscar por ID de psicologo, etc.
    Ignorar validaciones y logica de negocio, estas se manejan en los controladores
*/

class ListaPaciente {
    constructor(){
        this.colListaPaciente = dbClient.db.collection('listaPacientes');
    }
    async create(idPaciente, idPsicologo){
        const paciente = new Paciente();
        try{
            const listaPaciente = {
                idPaciente: idPaciente,
                nombrePaciente: await paciente.findNameById(idPaciente),
                idPsicologo: idPsicologo,
                fotoPerfil: null,
                ultimoMensaje: null

            };
            const resultado = await this.colListaPaciente.insertOne(listaPaciente);
            return resultado;
        } catch (error) {
            console.error("Error al crear la lista de pacientes:", error);
            throw error;
        }
    }
    //BUSCAR A LOS PACIENTES QUE TENGAN ASIGANADO EL MISMO PSICOLOGO
    async findPacienteByIdPsicologo(idPsicologo){
        try {
            const listaPacientes = await this.colListaPaciente.find({idPsicologo: idPsicologo}).toArray();
            return listaPacientes;
        } catch (error) {
            throw new Error('Error al obtener la lista de pacientes: ' + error.message);
        }
    }

   
}

export default ListaPaciente;