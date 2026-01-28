import React, { useState} from 'react'
import {Link } from 'react-router-dom';
import Switch from './components/Switch'
import './ReestablecerPassword.css'


// const [activo, setActivo] = useState(false)

function ReestablecerPassword() {
    return (
        <div className='ReestablecerContainer'>
{/* ---------------------------Reestablecer contraseña--------------------------- */}
            <div className='form reestablecer'>
                <form action="form-reestablecer">
                    <div className='div-reestablecer'>
                        <h1 className='reestablecer-title'>Reestablecer contraseña</h1>
                    </div>

                    <div className='input'>
                        <input type="password" placeholder='Ingresa tu nueva contraseña' required />
                    </div>

                    <div className='input'>
                        <input type="password" placeholder='Confirma tu contraseña' required />
                    </div>

                    {/* <p className='p-switch'>¿Eres psicólogo?</p>
                        <Switch
                            id="pSwitch"
                            valor={activo}
                            onCambio={setActivo}
                        /> */}

                    <button type='submit' className='btn reestablecer'>Cambiar contraseña</button>
                </form>
            </div>

                <div className="toggle tog-reestablecer">
                    <h1 className='title-minPassword'>MindNotes</h1>
                        <p>Protege tu cuenta</p>
                </div>

        </div>
    )
}

export default ReestablecerPassword