import React, { useState} from 'react'
import {Link } from 'react-router-dom';
import Switch from './components/Switch'
import './login.css'

export default function Login() {
    const [modo, setModo] = useState('login')
    const [activo, setActivo] = useState(false)

    return (
        <div className={`loginContainer ${modo}`}>
            <div className='formBox login'>
                <form action="form-login">
                    <div className='div-titleLogin'>
                        <h1 className='login-title'>MindNotes</h1>
                    </div>
                    <div className='inputBox'>
                        <input type="text" placeholder='Usuario' required />
                    </div>

                    <div className='inputBox'>
                        <input type="password" placeholder='Contraseña' required />
                    </div>

                    <p className='p-switch'>¿Eres psicólogo?</p>
                    {/* <Switch
                        id={"pSwitch"} 
                        valor={false}
                        onCambio={(c)=>{!c}}
                    /> */}

                    <Switch
                        id="pSwitch"
                        valor={activo}
                        // onCambio={(c) => setActivo(!c)}
                        onCambio={setActivo}
                    />

                    <button type='submit' className='btn login'>Ingresar</button>

                    <div className='div-links'>
                        <div>
                            <input type="checkbox" className="input-recordarUsuario"/>
                            <label htmlFor="input-recordarUsuario">Recordar usuario</label>
                        </div>

                        <div className='forgotLink'>
                            <p>¿Aún no tienes cuenta?</p>
                            <Link to={''} className=''
                                onClick={(e) => {
                                        e.preventDefault()
                                        setModo('register')
                                    }}
                            >Registrarse --</Link>
                        </div>

                        <div className='forgotLink'>
                            <Link to=""
                                className="link-Password"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setModo('password')
                                }}
                                >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i className="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>


{/* ---------------------------REGISTRO--------------------------- */}
            <div className='formBox register'>
                <form action="form-register">
                    <div className='div-titleRegister'>         
                        <h1 className='register-title'>Registrar</h1>
                    </div>

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

                    <p className='p-switch'>¿Eres psicólogo?</p>
                    <Switch
                        id="pSwitch"
                        valor={activo}
                        // onCambio={(c) => setActivo(!c)}
                        onCambio={setActivo}
                    />

                    <button type='submit' className='btn register'>Registrarse</button>
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i className="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>


{/* ---------------------------Recuperar contraseña--------------------------- */}
            <div className='formBox password'>
                <form action="form-password">
                    <div className='div-titlePassword'>
                        <h1 className='password-title'>Reestablecer contraseña</h1>
                    </div>

                    <div className='inputBox'>
                        <input type="email" placeholder='Ingresa tu correo electronico' required />
                    </div>

                    <button type='submit' className='btn password'>Solicitar cambio de contraseña</button>
                </form>
            </div>



        <div className="toggle-box">
            <div className="toggle-panel toggle-left">
                <h1 className='title-saludo'>¡Hola, bienvenido!</h1>
                <p>¿Aún no tienes cuenta?</p>
                {/* <button
                    className="btn-toggleRegistrar"
                    onClick={() => setActivo(true)}
                    >
                    Registrarse
                </button> */}
                <button onClick={() => setModo('register')} className='btn register'>Registrarse</button>
            </div>

            <div className="toggle-panel toggle-right">
                <h1 className='title-saludo'>¡Hola, de nuevo!</h1>
                <p>¿Ya tienes cuenta?</p>
                {/* <button className='btn-toggleRegistrar'
                onClick={() => setActivo(false)}
                >Ingresar</button> */}
                <button onClick={() => setModo('login')}  className='btn login'>Ingresar</button>
            </div>
        </div>

        </div>
    )
}