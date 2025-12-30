import React from 'react'
import './DeleteMenu.css'

export default function DeleteMenu(props){

    return (
        <div className='deletemenu'>
            <span className='title-deletemenu'>{props.title}</span>
            <span className='subtutle'>{props.subtitle}</span>
            <div className='buttons'>
                <button className='cancel-button'>Cancelar</button>
                <button className='acceptBtnD'>Aceptar</button>
            </div>
            
        </div>
    );
}