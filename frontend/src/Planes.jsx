import React, { useContext, useEffect, useState } from 'react'
import './Planes.css'
import SubBtn from './components/SubBtn';
import EliminarBtn from './components/EliminarBtn';
import { AuthContext } from './context/AuthContext';
import { checkout, cancelSubscription, getSubscriptionStatus, confirmCheckoutSession } from './services/stripeService';
import Swal from 'sweetalert2';

export default function PerfilPsiF(props) {
    const [loading, setLoading] = useState(false);
    const { user, authenticated, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get('session_id');

        if (!sessionId || authLoading || !authenticated) {
            return;
        }

        const confirmPayment = async () => {
            try {
                const data = await confirmCheckoutSession(sessionId);
                if (data?.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Pago confirmado',
                        text: 'Tu plan fue activado correctamente'
                    });

                    searchParams.delete('session_id');
                    const cleanQuery = searchParams.toString();
                    const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}`;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            } catch (error) {
                console.error('Error al confirmar sesión de checkout:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Pago no confirmado',
                    text: error.message || 'No se pudo confirmar el pago en el servidor'
                });
            }
        };

        confirmPayment();
    }, [authLoading, authenticated]);

    const handleCheckout = async (plan) => {
        if (!plan || loading) {
            return;
        }

        if (!authenticated || !user?.id) {
           Swal.fire({
                icon: 'warning',
                title: 'No autenticado',
                text: 'Debes iniciar sesión para contratar un plan.'
            });
        }

        try {
            setLoading(true);
            const data = await checkout(plan);
            if (data.success && data.url) {
                window.location.assign(data.url);
                return;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar el pago',
                    text: data.error || 'Ocurrió un error al procesar el pago'
                });
            }
        } catch (error) {
            console.error('Error al crear sesion de pago:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al procesar el pago',
                text: 'Ocurrió un error al procesar el pago'
            });
        } finally {
            setLoading(false);
        }
    };



    const handleCancelSubscription = async () => {
        try {
            if (!authenticated || !user?.id) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No autenticado',
                    text: 'Debes iniciar sesión para cancelar tu suscripción.'
                });
            }
            else {
                const subscriptionStatus = await getSubscriptionStatus(user.id);
                if (!subscriptionStatus) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Información',
                        text: 'No tienes una suscripción activa para cancelar'
                    });
                    return;
                }
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: '¿Deseas cancelar tu suscripción? Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, cancelar',
                    cancelButtonText: 'No, mantener'
                });
                if (result.isConfirmed) {
                    await cancelSubscription(user.id);
                }

            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cancelar suscripción',
                text: error.message || 'Ocurrió un error al cancelar la suscripción'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="planes">
            <div id='PlanesTitle'>
                Planes
            </div>
            <div className='plaBtns'>
                <SubBtn time="30 Días" price="Gratis" des="Contratar prueba gratuita" />
                <SubBtn
                    time="1 Mes"
                    price="USD$10"
                    des="Contratar plan mensual"
                    onClick={() => handleCheckout('unMes')}
                    disabled={loading || authLoading}
                />
                <SubBtn
                    time="6 Meses"
                    price="USD$35"
                    des="Contratar plan semestral"
                    onClick={() => handleCheckout('seisMeses')}
                    disabled={loading || authLoading}
                />
                <SubBtn
                    time="1 Año"
                    price="USD$80"
                    des="Contratar  plan anual"
                    onClick={() => handleCheckout('unYear')}
                    disabled={loading || authLoading}
                />
            </div>
            <div className='cancelSubBtn'>
                <EliminarBtn
                    texto="Cancelar suscripción"
                    onClick={() => handleCancelSubscription()}
                    disabled={loading || authLoading}
                />
            </div>
        </div>
    );
}