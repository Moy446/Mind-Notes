import React from 'react'
import { useState } from 'react';
import './ChatBox.css'

export default function ChatBox(props){

    const [activo, setActivo] = useState(false);

    const handleClick = () => {
        setActivo(!activo);
    };

    return (
        <div className={activo ? 'chatbox' : 'chatbox-activo'} onClick={handleClick}>
            <img src={props.img} alt="Descripción de la imagen" className='img-chatbox'/>
            <div className='div-textchatbox'>
                <span className='text-chatbox-name'>{props.name}</span>
                <span className='text-chatbox-message'>{props.message}</span>
            </div>
        </div>
    );
}