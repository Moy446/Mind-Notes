import React from 'react'
import { useState } from 'react';
import './NameBar.css'

export default function NameBar(props){

    return (
            <div className='div-contenedor'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className='size-6 svg-namebar  show-mobile' onClick={props.openChat}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div className='div-namebar'>
                    <img src={props.img} alt="Descripción de la imagen" className='img-namebar'/>
                    {props.name}
                </div>  
                <svg xmlns="http://www.w3.org/2000/svg" fill={props.open ? '#9ACBD0' : 'none'} viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className='size-6 svg-namebar svg-namebar' onClick={props.handleOpen}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
    );
}