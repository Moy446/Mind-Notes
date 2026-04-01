import emailService from "../helpers/emailService.js";


class EmailController {
    constructor() {}

    async enviarComentario(req, res) {
        try {
            const {nombre, email, mensaje} = req.body;

            if (!nombre || !email || !mensaje) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }
            const resultado = await emailService.enviarComentario(nombre, email, mensaje);

            if (!resultado.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el correo'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Comentario enviado exitosamente'
            });
        } catch (error) {
            console.error('Error en enviarComentario:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new EmailController();   