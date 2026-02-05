import React, { useState } from 'react';
import './EditModal.css';

export default function EditModal({ open, handleClose, title, currentValue, onSave, type = 'text' }) {
    const [value, setValue] = useState(currentValue || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!value || value.trim() === '') {
            setError('El campo no puede estar vacío');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSave(value);
            handleClose();
        } catch (err) {
            setError('Error al guardar los cambios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className='modal-overlay' onClick={handleClose}>
            <div className='edit-modal' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3>Editar {title}</h3>
                    <button className='close-btn' onClick={handleClose}>✕</button>
                </div>
                
                <div className='modal-body'>
                    <label>{title}</label>
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={loading}
                        className='modal-input'
                        placeholder={`Ingrese ${title.toLowerCase()}`}
                    />
                    
                    {error && (
                        <div className='modal-error'>
                             {error}
                        </div>
                    )}
                </div>

                <div className='modal-footer'>
                    <button 
                        className='btn-cancel' 
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        className='btn-save' 
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
