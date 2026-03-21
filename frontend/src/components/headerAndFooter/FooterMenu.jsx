import React from 'react'
import { useState } from 'react';
import './FooterMenu.css'
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';
import { emailAuthService }  from '../../services/emailAuthService';

//Logo
import logoBlanco from '../../images/logoCompletoBlanco.png'

export default function FooterMenu(){

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendComment = async (e) => {
        e.preventDefault();

        const nombre = formData.nombre.trim();
        const email = formData.email.trim();
        const mensaje = formData.mensaje.trim();

        if (!nombre || !email || !mensaje) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Completa todos los campos para enviar tu comentario.'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Correo no valido',
                text: 'Ingresa un correo electronico valido.'
            });
            return;
        }

        setLoading(true);

        try {
            const result = await emailAuthService.comentarios(nombre, email, mensaje);

            if (result?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mensaje enviado',
                    text: result?.message || 'Gracias por contactarnos. Te responderemos pronto.'
                });
                setFormData({ nombre: '', email: '', mensaje: '' });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo enviar',
                    text: result?.message || 'Ocurrio un error al enviar el comentario.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'No fue posible enviar el comentario en este momento.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <div className='div-completeFooter'>
            <div className='div-FooterContenedor'>
                <img src={logoBlanco} alt="Descripción de la imagen" className='img-footermenu'/>
                <div className='nav-footermenu'>

                    <div className='one'>
                        <h4>¿Quienes somos?</h4>
                        <p>Somos una herramienta para mejorar el proceso administrativo de los psicólogos
                            con cada uno de los pacientes que atienden.
                        </p>
                        
                    </div>
                    <div className='two'>
                        <ul>
                            <li><a className='a-footermenu'><h4>Mind Notes</h4></a></li>
                            <li><Link to={'/'} className='li-link'>Nosotros</Link></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>¿Cómo funciona?</Link></li>
                            <li><Link to={"/PlanesGeneral"} className='li-link'>Precios</Link></li>
                            <li><Link to={"/Login"} className='li-link'>Ingresar</Link></li>
                        </ul>    
                    </div>

                    <div className='three'>
                        <ul>
                            <li><a className='a-footermenu'><h4>Legal</h4></a></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>Privacidad</Link></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>Terminos y condiciones</Link></li>
                        </ul>
                    </div>

                    <div className='four'>
                        <h4>Contactanos</h4>
                        <form onSubmit={handleSendComment}>
                            <ul>
                                <li>
                                    <input
                                        placeholder='Nombre'
                                        className= "input-footer"
                                        type="text"
                                        name='nombre'
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </li>
                                <li>
                                    <input
                                        placeholder='Correo'
                                        className= "input-footer"
                                        type="email"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </li>
                                <li>
                                    <input
                                        placeholder='Mensaje'
                                        className= "input-footer"
                                        type="text"
                                        name='mensaje'
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                    />
                                </li>
                                <li>
                                    <button className= "btn-enviar" type='submit' disabled={loading}>
                                        {loading ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
            <div className='footer-CopyrightElement'>
                <p className='CopyrightElement'>2026 @ Todos los derechos reservados. Mind Notes</p>
                <a href="https://www.facebook.com" className='a-icons'><i className="fa-brands fa-facebook "></i></a>
                <a href="https://www.instagram.com/mindnotes_oficial?igsh=bHM4bGVkY2h5aWhz" className='a-icons'><i className="fa-brands fa-instagram"></i></a>
                <a href="https://www.tiktok.com" className='a-icons'><i className="fa-brands fa-tiktok"></i></a>
            </div>
        </div>
    );
}