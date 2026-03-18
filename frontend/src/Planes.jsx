import React, { useContext, useState } from 'react'
import './Planes.css'
import SubBtn from './components/SubBtn';
import EliminarBtn from './components/EliminarBtn';
import { AuthContext } from './context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


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
            const response = await axios.post(`${API_URL}/psicologo/checkout`, {
                plan
            }, {
                withCredentials: true
            });

            const data = await response.data;

            if (data.success && data.url) {
                window.location.href = data.url;
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar el pago',
                text: data.error || 'No se pudo iniciar el pago'
            });
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

    const cancelSubscription = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/psicologo/cancel-subscription`, {}, {
                withCredentials: true
            });
            const data = await response.data;

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Suscripción cancelada',
                    text: data.message || 'Tu suscripción ha sido cancelada'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Ocurrió un error al cancelar la suscripción'
                });
            }
        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al cancelar la suscripción'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas cancelar tu suscripción? Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cancelar',
                cancelButtonText: 'No, mantener'
            });

            if (result.isConfirmed) {
                await cancelSubscription();
            }

        } catch (error) {
            console.error('Error al cancelar suscripción:', error);
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