import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emailAuthService } from './services/emailAuthService';
import './VerificarCuenta.css';

export default function VerificarCuenta() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('verificando'); // verificando, exito, error
    const [mensaje, setMensaje] = useState('Verificando tu cuenta...');
    
    // Flag para evitar múltiples llamadas al mismo endpoint
    const yaVerificado = useRef(false);

    useEffect(() => {
        // Solo ejecutar una vez
        if (!yaVerificado.current) {
            yaVerificado.current = true;
            handleToken();
        }
    }, [token]);

    const handleToken = async () => {
        try {
            const resultado = await emailAuthService.verificarCuenta(token);
            
            if (resultado.success) {
                setEstado('exito');
                setMensaje(resultado.message);
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setEstado('error');
                setMensaje(resultado.message || 'Error al verificar la cuenta');
            }
        } catch (error) {
            setEstado('error');
            setMensaje('Error al procesar la verificación');
        }
    };

    return (
        <div className='verificar-container'>
            <div className={`verificar-card ${estado}`}>
                <div className='verificar-icon'>
                    {estado === 'verificando' && <div className='spinner'></div>}
                    {estado === 'exito' && <span className='icon-exito'>✓</span>}
                    {estado === 'error' && <span className='icon-error'>✕</span>}
                </div>

                <h1 className='verificar-title'>
                    {estado === 'verificando' && 'Verificando tu cuenta...'}
                    {estado === 'exito' && '¡Cuenta Verificada!'}
                    {estado === 'error' && 'Error en la verificación'}
                </h1>

                <p className='verificar-mensaje'>{mensaje}</p>

                {estado === 'exito' && (
                    <p className='verificar-subtitulo'>
                        Serás redirigido al login en unos momentos...
                    </p>
                )}

                {estado === 'error' && (
                    <button 
                        className='btn verificar-btn'
                        onClick={() => navigate('/login')}
                    >
                        Volver al login
                    </button>
                )}
            </div>
        </div>
    );
}
