import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Switch from './components/Switch'
import { authService } from './services/authService'
import './login.css'

export default function Login() {
    const navigate = useNavigate();
    const [activo, setActivo] = useState(false)
    
    // Estados para login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    
    // Estados para registro
    const [registerNombre, setRegisterNombre] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
    const [isPsicologo, setIsPsicologo] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);

    // Función para manejar login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const result = isPsicologo 
                ? await authService.loginPsicologo(loginEmail, loginPassword)
                : await authService.loginPaciente(loginEmail, loginPassword);

            if (result && result.success) {
                // Redirigir según el tipo de usuario
                navigate(isPsicologo ? '/menuPsicologoPrincipal' : '/menuPaciente');
            } else {
                setLoginError(result?.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            setLoginError('Error al conectar con el servidor');
        } finally {
            setLoginLoading(false);
        }
    };

    // Función para manejar registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterLoading(true);

        if (registerPassword !== registerPasswordConfirm) {
            setRegisterError('Las contraseñas no coinciden');
            setRegisterLoading(false);
            return;
        }

        try {
            const result = isPsicologo
                ? await authService.registrarPsicologo(registerNombre, registerEmail, registerPassword, registerPasswordConfirm)
                : await authService.registrarPaciente(registerNombre, registerEmail, registerPassword, registerPasswordConfirm);

            if (result.success) {
                setRegisterError('');
                setActivo(false); // Cambiar a formulario de login
                setLoginEmail(registerEmail);
                setLoginPassword('');
                alert('Registro exitoso. Por favor inicia sesión');
            } else {
                setRegisterError(result.message);
            }
        } catch (error) {
            setRegisterError('Error al conectar con el servidor');
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
        <div className={`loginContainer ${activo ? 'active' : ''}`}>
            <div className='formBox login'>
                <form onSubmit={handleLogin}>
                    <h1 className='login-title'>MindNotes</h1>

                    {loginError && <div className='error-message' style={{color: 'red', marginBottom: '10px'}}>{loginError}</div>}

                    <div className='inputBox'>
                        <input 
                            type="email" 
                            placeholder='Correo' 
                            required 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </div>

                    <div className='inputBox'>
                        <input 
                            type="password" 
                            placeholder='Contraseña' 
                            required 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <input type="checkbox" className="input-recordarUsuario" id="label-recordarUsuario"/>
                        <label htmlFor="label-recordarUsuario">Recordar usuario</label>
                    </div>

                    <div className='forgotLink'>
                        <Link to={''} className=''>¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div className='forgotLink'>
                        <p>¿Aún no tienes cuenta?</p>
                        <Link to={''} className=''>Registrarse --</Link>
                    </div>

                    <button type='submit' className='btn login' disabled={loginLoading}>
                        {loginLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i className="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>



            <div className='formBox register'>
                <form onSubmit={handleRegister}>
                    <h1 className='register-title'>Registrar</h1>

                    {registerError && <div className='error-message' style={{color: 'red', marginBottom: '10px'}}>{registerError}</div>}

                    <div className='inputBox'>
                        <input 
                            type="text" 
                            placeholder='Nombre completo' 
                            required 
                            value={registerNombre}
                            onChange={(e) => setRegisterNombre(e.target.value)}
                        />
                    </div>

                    <div className='inputBox'>
                        <input 
                            type="email" 
                            placeholder='Correo electronico' 
                            required 
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                    </div>

                    <div className='inputBox'>
                        <input 
                            type="password" 
                            placeholder='Contraseña' 
                            required 
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                    </div>

                    <div className='inputBox'>
                        <input 
                            type="password" 
                            placeholder='Confirmar contraseña' 
                            required 
                            value={registerPasswordConfirm}
                            onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                        />
                    </div>

                    <p className='p-switch'>¿Eres psicólogo?</p>
                    <Switch value={isPsicologo} onChange={setIsPsicologo}/>

                    <button type='submit' className='btn register' disabled={registerLoading}>
                        {registerLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <a href="https://www.google.com" className='google-icon'><i className="fa-brands fa-google"></i></a>
                    </div>
                </form>
            </div>



        <div className="toggle-box">
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