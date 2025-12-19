import React from 'react'
import './EliminarBtn.css'

export default function EliminarBtn(props){

    return (
        <button type="submit" className="eliminar-btn">
            <img src={props.img} alt="Descripción de la imagen" className='image-eliminar'/>
            {props.texto}
        </button>
    );
}