import React from 'react'
import './AddUID.css'

export default function AddUID(){

    return (
        <div className='Adduid'>
            <div className='row1'>
                <input type="number" id="uid" name="uid" placeholder="Ingresar UID" className='txtuid'></input>
                <button className='btnuid btnefect'>Buscar</button>
            </div>
            <button className='btnqr btnefect'>Escanear codigo QR</button>
        </div>
    );
}