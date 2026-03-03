import React, { useState } from 'react'
import './HorarioItem.css'
import Switch from './Switch';

export default function HorarioItem(props) {

    return (
        <div className="horarioItem">
            <Switch id={props.day} valor={props.valor} onCambio={props.onCambio} />
            {props.day}
            <div className={props.valor ? "showTime" : "hideTime"}>
                <input type='time' className='dateIn-psi' />
                <hr className='line' />
                <input type='time' className='dateIn-psi' />
            </div>
        </div>
    );
}