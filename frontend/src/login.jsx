import React, { useState} from 'react'
import {Link } from 'react-router-dom';
import './login.css'

export default function Login() {
    const [activo, setActivo] = useState(false)

    return (
        <div className={`loginContainer ${activo ? 'active' : ''}`}>
            <div className='formBox login'>
                <form action="form-login">
                    <h1 className='login-title'>MindNotes</h1>

                    <div className='inputBox'>
                        <input type="text" placeholder='Usuario' required />
                    </div>

                    <div className='inputBox'>
                        <input type="password" placeholder='Contraseña' required />
                    </div>

                    <div className='forgotLink'>
                        <Link to={''} className=''>¿Olvidaste tu contraseña?</Link>
                    </div>

                    <button type='submit' className='btn-login'>Ingresar</button>
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i className="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>



            <div className='formBox register'>
                <form action="form-register">
                    <h1 className='register-title'>Registrar</h1>

                    <div className='inputBox'>
                        <input type="text" placeholder='Nombre completo' required />
                    </div>

                    <div className='inputBox'>
                        <input type="email" placeholder='Correo electronico' required />
                    </div>

                    <div className='inputBox'>
                        <input type="password" placeholder='Contraseña' required />
                    </div>

                    <div className='inputBox'>
                        <input type="passwordConfirm" placeholder='Confirmar contraseña' required />
                    </div>

                    <button type='switchButton'></button>  

                    <button type='submit' className='btn-register'>Registrarse</button>
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i class="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>



        <div className='toggle-box'>
            <div className="toggle-panel toggle-left">
                <h1 className='title-saludo'>¡Hola, bienvenido!</h1>
                <p>¿Aún no tienes cuenta?</p>
                <button
                    className="btn-toggleRegistrar"
                    onClick={() => setActivo(true)}
                    >
                    Registrarse
                </button>
            </div>

            <div className="toggle-panel toggle-right">
                <h1 className='title-saludo'>¡Hola, de nuevo!</h1>
                <p>¿Ya tienes cuenta?</p>
                <button className='btn-toggleRegistrar'
                onClick={() => setActivo(false)}
                >Ingresar</button>
            </div>
        </div>

        </div>
    )
}