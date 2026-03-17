import nodemailer from 'nodemailer';
import 'dotenv/config';

class EmailService {
    constructor() {
        // Validar variables de entorno requeridas
        const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM'];
        const missing = requiredEnv.filter(env => !process.env[env]);
        
        if (missing.length > 0) {
            console.warn(`⚠️  Variables de entorno faltantes para email: ${missing.join(', ')}`);
        }

        // Crear transporter con configuración segura
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465', // true para puerto 465, false para otros
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    /**
     * Envía correo de verificación de cuenta
     * @param {string} email - Email del usuario
     * @param {string} nombre - Nombre del usuario
     * @param {string} tokenVerificacion - Token único para verificar
     * @param {string} frontendUrl - URL del frontend
     */
    async enviarVerificacion(email, nombre, tokenVerificacion, frontendUrl) {
        try {
            const linkVerificacion = `${frontendUrl}/verificar-cuenta/${tokenVerificacion}`;
            
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Verifica tu cuenta en MindNotes',
                html: this._plantillaVerificacion(nombre, linkVerificacion)
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email de verificación enviado a ${email}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error enviando email de verificación:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Envía correo de recuperación de contraseña
     * @param {string} email - Email del usuario
     * @param {string} nombre - Nombre del usuario
     * @param {string} tokenRecuperacion - Token único para resetear
     * @param {string} frontendUrl - URL del frontend
     */
    async enviarRecuperacion(email, nombre, tokenRecuperacion, frontendUrl) {
        try {
            const linkRecuperacion = `${frontendUrl}/resetear-password/${tokenRecuperacion}`;
            
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Recupera tu contraseña en MindNotes',
                html: this._plantillaRecuperacion(nombre, linkRecuperacion)
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email de recuperación enviado a ${email}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Plantilla HTML para verificación de cuenta
     */
    _plantillaVerificacion(nombre, linkVerificacion) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
                    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: bold; color: #6366f1; }
                    .content { color: #333; line-height: 1.6; }
                    .button { display: inline-block; background: #48A6A7; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 20px 0; color: #856404; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        <div class="header">
                            <div class="logo">MindNotes</div>
                        </div>
                        
                        <div class="content">
                            <h2>¡Hola ${nombre}!</h2>
                            <p>Gracias por registrarte en MindNotes. Para activar tu cuenta, haz clic en el botón de abajo:</p>
                            
                            <center>
                                <a href="${linkVerificacion}" class="button">Verificar mi cuenta</a>
                            </center>
                            
                            <p>O copia y pega este enlace en tu navegador:</p>
                            <p style="word-break: break-all; color: #666; font-size: 12px;">${linkVerificacion}</p>
                            
                            <div class="warning">
                                <strong>⚠️ Importante:</strong> Este enlace expira en 24 horas. Si no lo hiciste, ignora este mensaje.
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>© 2026 MindNotes. Todos los derechos reservados.</p>
                            <p>Este es un correo automático, no respondas a este mensaje.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Plantilla HTML para recuperación de contraseña
     */
    _plantillaRecuperacion(nombre, linkRecuperacion) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
                    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: bold; color: #2973B2; }
                    .content { color: #333; line-height: 1.6; }
                    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                    .warning { background: #fee2e2; border: 1px solid #fecaca; padding: 10px; border-radius: 5px; margin: 20px 0; color: #991b1b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        <div class="header">
                            <div class="logo">MindNotes</div>
                        </div>
                        
                        <div class="content">
                            <h2>Recuperar contraseña</h2>
                            <p>Hola ${nombre},</p>
                            <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el botón de abajo para continuar:</p>
                            
                            <center>
                                <a href="${linkRecuperacion}" class="button">Cambiar contraseña</a>
                            </center>
                            
                            <p>O copia y pega este enlace:</p>
                            <p style="word-break: break-all; color: #666; font-size: 12px;">${linkRecuperacion}</p>
                            
                            <div class="warning">
                                <strong>🔐 Seguridad:</strong> Este enlace expira en 1 hora. Si no solicitaste esto, ignore el mensaje e ignora este correo.
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>© 2026 MindNotes. Todos los derechos reservados.</p>
                            <p>Este es un correo automático, no respondas a este mensaje.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Prueba la conexión SMTP
     */
    async verificarConexion() {
        try {
            await this.transporter.verify();
            console.log('✅ Conexión SMTP verificada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error en conexión SMTP:', error.message);
            return false;
        }
    }

    async enviarInforme(email, nombre, informeId) {
        try {
            const informeUrl = `${process.env.FRONTEND_URL}/psicologo/doc/${encodeURIComponent(informeId)}`;
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Informe terminado correctamente',
                html: this.__plantillaInforme(nombre, informeUrl)
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar correo de informe:', error);
        }
    }
    __plantillaInforme(nombre, informeUrl) {
        return `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
                    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: bold; color: #2973B2; }
                    .content { color: #333; line-height: 1.6; }
                    .button { display: inline-block; background: #92e9a5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                    .warning { background: #fee2e2; border: 1px solid #fecaca; padding: 10px; border-radius: 5px; margin: 20px 0; color: #991b1b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        <div class="header">
                            <div class="logo">MindNotes</div>
                        </div>
                        
                        <div class="content">
                            <h2>Informe terminado correctamente</h2>
                            <p>Hola ${nombre},</p>
                            <p>El informe ha sido elaborado correctamente. Haz clic en el botón de abajo para verlo:</p>
                            
                            <center>
                                <a href="${informeUrl}" class="button">Ver informe</a>
                            </center>
                            
                            <p>O copia y pega este enlace:</p>
                            <p style="word-break: break-all;">${informeUrl}</p>
                        </div>

                        <div class="footer">
                            <p>© ${new Date().getFullYear()} MindNotes. Todos los derechos reservados.</p>
                            <p>Este es un correo automático, no respondas a este mensaje.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
    }
    async confirmarCita(email, nombre, fechaCita,cita, nombrePsicologo) {
        try {
            const confirmadoUrl = `${process.env.FRONTEND_URL}/confirmar-cita/${cita}?status=confirmada`;
            const canceladoUrl = `${process.env.FRONTEND_URL}/confirmar-cita/${cita}?status=cancelada`;
             const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Confirmación de cita Mind Notes',
                html: this.__plantillaConfirmacion(nombre, confirmadoUrl, canceladoUrl,fechaCita, nombrePsicologo)
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar correo de confirmación de cita:', error);
        }
    }
    
    __plantillaConfirmacion(nombre, confirmadoUrl, canceladoUrl, fechaCita, nombrePsicologo) {
        return `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
                    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 28px; font-weight: bold; color: #2973B2; }
                    .content { color: #333; line-height: 1.6; }
                    .button { display: inline-block; background: #92e9a5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
                    .button2 { display: inline-block; background: #e99292; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
                    .warning { background: #fee2e2; border: 1px solid #fecaca; padding: 10px; border-radius: 5px; margin: 20px 0; color: #991b1b; }
                </style>
            </head>
                <body>
                    <div class="container">
                        <div class="card">
                            <div class="header">
                                <div class="logo">MindNotes</div>
                            </div>
                            
                            <div class="content">
                                <h2>Confirmación de cita Mind Notes con ${nombrePsicologo}</h2>
                                <p>Hola ${nombre},</p>
                                <p>Por favor confirma tu cita del dia ${fechaCita} con el psicólogo ${nombrePsicologo}. Haz clic en el botón de abajo para confirmar o cancelar tu cita:</p>
                                
                                <center>
                                    <a href="${confirmadoUrl}" class="button">Confirmar cita</a>
                                    <a href="${canceladoUrl}" class="button2">Cancelar cita</a>
                                </center>
                            </div>

                            <div class="footer">
                                <p>© ${new Date().getFullYear()} MindNotes. Todos los derechos reservados.</p>
                                <p>Este es un correo automático, no respondas a este mensaje.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>`;
        }
}

export default new EmailService();