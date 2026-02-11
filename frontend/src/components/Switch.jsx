import React, { useState } from 'react'
import './Switch.css'

export default function Switch(props) {

    const handleChange = (event) => {
        // Soportar ambas formas de usar el componente
        if (props.onChange) {
            props.onChange(event.target.checked);
        } else if (props.onCambio) {
            props.onCambio(event.target.checked);
        }
    };

    // Soportar ambos nombres de props: value o valor
    const isChecked = props.value !== undefined ? props.value : props.valor;
    const id = props.id || 'switch-checkbox';

    return (
        <div className='div-switchContainer'>
            <input type="checkbox" id={props.id} className='offScreen' checked={props.valor} onChange={handleChange}/>
            <label for={props.id} className="div-switch"></label>
        </div>
    );
}