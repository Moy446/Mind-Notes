import Stripe from 'stripe';
import Usuario from '../models/Usuario.js';
import "dotenv/config";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {

    //Sesion de pago
    async sesionPago(req, res) {
        try {
            const { idUsuario, plan } = req.body;

            if (!idUsuario || !plan) {
                return res.status(400).json({
                    success: false,
                    error: 'idUsuario y plan son requeridos'
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

            const session = await stripeClient.checkout.sessions.create({
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
                success_url: `${process.env.FRONTEND_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/planes`,
                metadata: {
                    idUsuario: usuario.idUsuario.toString(),
                    plan: plan
                }
            });
            return res.status(200).json({ 
                success: true,
                sessionId: session.id,
                url: session.url
            });

        }
            catch (error) {
            console.error('Error al crear la sesión de pago:', error);
            res.status(500).json({ error: 'Error al crear la sesión de pago' });
        }
    }

    async confirmarPago(req, res) {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        try{
            const event = stripeClient.webhooks.constructEvent(req.body, sig, endpointSecret);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const { idUsuario, plan } = session.metadata;
                
                const modelUsuario = new Usuario();

                await modelUsuario.activarPlan(idUsuario, plan, session.id);
                console.log(`Pago confirmado para el usuario ${idUsuario} con el plan ${plan}`);
            }

            res.status(200).json({ received: true });
        } catch(error) {
            console.error('Error al confirmar el pago:', error);
            res.status(400).json({ error: 'Error al confirmar el pago' });
        }
    }

    async obtenerSuscripcion(req, res) {
        try {
            const { idUsuario } = req.params;
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
}

export default new PaymentController();