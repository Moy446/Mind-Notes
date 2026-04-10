import React from 'react'
import { useState } from 'react';
import './ChatBox.css'

export default function ChatBox(props){

    const getNameFontSize = (name) => {
        if (name.length > 20) return '20px';
        if (name.length > 15) return '22px';
        return '25px';
    }
    const getMessagePreview = (message = '') => {
        if (typeof message !== 'string') return '';{
            const firstLine = message.split('\n')[0];
            return firstLine.length > 30 ? firstLine.slice(0, 30) + '...' : firstLine;
        }
    }

    return (
        <div className={props.isSelected ? "chatbox" : "chatbox-activo"} onClick={props.onSelect}>
            <img src={props.img} alt="Descripción de la imagen" className='img-chatbox'/>
            <div className='div-textchatbox'>
                <span className='text-chatbox-name' style={{ fontSize: getNameFontSize(props.name) }}>
                    {props.name}
                </span>
                <span className='text-chatbox-message'>{getMessagePreview(props.message)}</span>
            </div>
        </div>
    );
}