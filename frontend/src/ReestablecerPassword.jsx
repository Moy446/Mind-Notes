import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emailAuthService } from './services/emailAuthService';
import './ReestablecerPassword.css';

export default function ReestablecerPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [exito, setExito] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones
        if (!token) {
            setError('Token no válido. Intenta de nuevo.');
            setLoading(false);
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError('Todos los campos son requeridos');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const resultado = await emailAuthService.cambiarPassword(token, newPassword, confirmPassword);

            if (resultado.success) {
                setExito(true);
                setNewPassword('');
                setConfirmPassword('');
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(resultado.message || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    if (exito) {
        return (
            <div className='resetear-container'>
                <div className='resetear-card exito'>
                    <div className='icon-exito'>✓</div>
                    <h2>Contraseña actualizada</h2>
                    <p>Tu contraseña ha sido cambiada exitosamente.</p>
                    <p className='subtexto'>Serás redirigido al login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='ReestablecerContainer'>
            <div className='form reestablecer'>
                <form onSubmit={handleSubmit}>
                    <div className='div-reestablecer'>
                        <h1 className='reestablecer-title'>Restablecer contraseña</h1>
                    </div>

                    {error && (
                        <div className='error-message'>
                            <span>⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className='input'>
                        <label htmlFor='newPassword'>Nueva contraseña</label>
                        <input
                            id='newPassword'
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder='Ingresa tu nueva contraseña'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength='8'
                        />
                        <small>Mínimo 8 caracteres</small>
                    </div>

                    <div className='input'>
                        <label htmlFor='confirmPassword'>Confirmar contraseña</label>
                        <input
                            id='confirmPassword'
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder='Confirma tu contraseña'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength='8'
                        />
                    </div>

                    <div className='show-password'>
                        <input
                            id='mostrarPassword'
                            type='checkbox'
                            checked={mostrarPassword}
                            onChange={() => setMostrarPassword(!mostrarPassword)}
                        />
                        <label htmlFor='mostrarPassword'>Mostrar contraseña</label>
                    </div>

                    <button 
                        type='submit' 
                        className='btn'
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Restablecer contraseña'}
                    </button>
                </form>
            </div>

            <div className="toggle tog-reestablecer">
                <h1 className='title-minPassword'>MindNotes</h1>
                <p>Protege tu cuenta</p>
            </div>
        </div>
    );
}