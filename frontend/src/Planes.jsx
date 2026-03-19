import React, { useContext, useState } from 'react'
import './Planes.css'
import SubBtn from './components/SubBtn';
import EliminarBtn from './components/EliminarBtn';
import { AuthContext } from './context/AuthContext';
import { checkout, cancelSubscription } from './services/stripeService';
import Swal from 'sweetalert2';

export default function PerfilPsiF(props) {
    const [loading, setLoading] = useState(false);
    const { user, authenticated, loading: authLoading } = useContext(AuthContext);

    const handleCheckout = async (plan) => {
        if (!plan || loading) {
            return;
        }

        if (!authenticated || !user?.id) {
            alert('Debes iniciar sesion para comprar un plan');
            return;
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
            setLoading(true);
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

        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="planes">
            <div>
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
                    price="USD$30"
                    des="Contratar plan semestral"
                    onClick={() => handleCheckout('seisMeses')}
                    disabled={loading || authLoading}
                />
                <SubBtn
                    time="1 Año"
                    price="USD$40"
                    des="Contratar  plan anual"
                    onClick={() => handleCheckout('unYear')}
                    disabled={loading || authLoading}
                />
            </div>
            <div className='cancelSubBtn'>
                <EliminarBtn
                    texto="Cancelar suscripccion"
                    onClick={() => handleCancelSubscription()}
                    disabled={loading || authLoading}
                />
            </div>
        </div>
    );
}