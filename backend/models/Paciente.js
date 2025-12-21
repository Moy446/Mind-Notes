import dbClient from "../config/dbclient.js";

class Paciente {
    constructor(){
        this.colPacientes = dbClient.db.collection('pacientes');
    }
    async create(datosUsuario){
        try{
            const paciente = {
                idPaciente: new ObjectId(datosUsuario.idPaciente),
                nombre: datosUsuario.nombre,
                email: datosUsuario.email,
                password: datosUsuario.password,
                telefono: datosUsuario.telefono,
                fotoPerfil: datosUsuario.fotoPerfil || null,
                fechaCreacion: new Date(),
            };
            const resultado = await this.colPacientes.insertOne(paciente);
            return resultado;
        } catch (error) {
            console.error("Error al crear paciente:", error);
            throw error;
        }
    }
    async findById(idPaciente){
            try {
                const paciente = await this.colPacientes.findOne({ idPaciente: new ObjectId(idPaciente) });
                return paciente;
            } catch (error) {
                throw new Error('Error al buscar el paciente por ID: ' + error.message);
            }
        }
    
}

export default Paciente;