import React from 'react'
import { useState } from "react";
import './AudioMenu.css'

const patients = [
  { id: 1, name: "Eric", img: "/src/images/pimg3.png" },
  { id: 2, name: "Mariana", img: "/src/images/pimg2.png" },
  { id: 3, name: "Moy", img: "/src/images/pimg4.png" }
];

export default function AudioMenu(props){

    const [selected, setSelected] = useState(patients[0]);
    const [open, setOpen] = useState(false);
    
    const onClickAceptar = () =>
    {
        
    }

    return (
        <div className='AudioMenu'>
            <a className='titleAudio'>Paciente:</a>
            <div className="custom-select">
                <button
                    className="select-trigger titleAudio"
                    onClick={() => setOpen(!open)}
                >
                    <img src={selected.img} className="avatar" />
                    {selected.name}
                </button>

                {open && (
                    <ul className="select-options titleAudio">
                        {patients.map(p => (
                        <li
                            key={p.id}
                            onClick={() => {
                                setSelected(p);
                                setOpen(false);
                        }}
                        >
                        <img src={p.img} className="avatar" />
                        {p.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='radioBtns'>
                <div className='radioBtn'>
                    <input type='checkbox' name='r' id='r' className='offScreen'/>
                    <label for="r" className="radioA"></label>
                    <a className='titleAudio'>Resumen</a>
                </div>
                <div className='radioBtn'>
                    <input type='checkbox' name='t' id='t' className='offScreen'/>
                    <label for="t" className="radioA"></label>
                    <a className='titleAudio'>Transcripción</a>
                </div> 
            </div>
            <button className='accept-button' onClick={props.handleClick}>Aceptar</button>
        </div>
    );
}