import React from 'react'
import './AddQr.css'

export default function AddQr(props){

    return (
        <div className='addqr'>
            <span className='title-addqr'>{props.title}</span>
            <img src={props.img} alt="Descripción de la imagen" className='img-addqr'/>
            <button className='cancel-addqr'>Cancelar</button>
        </div>
    );
}