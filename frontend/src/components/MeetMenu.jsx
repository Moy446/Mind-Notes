import React from 'react'
import { useState } from "react";
import './MeetMenu.css'

const patients = [
  { id: 1, name: "Eric", img: "/src/images/pimg3.png" },
  { id: 2, name: "Mariana", img: "/src/images/pimg2.png" },
  { id: 3, name: "Moy", img: "/src/images/pimg4.png" }
];

export default function MeetMenu(){

    const [selected, setSelected] = useState(patients[0]);
    const [open, setOpen] = useState(false);

    return (
        <div className='meetMenu'>
            <div className="custom-selectM">
                <button
                    className="select-triggerM titleAudio"
                    onClick={() => setOpen(!open)}
                >
                    <img src={selected.img} className="avatar" />
                    {selected.name}
                </button>

                {open && (
                    <ul className="select-optionsM titleAudio">
                        {patients.map(p => (
                        <li
                            key={p.id}
                            onClick={() => {
                                setSelected(p);
                                setOpen(false);
                        }}
                        >
                        <img src={p.img} className="avatarM" />
                        {p.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='divTime marginDivTime'>
                <input type='date' className='dateIn'/>
                <div className='divTime'>
                    <input type='time' className='dateIn'/>
                    <hr className='line'/>
                    <input type='time' className='dateIn'/>
                </div>
            </div>
            <div className='meetbtns'>
                <button className='btnMeet cancelBtnM'>Cancelar</button>
                <button className='btnMeet acceptBtnM'>Aceptar</button>
            </div>
        </div>
    );
}