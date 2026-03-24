import React, { Component, useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import clienteAxios from './services/axios.js'
import './confirmarCita.css'
export default function confirmarCita() {
    const { id } = useParams()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');

    const [statusCita, setStatusCita] = useState('confirmando');
    useEffect(() => {
        const confirmarCita = async () => {
            try {
                await clienteAxios.get(`/confirmar-cita/${id}?status=${status}`);
                setStatusCita(status);
            } catch (error) {
                console.log('Id de cita erroneo:', error);
                navigate('/login')
            }
        }
        confirmarCita();
    },[])

    return(
        <div className='confirmar-container'>
            <div className={`confirmar-card ${statusCita}`}>
                <div className='confirmar-icon'>
                    {status === 'confirmando' && <div className='spinner'></div>}
                    {statusCita === 'confirmada' && <span className='icon-exito'>✓</span>}
                    {statusCita === 'cancelada' && <span className='icon-error'>✕</span>}
                </div>

                <h1 className='confirmar-title'>
                    {status === 'confirmando' && 'Verificando tu cita...'}
                    {statusCita === 'confirmada' && '¡Cita Confirmada!'}
                    {statusCita === 'cancelada' && 'Error en la confirmación'}
                </h1>

                <p className='confirmar-mensaje'>Ya puede cerrar esta ventana :)</p>
            </div>
        </div>
    )
}