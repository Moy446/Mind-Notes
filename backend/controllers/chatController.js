import Chat from "../models/Chat.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { Document, Packer, Paragraph } from "docx";

class ChatController {
    constructor() {
        // No asignar aquí, dbClient.db puede ser null inicialmente
    }

    async createChat(req, res) {
        const { idPaciente, idPsicologo } = req.body;
        try {
            const chatModel = new Chat();
            const resultado = await chatModel.create({ idPaciente, idPsicologo });
            res.status(201).json({ success: true, chatId: resultado.insertedId });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al crear el chat: ' + error.message });
        }
    }

    async obtenerMensajes(req, res) {
        const { idPsicologo, idPaciente } = req.params;
        try {
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado', data: [] });
            }

            res.status(200).json({ success: true, data: chatData.mensajes || [] });
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            res.status(500).json({ success: false, message: 'Error al obtener mensajes: ' + error.message, data: [] });
        }
    }

    async obtenerInformacionChat(req, res) {
        try {
            const { idPsicologo, idPaciente } = req.params;
            const chat = new Chat();
            const infoChat = await chat.findChatByParticipants(idPaciente, idPsicologo);
            const patientData = {
                id: infoChat.idPaciente,
                nombre: infoChat.nombrePaciente,
                materialAdjunto: infoChat.materialAdjunto,
                expedientes: infoChat.expedientes,
                grabaciones: infoChat.grabaciones
            }
            res.status(200).json({ success: true, patientData });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error obtener la informacion del paciente: ' + error.message });
        }
    }

    async guardarArchivo(req, res) {
        const { idPsicologo, idPaciente } = req.params;

        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
            }
            const chatModel = new Chat();
            const relativePath = path.relative(path.resolve(), req.file.path);
            const normalizedPath = req.file.path.replace(/\\/g, "/");
            const remitente = req.user?.esPsicologo ? 'psicologo' : 'paciente';

            const resultado = await chatModel.insertMaterialAdjunto(idPsicologo, idPaciente, normalizedPath);

            if (resultado.modifiedCount !== 1) {
                return res.status(500).json({ success: false, message: 'Error al guardar el archivo en el chat' });
            }

            const mensajeArchivo = {
                _id: new ObjectId(),
                mensaje: req.file.originalname,
                remitente,
                tipo: 'archivo',
                archivo: {
                    nombre: req.file.originalname,
                    path: normalizedPath,
                    mimeType: req.file.mimetype,
                    size: req.file.size
                },
                timestamp: new Date()
            };

            await chatModel.insertMensaje(idPsicologo, idPaciente, mensajeArchivo);

            const io = req.app.get('io');
            if (io) {
                const room = `chat-${idPsicologo}-${idPaciente}`;
                io.to(room).emit('receiveMessage', mensajeArchivo);
                io.to(`user-${idPsicologo}`).emit('updateChatList', {
                    idPsicologo,
                    idPaciente,
                    mensaje: req.file.originalname,
                    timestamp: mensajeArchivo.timestamp
                });
                io.to(`user-${idPaciente}`).emit('updateChatList', {
                    idPsicologo,
                    idPaciente,
                    mensaje: req.file.originalname,
                    timestamp: mensajeArchivo.timestamp
                });
            }

            res.status(200).json({
                success: true,
                message: 'Archivo guardado correctamente',
                archivo: {
                    nombre: req.file.originalname,
                    tipo: req.file.mimetype,
                    tamaño: req.file.size,
                    path: relativePath
                }
            });
        } catch (error) {
            console.error('Error al guardar archivo:', error);
            res.status(500).json({ success: false, message: 'Error al guardar el archivo: ' + error.message });
        }
    }

    async descargarArchivo(req, res) {
        const { idPsicologo, idPaciente, archivoId } = req.params;

        try {
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }

            const archivo = chatData.materialAdjunto.find(a => a._id.toString() === archivoId);

            if (!archivo) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            const filePath = path.resolve(archivo.path);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'Archivo no existe en el servidor' });
            }

            res.download(filePath, archivo.nombre, (err) => {
                if (err) {
                    console.error('Error al descargar archivo:', err);
                    res.status(500).json({ success: false, message: 'Error al descargar el archivo' });
                }
            });
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            res.status(500).json({ success: false, message: 'Error al descargar el archivo: ' + error.message });
        }
    }

    async eliminarArchivo(req, res) {
        const { idPsicologo, idPaciente, archivoId } = req.params;

        try {
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }

            const archivo = chatData.materialAdjunto.find(a => a._id.toString() === archivoId);

            if (!archivo) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            const filePath = path.resolve(archivo.path);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const resultado = await chat.eliminarMaterialAdjunto(idPsicologo, idPaciente, archivoId);

            if (resultado.modifiedCount !== 1) {
                return res.status(500).json({ success: false, message: 'Error al eliminar el archivo' });
            }

            res.status(200).json({ success: true, message: 'Archivo eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar el archivo: ' + error.message });
        }
    }

    async obtenerDocumento(req, res) {
        const { idPsicologo, idPaciente, archivoId } = req.params;

        try {
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }

            const archivo = chatData.expedientes.find(a => a._id.toString() === archivoId);

            if (!archivo) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            const filePath = path.resolve(archivo.path);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'Archivo no existe en el servidor' });
            }

            res.download(filePath, archivo.nombre, (err) => {
                if (err) {
                    console.error('Error al descargar archivo:', err);
                    res.status(500).json({ success: false, message: 'Error al descargar el archivo' });
                }
            });
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            res.status(500).json({ success: false, message: 'Error al descargar el archivo: ' + error.message });
        }
    }

    async obtenerTexto(req, res) {
        const { idPsicologo, idPaciente, archivoId } = req.params;

        try {
            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }

            const archivo = chatData.expedientes.find(a => a._id.toString() === archivoId);

            if (!archivo) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            const filePath = path.resolve(archivo.path);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'Archivo no existe en el servidor' });
            }

            const result = await mammoth.extractRawText({ path: filePath });

            res.json({
                success: true,
                content: result.value
            });

        } catch (error) {
            console.error('Error al descargar archivo:', error);
            res.status(500).json({ success: false, message: 'Error al descargar el archivo: ' + error.message });
        }
    }

    async guardarDocumento(req, res){
        try {
            const { content } = req.body;
            const { idPsicologo, idPaciente, archivoId } = req.params;

            const doc = new Document({
                sections: [
                    {
                        children: content.split('\n').map(
                            line => new Paragraph(line)
                        )
                    }
                ]
            });

            const buffer = await Packer.toBuffer(doc);

            const chat = new Chat();
            const chatData = await chat.findChatByParticipants(idPaciente, idPsicologo);

            if (!chatData) {
                return res.status(404).json({ success: false, message: 'Chat no encontrado' });
            }

            const archivo = chatData.expedientes.find(a => a._id.toString() === archivoId);

            if (!archivo) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }

            const filePath = path.resolve(archivo.path);

            fs.writeFileSync(filePath, buffer);

            return res.json({
                success: true,
                message: "Documento guardado"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error al guardar documento"
            });
        }
    };

}

export default new ChatController();