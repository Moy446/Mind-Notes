import React from 'react'
import { useState } from "react";
import './MeetMenu.css'

const patients = [
    { id: 1, name: "Eric", img: "/src/images/pimg3.png" },
    { id: 2, name: "Mariana", img: "/src/images/pimg2.png" },
    { id: 3, name: "Moy", img: "/src/images/pimg4.png" }
];

export default function MeetMenu(props) {

    const [selected, setSelected] = useState(patients[0]);
    const [open, setOpen] = useState(false);
    const [fecha] = useState(new Date());

    return (
        <div className='meetMenu'>
            {
                props.tipo
                    ?
                    <div className="custom-selectM titleAudio">
                        <img src={patients.at(0).img} className="avatar" />
                        {patients.at(0).name}
                    </div>
                    :
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

            }

            <div className='divTime marginDivTime'>
                <input type='date' className='dateIn' min={fecha.toLocaleDateString('sv')} />
                <div className='divTime'>
                    <input type='time' className='dateIn' />
                    <hr className='line' />
                    <input type='time' className='dateIn' />
                </div>
            </div>
            <div className='meetbtns'>
                <button className='btnMeet cancelBtnM' onClick={props.tipo ? props.handleEdit : props.handleAdd}>Cancelar</button>
                <button className='btnMeet acceptBtnM' onClick={props.tipo ? props.handleEdit : props.handleAdd}>Aceptar</button>
            </div>
        </div>
    );
}