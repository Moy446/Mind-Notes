import React, { useEffect, useRef, useState } from 'react'
import './AddUID.css'
import { vincularPaciente, vincularPsicologo } from '../services/vinculacionService'

export default function AddUID(props){
    
    const ref = useRef(null);
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
            function handleClickOutside(event) {
                if (props.open && ref.current && !ref.current.contains(event.target)) {
                    props.handleOpen();
                }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.handleOpen]);

    // Resetear estados al abrir/cerrar el modal
    useEffect(() => {
        if (props.open) {
            setUid('');
            setError('');
            setSuccess('');
        }
    }, [props.open]);

    const handleBuscarVincular = async () => {
        if (!uid || uid.trim().length !== 24) {
            setError('Por favor ingrese un UID válido (24 caracteres)');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Determinar el rol del usuario actual y la función correspondiente
            const userRole = props.userRole || 'psicologo'; // 'psicologo' o 'paciente'
            const userId = props.userId; // Obtén el ID desde props (ya viene del contexto del padre)
            
            let result;

            if (userRole === 'psicologo') {
                // El psicólogo vincula a un paciente
                result = await vincularPaciente(userId, uid.trim());
            } else {
                // El paciente vincula a un psicólogo
                result = await vincularPsicologo(userId, uid.trim());
            }

            if (result.success) {
                setSuccess(result.message);
                setUid('');
                
                // Actualizar la lista de pacientes/psicólogos si hay callback
                if (props.onVinculacionExitosa) {
                    props.onVinculacionExitosa();
                }

                // Cerrar el modal después de 2 segundos
                setTimeout(() => {
                    props.handleOpen();
                }, 2000);
            }
        } catch (err) {
            console.error('Error al vincular:', err);
            setError(
                err.response?.data?.message || 
                'Error al vincular. Verifique que el UID sea correcto y que no esté ya vinculado.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleQRClick = () => {
        // Cerrar este modal y abrir el de QR
        props.handleOpen();
        if (props.handleOpenQR) {
            props.handleOpenQR();
        }
    };
    
    if (!props.open) return null;

    return (
        <div ref={ref} className='Adduid'>
            <div className='row1'>
                <input 
                    type="text" 
                    id="uid" 
                    name="uid" 
                    placeholder="Ingresar UID (24 caracteres)" 
                    className='txtuid'
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    maxLength={24}
                    disabled={loading}
                />
                <button 
                    className='btnuid btnefect' 
                    onClick={handleBuscarVincular}
                    disabled={loading || !uid}
                >
                    {loading ? 'Vinculando...' : 'Buscar'}
                </button>
            </div>
            <button 
                className='btnqr btnefect'
                onClick={handleQRClick}
                disabled={loading}
            >
                Escanear codigo QR
            </button>
            
            {/* Mensajes de feedback */}
            {error && (
                <div style={{ 
                    color: '#ff4444', 
                    fontSize: '12px', 
                    marginTop: '10px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ 
                    color: '#00C851', 
                    fontSize: '12px', 
                    marginTop: '10px',
                    textAlign: 'center'
                }}>
                    ✓ {success}
                </div>
            )}
        </div>
    );
}