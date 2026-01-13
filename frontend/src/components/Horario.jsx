import React, { useState } from 'react'
import './Horario.css'
import HorarioItem from './HorarioItem';

export default function Horario(props) {

    const [dom, setDom] = useState(false);
    const [lun, setLun] = useState(false);
    const [mar, setMar] = useState(false);
    const [mie, setMie] = useState(false);
    const [jue, setJue] = useState(false);
    const [vie, setVie] = useState(false);
    const [sab, setSab] = useState(false);


    const handleDom = (value) => {
        setDom(value);
    };

    const handleLun = (value) => {
        setLun(value);
    };

    const handleMar = (value) => {
        setMar(value);
    };

    const handleMie = (value) => {
        setMie(value);
    };

    const handleJue = (value) => {
        setJue(value);
    };

    const handleVie = (value) => {
        setVie(value);
    };

    const handleSab = (value) => {
        setSab(value);
    };

    return (
        <div className="horario">
            <div className='titleHorario'>
                Horario
            </div>
            <HorarioItem day="Dom" valor={dom} onCambio={handleDom}/>
            <HorarioItem day="Lun" valor={lun} onCambio={handleLun}/>
            <HorarioItem day="Mar" valor={mar} onCambio={handleMar}/>
            <HorarioItem day="Mie" valor={mie} onCambio={handleMie}/>
            <HorarioItem day="Jue" valor={jue} onCambio={handleJue}/>
            <HorarioItem day="Vie" valor={vie} onCambio={handleVie}/>
            <HorarioItem day="Sab" valor={sab} onCambio={handleSab}/>
        </div>
    );
}