import React from 'react'
import './CitasList.css'

export default function Cita(props) {

    return (
        <div className='cita'>
            <img src={props.img} className='imgcita' />
            Cita {props.name}
            <br />
            {props.hora}
        </div>
    );
}