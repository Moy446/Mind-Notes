import React, { useState } from 'react';
import { descargarArchivo, eliminarArchivo } from '../services/chatService';
import Swal, { SweetAlertResult } from 'sweetalert2';

export default function ArchivoItem({ archivo, idPsicologo, idPaciente, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const getIconoArchivo = (tipo) => {
        if (tipo.startsWith('audio/')) {
            return '🎵';
        }
        if (tipo.startsWith('video/')) {
            return '🎬';
        }
        if (tipo.includes('pdf')) {
            return '📄';
        }
        if (tipo.includes('word') || tipo.includes('document')) {
            return '📝';
        }
        if (tipo.includes('text')) {
            return '📋';
        }
        if (tipo.includes('epub') || tipo.includes('ebook')) {
            return '📚';
        }
        return '📎';
    };

    const formatearTamaño = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDescargar = async () => {
        try {
            setIsDownloading(true);
            const blob = await descargarArchivo(idPsicologo, idPaciente, archivo._id);
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = archivo.nombre;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al descargar archivo',
                text: 'Error al descargar el archivo. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm('¿Seguro que deseas eliminar este archivo?')) {
            return;
        }

        try {
            setIsDeleting(true);
            await eliminarArchivo(idPsicologo, idPaciente, archivo._id);
            onDelete(archivo._id);
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar archivo',
                text: 'Error al eliminar el archivo. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            margin: '8px 0',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{getIconoArchivo(archivo.type)}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', wordBreak: 'break-word' }}>
                        {archivo.nombre}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatearTamaño(archivo.tamaño || 0)} • {formatearFecha(archivo.createdAt)}
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={handleDescargar}
                    disabled={isDownloading}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isDownloading ? 'not-allowed' : 'pointer',
                        opacity: isDownloading ? 0.6 : 1,
                        fontSize: '12px'
                    }}
                >
                    {isDownloading ? '⬇️...' : '⬇️'}
                </button>
                <button
                    onClick={handleEliminar}
                    disabled={isDeleting}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        opacity: isDeleting ? 0.6 : 1,
                        fontSize: '12px'
                    }}
                >
                    {isDeleting ? '🗑️...' : '🗑️'}
                </button>
            </div>
        </div>
    );
}
