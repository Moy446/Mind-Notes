import React, { useState } from 'react'
import './HorarioItem.css'
import Switch from './Switch';

export default function HorarioItem(props) {

    const handleSwitchChange = (nuevoValor) => {
        props.onCambio({ ...props.valor, activo: nuevoValor });
    };

    const handleInicioChange = (e) => {
        const nuevoInicio = e.target.value;
        props.onCambio({ ...props.valor, inicio: nuevoInicio });
    };

    const handleFinChange = (e) => {
        const nuevoFin = e.target.value;
        props.onCambio({ ...props.valor, fin: nuevoFin });
    };

    return (
        <div className="horarioItem">
            <Switch id={props.day} valor={props.valor.activo} onCambio={handleSwitchChange} />
            {props.day}
            <div className={props.valor.activo ? "showTime" : "hideTime"}>
                <input type='time' className='dateIn' value={props.valor.inicio} onChange={handleInicioChange} />
                <hr className='line' />
                <input type='time' className='dateIn' value={props.valor.fin} onChange={handleFinChange} />
            </div>
        </div>
    );
}