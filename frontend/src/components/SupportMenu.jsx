import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import './SupportMenu.css'
import { subirArchivo } from '../services/chatService';

export default function SupportMenu(props){

    const ref = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
            function handleClickOutside(event) {
                if (props.suppOpen && ref.current && !ref.current.contains(event.target)) {
                    props.handleOpen();
                }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.handleOpen]);

    const handleFileSelect = (event) =>{
        const file = event.target.files[0];
        if (file) {
            const maxSize = 50 * 1024 * 1024;
            
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: 'El archivo seleccionado excede el tamaño máximo permitido de 50 MB.',
                });
                return;
            }
            
            const confirmUpload = window.confirm(`¿Deseas subir el archivo "${file.name}"?`);
            if (confirmUpload) {
                handleUpload(file);
            } else {
                event.target.value = '';
            }
        }
    }

    const handleUpload = async (file) => {
        try {
            setIsUploading(true);
            
            // Validar que se hayan recibido los IDs necesarios
            if (!props.idPsicologo || !props.idPaciente) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir archivo',
                    text: 'No se puede subir el archivo. Debes seleccionar un chat primero.',
                });
                return;
            }

            console.log('Subiendo archivo con IDs:', { 
                idPsicologo: props.idPsicologo, 
                idPaciente: props.idPaciente 
            });

            const response = await subirArchivo(props.idPsicologo, props.idPaciente, file);
            console.log('Archivo subido exitosamente:', response);
            
            // Notificar al componente padre si tiene callback
            if (props.onFileUploaded) {
                props.onFileUploaded(response);
            }
            
            // Cerrar el menú
            props.handleOpen();
        } catch (error) {
            console.error('Error al subir archivo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al subir archivo',
                text: 'Error al subir el archivo. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = (accept) => {
        if (isUploading) return; // Evitar clics durante la carga
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
    };
    
    
    if (!props.suppOpen) return null;

    return (
        <div ref={ref} className='supp-menu'>
            {/* Input hidden para seleccionar archivos */}
            <input 
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={isUploading}
            />

            {isUploading && (
                <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                    Subiendo archivo...
                </div>
            )}

            <button 
                className='supp-btn' 
                onClick={() => triggerFileInput('.pdf,.doc,.docx,.txt')}
                disabled={isUploading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='svg-suppmenu'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <a className='txt-suppmenu'>
                    Documento
                </a>
            </button>

            <button 
                className='supp-btn' 
                onClick={() => triggerFileInput('video/*')}
                disabled={isUploading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='svg-suppmenu'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Pelicula
            </button>

            <button 
                className='supp-btn' 
                onClick={() => triggerFileInput('audio/*')}
                disabled={isUploading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='svg-suppmenu'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
                Podcast
            </button>
        </div>
    );
}