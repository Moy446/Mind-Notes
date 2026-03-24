import dbClient from "../config/dbClient.js";
import Usuario from "./Usuario.js";
import Chat from "./Chat.js";
import { ObjectId } from "mongodb";


class ListaVinculacion {
    constructor() {
        this.colListaVinculacion = dbClient.db?.collection('listaVinculacion');
    }
    async create(idPsicologo, idPaciente) {
        try {
            const usuario = new Usuario();

            // Buscar ambos usuarios
            const dataPsicologo = await usuario.findById(idPsicologo)
            const dataPaciente = await usuario.findById(idPaciente)

            // Validar que ambos usuarios existan
            if (!dataPsicologo) {
                throw new Error(`El psicólogo con ID ${idPsicologo} no existe`);
            }
            if (!dataPaciente) {
                throw new Error(`El paciente con ID ${idPaciente} no existe`);
            }

            const chat = new Chat();
            const vinculacion = {
                idVinculacion: new ObjectId(),
                idPsicologo: new ObjectId(idPsicologo),
                idPaciente: new ObjectId(idPaciente),
                nombrePsicologo: dataPsicologo.nombre,
                nombrePaciente: dataPaciente.nombre,
                fotoPerfilPsicologo: dataPsicologo.fotoPerfil || "/src/images/userDefault.png",
                fotoPerfilPaciente: dataPaciente.fotoPerfil || "/src/images/userDefault.png",
            };
            const datosChat = {
                idPaciente: idPaciente,
                idPsicologo: idPsicologo,
                nombrePaciente: dataPaciente.nombre,
                nombrePsicologo: dataPsicologo.nombre,
            }
            const resVinculacion = await this.colListaVinculacion.insertOne(vinculacion);
            const resChat = await chat.create(datosChat);
            if (!resVinculacion || !resChat) {
                throw new Error('Error al crear la vinculacion o el chat');
            }
            return resVinculacion;
        }
        catch (error) {
            console.error("Error al crear la lista de vinculacion:", error);
            throw error;
        }

    }
    async findVinculacion(idPsicologo, idPaciente) {
        try {
            const vinculacion = await this.colListaVinculacion.findOne({ idPsicologo: new ObjectId(idPsicologo), idPaciente: new ObjectId(idPaciente) });
            return vinculacion;
        }
        catch (error) {
            throw new Error('Error al buscar la vinculacion: ' + error.message);
        }
    }

    async findByPsicologo(idPsicologo) {
        try {
            const pipeline = [
                { $match: { idPsicologo: new ObjectId(idPsicologo) } },
                {
                    $lookup: {
                        from: 'chat',
                        let: { pid: '$idPaciente', psid: '$idPsicologo' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$idPaciente', '$$pid'] },
                                            { $eq: ['$idPsicologo', '$$psid'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    mensajes: 1
                                }
                            }
                        ],
                        as: 'chatData'
                    }
                },
                {
                    $addFields: {
                        ultimoMensaje: {
                            $arrayElemAt: [
                                {
                                    $ifNull: [
                                        { $arrayElemAt: ['$chatData.mensajes', 0] },
                                        []
                                    ]
                                },
                                -1
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        ultimoMensajeFecha: '$ultimoMensaje.timestamp'
                    }
                },
                { $sort: { ultimoMensajeFecha: -1, idVinculacion: -1 } },
                { $project: { chatData: 0 } }
            ];

            return this.colListaVinculacion.aggregate(pipeline).toArray();
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por psicologo: ' + error.message);
        }
    }

    async findByPaciente(idPaciente) {
        try {
            const pipeline = [
                { $match: { idPaciente: new ObjectId(idPaciente) } },
                {
                    $lookup: {
                        from: 'chat',
                        let: { pid: '$idPaciente', psid: '$idPsicologo' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$idPaciente', '$$pid'] },
                                            { $eq: ['$idPsicologo', '$$psid'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    mensajes: 1
                                }
                            }
                        ],
                        as: 'chatData'
                    }
                },
                {
                    $addFields: {
                        ultimoMensaje: {
                            $arrayElemAt: [
                                {
                                    $ifNull: [
                                        { $arrayElemAt: ['$chatData.mensajes', 0] },
                                        []
                                    ]
                                },
                                -1
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        ultimoMensajeFecha: '$ultimoMensaje.timestamp'
                    }
                },
                { $sort: { ultimoMensajeFecha: -1, idVinculacion: -1 } },
                { $project: { chatData: 0 } }
            ];

            return this.colListaVinculacion.aggregate(pipeline).toArray();
        } catch (error) {
            throw new Error('Error al obtener las vinculaciones por paciente: ' + error.message);
        }
    }

    async getAllPacientes(idPsicologo) {
        try {
            const vinculaciones = await this.colListaVinculacion.find({ idPsicologo: new ObjectId(idPsicologo) }).toArray();
            return vinculaciones;
        } catch (error) {
            throw new Error('Error al obtener todos los pacientes vinculados: ' + error.message);
        }
    }

    getAllPsicologos(idPaciente) {
        try {
            return this.colListaVinculacion.find({ idPaciente: new ObjectId(idPaciente) }).toArray();
        } catch (error) {
            throw new Error('Error al obtener todos los psicologos vinculados: ' + error.message);
        }
    }

    async actualizarNombreEnVinculaciones(idUsuario, nuevoNombre) {
        console.log('Actualizando nombre en vinculaciones para usuario:', idUsuario, 'Nuevo nombre:', nuevoNombre);
        try {
            await this.colListaVinculacion.updateMany(
                { $or: [{ idPsicologo: new ObjectId(idUsuario) }, { idPaciente: new ObjectId(idUsuario) }] },
                [
                    {
                        $set: {
                            nombrePsicologo: { $cond: [{ $eq: ["$idPsicologo", new ObjectId(idUsuario)] }, nuevoNombre, "$nombrePsicologo"] },
                            nombrePaciente: { $cond: [{ $eq: ["$idPaciente", new ObjectId(idUsuario)] }, nuevoNombre, "$nombrePaciente"] }
                        }
                    }
                ]
            );
        } catch (error) {
            throw new Error('Error al actualizar el nombre en las vinculaciones: ' + error.message);
        }
    }

    async actualizarFotoEnVinculaciones(idUsuario, nuevaFotoPerfil) {
        try {
            await this.colListaVinculacion.updateMany(
                { $or: [{ idPsicologo: new ObjectId(idUsuario) }, { idPaciente: new ObjectId(idUsuario) }] },
                [
                    {
                        $set: {
                            fotoPerfilPsicologo: {
                                $cond: [
                                    { $eq: ["$idPsicologo", new ObjectId(idUsuario)] },
                                    nuevaFotoPerfil,
                                    "$fotoPerfilPsicologo"
                                ]
                            },
                            fotoPerfilPaciente: {
                                $cond: [
                                    { $eq: ["$idPaciente", new ObjectId(idUsuario)] },
                                    nuevaFotoPerfil,
                                    "$fotoPerfilPaciente"
                                ]
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            throw new Error('Error al actualizar la foto en las vinculaciones: ' + error.message);
        }
    }

    async getAll() {
        try {
            const vinculaciones = await this.colListaVinculacion.find().toArray();
            return vinculaciones;
        } catch (error) {
            throw new Error('Error al obtener todas las vinculaciones: ' + error.message);
        }
    }

}
export default ListaVinculacion;