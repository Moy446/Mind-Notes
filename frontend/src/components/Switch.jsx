import React from 'react'
import './Switch.css'

export default function Switch(props) {

    const handleChange = (event) => {
        props.onCambio(event.target.checked);
    };

    return (
        <div>
            <input type="checkbox" id={props.id} className='offScreen' checked={props.valor} onChange={handleChange}/>
            <label for={props.id} className="div-switch"></label>
        </div>
    );
}