import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Switch from './components/Switch'
import Tooltipe from './components/Tooltipe'
import TerminosAvisoModal from './components/TerminosAvisoModal'
import { authService } from './services/authService'
import { AuthContext } from './context/AuthContext'
import { emailAuthService } from './services/emailAuthService';
import './login.css'
import Swal from 'sweetalert2';
import DisclaimerComponent from './components/Disclaimer';

let hasShownDisclaimer = false;

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useContext(AuthContext);
    const [modo, setModo] = useState('login');
    
    // Estados para modal de términos y privacidad
    const [mostrarModal, setMostrarModal] = useState(false);
    const [datosRegistroPendiente, setDatosRegistroPendiente] = useState(null);
    
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
    const [isPsicologo, setIsPsicologo] = useState(false); // Solo para registro
    const [registerError, setRegisterError] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);

    // Estado para recuperación de contraseña
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryError, setRecoveryError] = useState('');
    const [recoverySuccess, setRecoverySuccess] = useState('');
    const [recoveryLoading, setRecoveryLoading] = useState(false);

    useEffect(() => {
        const error = searchParams.get('error');
        const email = searchParams.get('email') || '';

        if (error === 'google_not_registered') {
            setModo('register');
            setRegisterEmail(email);
            setRegisterError('No existe una cuenta con ese correo. Registrate primero para continuar con Google.');
            return;
        }

        if (error === 'google_auth_failed') {
            setModo('login');
            setLoginError('No se pudo autenticar con Google. Intenta nuevamente.');
            return;
        }

        if (error === 'callback_error') {
            setModo('login');
            setLoginError('Error al procesar la autenticación con Google.');
        }
    }, [searchParams]);

    //Función de expresion regular para validar contraseña
    const validarPassword = (password) =>{
        const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    //Función Login con Google
    const handleGoogleLogin = (googleRole = null) => {
        const baseUrl = `${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}/api/auth/google`;
        if (googleRole) {
            window.location.href = `${baseUrl}?role=${googleRole}`;
            return;
        }

        // Redirigir directamente a la ruta de autenticación de Google en el backend
        window.location.href = baseUrl;
    };

    // Confirmar el tipo de cuenta antes de registrar con Google.
    const handleGoogleRegister = async () => {
        const role = isPsicologo ? 'psicologo' : 'paciente';
        const roleLabel = isPsicologo ? 'Psicologo' : 'Paciente';
        const switchHint = isPsicologo
            ? 'Si no eres psicologo, desactiva el switch antes de continuar.'
            : 'Si eres psicologo, activa el switch antes de continuar.';

        const result = await Swal.fire({
            icon: 'warning',
            title: `Te registraras como ${roleLabel}`,
            text: switchHint,
            showCancelButton: true,
            confirmButtonText: 'Continuar con Google',
            cancelButtonText: 'Revisar switch',
            confirmButtonColor: '#2973B2'
        });

        if (!result.isConfirmed) {
            return;
        }

        handleGoogleLogin(role);
    };


    // Función para manejar login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const result = await login(loginEmail, loginPassword);

            if (result && result.success) {
                // Redirigir según el tipo de usuario detectado automáticamente
                const userId = result?.user?.id;
                navigate(
                    result.role === 'psicologo'
                        ? `/psicologo/chat/${userId}`
                        : `/paciente/chat/${userId}`
                );
            } else {
                setLoginError(result?.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            setLoginError('Error al conectar con el servidor');
        } finally {
            setLoginLoading(false);
        }
    };

    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        if (!hasShownDisclaimer) {
        setShowDisclaimer(true);
        hasShownDisclaimer = true;
        }
    }, []);

    // Función para manejar registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError('');

        if (registerPassword !== registerPasswordConfirm) {
            setRegisterError('Las contraseñas no coinciden');
            return;
        }

        if(!validarPassword(registerPassword)){
            setRegisterError('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales');
            return;
        }

        // Guardar los datos del registro y mostrar modal
        setDatosRegistroPendiente({
            nombre: registerNombre,
            email: registerEmail,
            password: registerPassword,
            passwordConfirm: registerPasswordConfirm,
            esPsicologo: isPsicologo
        });
        setMostrarModal(true);
    };

    // Función para completar el registro después de aceptar términos
    const handleCompletarRegistro = async () => {
        if (!datosRegistroPendiente) return;

        setRegisterLoading(true);
        setMostrarModal(false);

        try {
            const { nombre, email, password, passwordConfirm, esPsicologo } = datosRegistroPendiente;
            
            const result = esPsicologo
                ? await authService.registrarPsicologo(nombre, email, password, passwordConfirm)
                : await authService.registrarPaciente(nombre, email, password, passwordConfirm);

            if (result.success) {
                setRegisterError('');
                setDatosRegistroPendiente(null);
                setModo('login');
                setLoginEmail(email);
                setLoginPassword('');
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Por favor inicia sesión',
                    confirmButtonColor: '#2973B2'
                });
            } else {
                setRegisterError(result.message);
            }
        } catch (error) {
            setRegisterError('Error al conectar con el servidor');
        } finally {
            setRegisterLoading(false);
        }
    };

    // Función para rechazar términos
    const handleRechazarTerminos = () => {
        setMostrarModal(false);
        setDatosRegistroPendiente(null);
        setRegisterError('Debes aceptar los términos y condiciones para registrarte');
    };

    // Función para manejar recuperación de contraseña
    const handleRecovery = async (e) => {
        e.preventDefault();
        setRecoveryError('');
        setRecoverySuccess('');
        setRecoveryLoading(true);
        try {
            const result = await emailAuthService.solicitarRecuperacion(recoveryEmail);
            if (result.success) {
                setRecoverySuccess('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Se ha enviado un correo para reestablecer tu contraseña. Revisa tu bandeja de entrada.',
                    confirmButtonColor: '#2973B2'
                });
            } else {
                setRecoveryError(result.message || 'Error al solicitar recuperación de contraseña');
            }
        } catch (error) {
            setRecoveryError('Error al solicitar recuperación de contraseña');
        } finally { 
            setRecoveryLoading(false);
        }
    };




    return (
        <div className={`loginContainer ${modo}`}>

{/* ---------------------------LOGIN--------------------------- */}

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

                    <button type='submit' className='btn login' id='formLogin'>Ingresar</button>


                    <div className='div-links'>

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
                        <button 
                            type='button'
                            className='google-button' 
                            onClick={() => handleGoogleLogin()}
                        >
                            <span className='google-icon' aria-hidden="true">
                                <i className="fa-brands fa-google"></i>
                            </span>
                            <span className='google-text'>Continuar con Google</span>
                        </button>
                    </div>           
                </form>

            </div>
            <button className='arrowBack' onClick={() => navigate('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={modo == 'login' ? {color: 'white'}:{color: 'black'} }>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>


            <div className={`${showDisclaimer ? 'modal-overlay': 'hidden'} `}>
                <div className="modal-container">
                    <DisclaimerComponent navigation = {navigate} onClick = {() => {setShowDisclaimer(false)}}/>
                </div>
            </div>

{/* ---------------------------REGISTRO--------------------------- */}
            <div className='formBox register'>
                <form onSubmit={handleRegister}>
                    <h1 className='register-title'>Registrar</h1>

                    {registerError && <div className='error-message' style={{color: 'red', marginBottom: '10px'}}>{registerError}</div>}
                                
                    <div className='inputBox registerInput'>
                        <input 
                            type="text" 
                            placeholder='Nombre completo' 
                            required 
                            value={registerNombre}
                            onChange={(e) => setRegisterNombre(e.target.value)}
                        />
                    </div>

                    <div className='inputBox registerInput'>
                        <input 
                            type="email" 
                            placeholder='Correo electronico' 
                            required 
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                    </div>

                    <div className='inputBox'>
                        <Tooltipe text="La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales como @, $, !, %, *, ?, &">
                        <input 
                            type="password" 
                            placeholder='Contraseña' 
                            required 
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                        />
                        </Tooltipe>
                    </div>

                    <div className='inputBox registerInput'>
                        <input 
                            type="password" 
                            placeholder='Confirmar contraseña' 
                            required 
                            value={registerPasswordConfirm}
                            onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                        />
                    </div>

                    

                    <p className='p-switch'>¿Eres psicólogo?</p>
                    <div className='div-buttons'>
                    <Switch
                        id="pSwitch2"
                        valor={isPsicologo}
                        onCambio={setIsPsicologo}
                    />

                    <button type='submit' className='btn register' id="btnFormRegister" disabled={registerLoading}>
                        {registerLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                    </div>
                    
                    <p>O ingresa con:</p>
                    <div className='div-google'>
                        <button 
                            type='button'
                            className='google-button register-googlebtn' 
                            onClick={handleGoogleRegister}
                        >
                            <span className='google-icon' aria-hidden="true">
                                <i className="fa-brands fa-google"></i>
                            </span>
                            <span className='google-text'>Continuar con Google</span>
                        </button>
                    </div>
 
                </form>
            </div>


{/* ---------------------------Recuperar contraseña--------------------------- */}
            <div className='formBox password'>
                <form onSubmit={handleRecovery}>
                    <div className='div-titlePassword'>
                        <h1 className='password-title'>Reestablecer contraseña</h1>
                    </div>

                    {recoveryError && <div className='error-message' style={{color: 'red', marginBottom: '10px'}}>{recoveryError}</div>}
                    {recoverySuccess && <div className='success-message' style={{color: 'green', marginBottom: '10px'}}>{recoverySuccess}</div>}

                    <div className='inputBox'>
                        <input type="email" 
                        placeholder='Ingresa tu correo electronico' 
                        required 
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        />
                    </div>

                    <button type='submit' className='btn password' disabled={recoveryLoading}>
                        {recoveryLoading ? 'Enviando...' : 'Enviar correo de recuperación'}
                    </button>

                    <div className='forgotLink'>
                        <Link to=""
                            className="link-login"
                            onClick={(e) => {
                                e.preventDefault()
                                setModo('login')
                            }}
                        >
                        </Link>
                    </div>
                </form>
            </div>

{/* -----------------------------Panel de color------------------------------- */}
        <div className="toggle-box">

            <div className="toggle-panel toggle-left">

                {/* <div className='arrowBack'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
</div> */}
                <h1 className='title-saludo'>¡Hola, bienvenido!</h1>
                <p>¿Aún no tienes cuenta?</p>
                {/* <button
                    className="btn-toggleRegistrar"
                    onClick={() => setActivo(true)}
                    >
                    Registrarse
                </button> */}
                <button onClick={() => setModo('register')} className='btn register' id='formRegister' >Registrarse</button>
                
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

        {mostrarModal && (
            <TerminosAvisoModal 
                onAceptar={handleCompletarRegistro}
                onRechazar={handleRechazarTerminos}
            />
        )}
        </div>
    )
}