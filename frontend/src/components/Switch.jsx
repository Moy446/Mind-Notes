import React from 'react'
import './Switch.css'

export default function Switch(){

    return (
        <div>
            <input type="checkbox" id = "toggle" className='offScreen'/>
            <label for="toggle" className="div-switch"></label>
        </div>
    );
}