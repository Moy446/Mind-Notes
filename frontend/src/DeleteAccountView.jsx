import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { emailAuthService } from './services/emailAuthService';
import HeaderMenu from './components/headerAndFooter/HeaderMenu';
import FooterMenu from './components/headerAndFooter/FooterMenu';
import './DeleteAccountView.css';

export default function DeleteAccountView() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const mensaje = [
                'Solicitud de eliminacion de cuenta (Play Store).',
                `Nombre: ${nombre.trim()}`,
                `Correo: ${email.trim()}`,
                `Motivo: ${motivo.trim()}`
            ].join('\n');

            const response = await emailAuthService.comentarios(nombre.trim(), email.trim(), mensaje);

            if (!response?.success) {
                throw new Error(response?.message || 'No se pudo enviar la solicitud.');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Solicitud enviada',
                text: 'Recibimos tu solicitud de eliminacion de cuenta. Te contactaremos por correo.',
                confirmButtonColor: '#2973B2'
            });

            setNombre('');
            setEmail('');
            setMotivo('');
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.message || 'No se pudo enviar la solicitud.',
                confirmButtonColor: '#2973B2'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='delete-page'>
            <header>
                <HeaderMenu />
            </header>

            <main className='delete-page-main'>
                <section className='delete-page-hero'>
                    <h1>Eliminar cuenta</h1>
                    <p>
                        Estamos para ayudarte con tu solicitud. Este formulario es para usuarios de Play Store.
                    </p>
                </section>

                <form onSubmit={handleSubmit} className='delete-page-form'>
                    <h2 className='delete-page-title'>Solicitud de eliminacion</h2>
                    <p className='delete-page-subtitle'>
                        Completa este formulario para solicitar la eliminacion de tu cuenta.
                    </p>

                    <label htmlFor='delete-nombre' className='delete-page-label'>Nombre</label>
                    <input
                        id='delete-nombre'
                        type='text'
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className='delete-page-input'
                    />

                    <label htmlFor='delete-email' className='delete-page-label'>Correo</label>
                    <input
                        id='delete-email'
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='delete-page-input'
                    />

                    <label htmlFor='delete-motivo' className='delete-page-label'>Motivo</label>
                    <textarea
                        id='delete-motivo'
                        required
                        minLength={10}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder='Describe el motivo de eliminacion de tu cuenta...'
                        className='delete-page-textarea'
                    />

                    <button
                        type='submit'
                        disabled={loading}
                        className='delete-page-button'
                    >
                        {loading ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                </form>
            </main>

            <footer>
                <FooterMenu />
            </footer>
        </div>
    );
}