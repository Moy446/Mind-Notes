import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Doc.css'
import Tiptap from './components/TipTap';

export default function Doc(props) {

    const navigate = useNavigate();

    const [pencil, setPencil] = useState(true);
    const [brush, setBrush] = useState(false);

    const handleClick = () => {
        setPencil(!pencil);
        setBrush(!brush);
    };

    const saveDoc = () => {
        navigate('/psicologo/perfil:id');
    }

    return (
        <div className={`doc ${brush ? "cursorbrush" : ""}`}>
            <Tiptap />
            <div className='btnsDoc'>
                <button className="docBtn efectBtn" onClick={saveDoc}>Guardar</button>
                <button className="docBtn efectBtn" onClick={saveDoc}>Cerrar</button>
            </div>
            <div className='switchDoc'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6" className='svgDoc1 efectBtn' onClick={handleClick}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6" className='svgDoc1 efectBtn' onClick={handleClick}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
                <div className={`selectedTool ${brush ? "movemove" : ""}`}>

                </div>
            </div>
        </div>
    );
}