import React, { useContext, useState } from 'react'
import './Planes.css'
import SubBtn from './components/SubBtn';
import EliminarBtn from './components/EliminarBtn';
import { AuthContext } from './context/AuthContext';
import Swal from 'sweetalert2';

export default function PerfilPsiF(props) {
    const [loading, setLoading] = useState(false);
    const { user, authenticated, loading: authLoading } = useContext(AuthContext);

    const handleCheckout = async (plan) => {
        if (!plan || loading) {
            return;
        }

        const idUsuario = user?.id || null;
        if (!authenticated || !idUsuario) {
            alert('Debes iniciar sesion para comprar un plan');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/psicologo/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    idUsuario,
                    plan
                })
            });

            const data = await response.json();

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
                <EliminarBtn texto = "Cancelar suscripccion"/>
            </div>
        </div>
    );
}