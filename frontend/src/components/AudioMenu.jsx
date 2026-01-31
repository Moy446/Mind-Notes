import React from 'react'
import { useState } from "react";
import './AudioMenu.css'
import { useEffect } from 'react';
import clienteAxios from '../services/axios';
import Select from 'react-select';

export default function AudioMenu(props){

    const [patients, setPatients] = useState([]);
    const [patientData, setPatientData] = useState({
        idPaciente: '',
        nombrePaciente: '',
        resume: true,
        grabacion: false
    });

    const cargarPacientes = async () => {
        try {
            const res = await clienteAxios.get('/psicologo/grabacion')
            if(res.data.success){
                
                const patientsList = res.data.nombresPacientes
                setPatients(patientsList.map(p => ({
                    idPaciente: p.idPaciente,
                    nombrePaciente: p.nombrePaciente,
                    fotoPerfil: p.fotoPerfilPaciente
                })));
                
            }else{
                console.log('Error al cargar la lista de pacientes');
            }
        } catch (error) {
            console.log(error);
        }    
    }

    useEffect(() =>{
        cargarPacientes();
    },[])

    const actualizarDatosPaciente = (e) => {
        setPatientData({
            ...patientData,
            "idPaciente": e.idPaciente,
            "nombrePaciente": e.nombrePaciente
        });
    }

    const actualizarServices =(e)=>{
        setPatientData({
            ...patientData,
            [e.target.name]: e.target.checked
        })
    }


    return (
        <div className='AudioMenu'>
            <a className='titleAudio'>Paciente:</a>
            <div className="custom-select">
                {/* <button
                    className="select-trigger titleAudio"
                    onClick={() => setOpen(!open)}
                >
                    <img src={selected.fotoPerfil} className="avatar" />
                    {selected.nombrePaciente}
                </button> */}
                <Select name="listaPacientes"
                id="listaPacientes"
                unstyled
                classNamePrefix="selectM"
                options = {patients} 
                maxMenuHeight={200}
                isSearchable={true}
                getOptionLabel = {(p) => p.nombrePaciente} 
                getOptionValue = {(p) => p.idPaciente }
                components={{ IndicatorSeparator: () => null }}
                onChange={actualizarDatosPaciente}
                formatOptionLabel={(p)=>(
                    <div className='optionContentM' key={p.idPaciente}>
                        <img src={p.fotoPerfil} className="avatarM"/>
                        <span>{p.nombrePaciente}</span>
                    </div>
                )}/>
            </div>
            <div className='radioBtns'>
                <div className='radioBtn'>
                    <input type='checkbox' name='resume' id='resume' className='offScreen' onChange={actualizarServices} checked={patientData.resume}/>
                    <label htmlFor="resume" className="radioA"></label>
                    <a className='titleAudio'>Resumen</a>
                </div>
                <div className='radioBtn'>
                    <input type='checkbox' name='grabacion' id='grabacion' className='offScreen' onChange={actualizarServices} checked={patientData.grabacion}/>
                    <label htmlFor="grabacion" className="radioA"></label>
                    <a className='titleAudio'>Guardar grabacion</a>
                </div> 
            </div>
            <button className='accept-button' disabled={!patientData.idPaciente} onClick={() => props.handleClick(patientData)}>Aceptar</button>
        </div>
    );
}