import Stripe from 'stripe';
import Usuario from '../models/Usuario.js';
import "dotenv/config";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {

    constructor() {
        this.sesionPago = this.sesionPago.bind(this);
        this.confirmarPago = this.confirmarPago.bind(this);
        this.obtenerSuscripcion = this.obtenerSuscripcion.bind(this);
        this.cancelarSuscripcion = this.cancelarSuscripcion.bind(this);
    }

    getConfigError() {
        if (!process.env.STRIPE_SECRET_KEY) {
            return 'STRIPE_SECRET_KEY no configurada';
        }

        if (!process.env.FRONTEND_URL) {
            return 'FRONTEND_URL no configurada';
        }

        return null;
    }

    //Sesion de pago
    async sesionPago(req, res) {
        try {
            const configError = this.getConfigError();
            if (configError) {
                return res.status(500).json({
                    success: false,
                    error: configError
                });
            }

            const { idUsuario: idUsuarioBody, plan } = req.body;
            const idUsuarioToken = req.user?.idUsuario?.toString?.() || null;
            const idUsuario = idUsuarioToken || idUsuarioBody;

            if (!idUsuario || !plan) {
                return res.status(400).json({
                    success: false,
                    error: 'idUsuario y plan son requeridos'
                });
            }

            // Evita que un usuario autenticado pague planes para otra cuenta.
            if (idUsuarioToken && idUsuarioBody && idUsuarioToken !== idUsuarioBody) {
                return res.status(403).json({
                    success: false,
                    error: 'No autorizado para operar sobre otro usuario'
                });
            }

            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findById(idUsuario);

            if (!usuario || !usuario.esPsicologo) {
                return res.status(403).json({
                    success: false,
                    error: 'Solo psicologos pueden comprar planes'
                });
            }

            //Precios de planes 
            const planes = {

                // Los Precios en centavos 1000 = 10.00 USD
                unMes: {
                    nombre: 'Plan de 1 mes',
                    precio: 1000,
                    duracion: 30
                },
                seisMeses: {
                    nombre: 'Plan de 6 meses',
                    precio: 3000,
                    duracion: 180
                },
                unYear: {
                    nombre: 'Plan de 12 meses',
                    precio: 4000,
                    duracion: 365
                }
            };

            if (!planes[plan]) {
                return res.status(400).json({
                    success: false,
                    error: 'Plan no existe'
                });
            }

            let stripeCustomerId = usuario.stripeCustomerId;

            // 1) Asegura que el customer exista en Stripe.
            // Si no existe (borrado en dashboard/test reset), crea uno nuevo y actualiza BD.
            if (stripeCustomerId) {
                try {
                    await stripeClient.customers.retrieve(stripeCustomerId);
                } catch (err) {
                    const isMissingCustomer =
                        err?.code === 'resource_missing' ||
                        err?.raw?.code === 'resource_missing' ||
                        /No such customer/i.test(err?.message || '');

                    if (isMissingCustomer) {
                        stripeCustomerId = null;
                    } else {
                        throw err;
                    }
                }
            }

            if (!stripeCustomerId) {
                const customer = await stripeClient.customers.create({
                    email: usuario.email,
                    name: usuario.nombre,
                    metadata: {
                        idUsuario: usuario.idUsuario.toString()
                    }
                });

                stripeCustomerId = customer.id;
                await modelUsuario.updateStripeCustomerId(idUsuario, stripeCustomerId);
            }

            // 2) Crea SIEMPRE una sesión nueva por intento de pago.
            // Idempotency key opcional para evitar duplicados por doble click/reintento de red.
            const idemKey = `${idUsuario}:${plan}:${Date.now()}`;

            const session = await stripeClient.checkout.sessions.create(
                {
                    customer: stripeCustomerId,
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: planes[plan].nombre,
                                    description: `Duracion: ${planes[plan].duracion} dias`
                                },
                                unit_amount: planes[plan].precio
                            },
                            quantity: 1
                        }
                    ],
                    mode: 'payment',
                    success_url: `${process.env.FRONTEND_URL}/psicologo/planes?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.FRONTEND_URL}/psicologo/planes`,
                    metadata: {
                        idUsuario: usuario.idUsuario.toString(),
                        plan
                    }
                },
                { idempotencyKey: idemKey }
            );

            return res.status(200).json({
                success: true,
                sessionId: session.id,
                url: session.url
            });

        }
        catch (error) {
            console.error('Error al crear la sesión de pago:', {
                message: error?.message,
                type: error?.type,
                code: error?.code,
                rawCode: error?.raw?.code,
                rawMessage: error?.raw?.message,
                stack: error?.stack
            });

            return res.status(500).json({
                success: false,
                error: error?.raw?.message || error?.message || 'Error al crear la sesión de pago'
            });
        }
    }

    async confirmarPago(req, res) {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        try {
            console.log('Webhook Stripe recibido en /api/psicologo/webhook/stripe');

            if (!endpointSecret) {
                return res.status(500).json({
                    success: false,
                    error: 'STRIPE_WEBHOOK_SECRET no configurada'
                });
            }

            if (endpointSecret.includes('...')) {
                return res.status(500).json({
                    success: false,
                    error: 'STRIPE_WEBHOOK_SECRET invalida (placeholder). Configura el valor real de Stripe.'
                });
            }

            if (!sig) {
                return res.status(400).json({
                    success: false,
                    error: 'Firma Stripe no proporcionada'
                });
            }

            const event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const { idUsuario, plan } = session.metadata;
                const planesValidos = new Set(['unMes', 'seisMeses', 'unYear']);

                if (session.payment_status !== 'paid') {
                    return res.status(200).json({
                        received: true,
                        skipped: 'La sesion aun no esta pagada'
                    });
                }

                if (!idUsuario || !plan) {
                    return res.status(400).json({
                        success: false,
                        error: 'Metadata de pago incompleta'
                    });
                }

                if (!planesValidos.has(plan)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Plan de pago no valido en metadata'
                    });
                }

                const modelUsuario = new Usuario();
                const usuario = await modelUsuario.findById(idUsuario);

                if (!usuario || !usuario.esPsicologo) {
                    return res.status(404).json({
                        success: false,
                        error: 'Usuario de pago no encontrado'
                    });
                }

                // Evita reprocesar el mismo evento cuando Stripe reintenta el webhook.
                if (usuario?.suscripcion?.stripeSubscriptionId === session.id) {
                    return res.status(200).json({
                        received: true,
                        skipped: 'Evento ya procesado'
                    });
                }

                const updateResult = await modelUsuario.activarPlan(idUsuario, plan, session.id);
                console.log('Plan activado:', {
                    idUsuario,
                    plan,
                    sessionId: session.id,
                    matchedCount: updateResult.matchedCount,
                    modifiedCount: updateResult.modifiedCount
                });
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Error al confirmar el pago:', error);
            res.status(400).json({ error: 'Error al confirmar el pago' });
        }
    }

    async obtenerSuscripcion(req, res) {
        try {
            const { idUsuario: idUsuarioParams } = req.params;
            const idUsuarioToken = req.user?.idUsuario?.toString?.() || null;
            const idUsuario = idUsuarioToken || idUsuarioParams;

            if (idUsuarioToken && idUsuarioParams && idUsuarioToken !== idUsuarioParams) {
                return res.status(403).json({
                    success: false,
                    error: 'No autorizado para consultar otra suscripcion'
                });
            }

            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findById(idUsuario);

            if (!usuario || !usuario.esPsicologo) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                suscripcion: usuario.suscripcion
            });
        } catch (error) {
            console.error('Error al obtener suscripcion:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener suscripcion'
            });
        }
    }

    async cancelarSuscripcion(req, res) {
        try {
            const idUsuario = req.user?.idUsuario?.toString?.();
            if (!idUsuario) {
                return res.status(401).json({
                    success: false,
                    error: 'No autenticado'
                });
            }
            const modelUsuario = new Usuario();
            const usuario = await modelUsuario.findById(idUsuario);
            if (!usuario || !usuario.esPsicologo) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }
            if (!usuario.suscripcion || !usuario.suscripcion.stripeSubscriptionId) {
                return res.status(400).json({
                    success: false,
                    error: 'No tienes una suscripción activa para cancelar'
                });
            }

            const stripeReferenceId = usuario.suscripcion.stripeSubscriptionId;

            // Soporta ambos escenarios: sesiones checkout (cs_) y suscripciones reales (sub_).
            if (stripeReferenceId.startsWith('cs_')) {
                const checkoutSession = await stripeClient.checkout.sessions.retrieve(stripeReferenceId);

                if (checkoutSession.status === 'open') {
                    await stripeClient.checkout.sessions.expire(stripeReferenceId);
                }
            } else if (stripeReferenceId.startsWith('sub_')) {
                await stripeClient.subscriptions.cancel(stripeReferenceId);
            }

            await modelUsuario.cancelarPlan(idUsuario);
            return res.status(200).json({
                success: true,
                message: 'Suscripción cancelada exitosamente'
            });
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al cancelar suscripción'
            });
        }   
    }
}

export default new PaymentController();