import React, { use } from 'react'
import { useState, useEffect } from "react";
import './MeetMenu.css'
import Select from 'react-select';
import clienteAxios from '../services/axios';
import Swal from 'sweetalert2';


export default function MeetMenu(props) {
    

    //datos patients = state setPatients = funcion para actualizar el state
    const [patients, setPatients] = useState([]);
    //carga todos los pacientes registrados
    const cargarPacientes = async () => {
        try {
            const res = await clienteAxios.get('/psicologo/calendario/pacientes/lista')
            if(res.data.success){
                
                const patientsList = res.data.nombresPacientes
                setPatients(patientsList.map(p => ({
                    idPaciente: p.idPaciente,
                    nombrePaciente: p.nombrePaciente,
                    fotoPerfil: p.fotoPerfil
                })));
                
            }else{
                console.log('Error al cargar la lista de pacientes');
            }
        } catch (error) {
            console.log(error);
        }    
    }

    useEffect(() => {
        cargarPacientes();
    }, []);

    const [fecha] = useState(new Date());
    const [hora] = useState(fecha.getHours()+":"+fecha.getMinutes());
    //datos cita = state guardarDatosCita = funcion para actualizar el state
    const [datosCita, guardarDatosCita] = useState({
        idPaciente: '',
        nombrePaciente: '',
        fechaCita: '',
        horaInicio: '',
        horaFin: ''
    });

    const actualizarDatos = e =>{
        guardarDatosCita({
            ...datosCita,
            [e.target.name] : e.target.value
        });
    }
    const actualizarDatosPaciente = e =>{
        guardarDatosCita({
            ...datosCita,
            ["idPaciente"]: e.idPaciente,
            ["nombrePaciente"]: e.nombrePaciente
        });
    }


    const validarCita = () => {
        const {idPaciente,nombrePaciente, fechaCita, horaInicio, horaFin} = datosCita;
        if (!idPaciente || !nombrePaciente || !fechaCita || !horaInicio || !horaFin  || horaInicio >= horaFin) {
            return true;
        }
        // falta validaciones de hora
        return false;
    }

    const agendarCita = e =>{
        e.preventDefault()
        //enviar peticion a axios
        clienteAxios.post('/psicologo/calendario', datosCita)
        .then(async res =>{
            if(res.data.success){
                await Swal.fire({
                    title: "Se agendo la cita correctamente",
                    text: `Se agendo cita a ${datosCita.nombrePaciente}`,
                    icon: "success"
                });
                props.handleAdd();
                limpiezarDatos();
                window.location.reload();
            }else{
                Swal.fire({
                    title: "Error al agendar la cita",
                    text: `No se pudo agendar cita a ${datosCita.nombrePaciente}`,
                    icon: "error"
                });
            }
        })
    }

    const editarCita = e =>{
        e.preventDefault()
        //enviar peticion a axios
        clienteAxios.put(`/psicologo/calendario/${props.citaId}`, datosCita)
        .then(async res =>{
            if(res.data.success){
                await Swal.fire({
                    title: "Se modifico la cita correctamente",
                    text: `Se modifico la cita a ${datosCita.nombrePaciente}`,
                    icon: "success"
                });
                props.handleEdit();
                limpiezarDatos();
                window.location.reload();
            }else{
                Swal.fire({
                    title: "Error al modificar la cita",
                    text: `No se pudo modificar la cita a ${datosCita.nombrePaciente}`,
                    icon: "error"
                });
            }
        }).catch(err => {
            Swal.fire({
                title: "Error al modificar la cita",
                text: `No se pudo modificar la cita a ${datosCita.nombrePaciente}`,
                icon: "error"
            });
        })
    }

    const limpiezarDatos = () => {
        guardarDatosCita({
                    idPaciente: '',
                    nombrePaciente: '',
                    fechaCita: '',
                    horaInicio: '',
                    horaFin: ''
                })
    }

    const cerrarVentana = () => {
        limpiezarDatos();
        props.tipo ? props.handleEdit() : props.handleAdd();
    }

    const [position, setPosition] = useState(null);
    //carga la informacion de la cita del paciente seleccionado
    const cargarDatosPaciente = async (idCita) => {
        if(!idCita) return;
        try {
            const res = await clienteAxios.get(`/psicologo/calendario/${idCita}`)
            if(res.data.success){
                guardarDatosCita({
                    ...datosCita,
                    ["idPaciente"]: res.data.cita.idPaciente,
                    ["nombrePaciente"]: res.data.cita.nombrePaciente,
                    ["fechaCita"]: res.data.cita.fechaCita,
                    ["horaInicio"]: res.data.cita.horaInicio,
                    ["horaFin"]: res.data.cita.horaFin,
                    ["fotoPerfil"]: res.data.cita.fotoPerfil
                })
            }
            for (let patient of patients){
                let cont = 0
                if(patient.idPaciente == res.data.cita.idPaciente){
                    setPosition(cont);
                    break;
                }
                cont ++;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        cargarDatosPaciente(props.citaId)
    },[props.citaId != null])

    return (
        <div className='meetMenu'>
            {
                <div className="custom-selectM">
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
                    value={patients[position]}
                    formatOptionLabel={(p)=>(
                        <div className='optionContentM' key={p.idPaciente}>
                            <img src={p.fotoPerfil} className="avatarM"/>
                            <span>{p.nombrePaciente}</span>
                        </div>
                        )}/>
                </div>
            }

            <div className='divTime marginDivTime'>
                <input type='date' className='dateIn' min={fecha.toLocaleDateString('sv')} name='fechaCita' onChange={actualizarDatos} value={datosCita.fechaCita || ''}/>
                <div className='divTime'>
                    <input type='time' className='dateIn' name='horaInicio' onChange={actualizarDatos} value={datosCita.horaInicio || ''}/>
                    <hr className='line' />
                    <input type='time' className='dateIn' disabled={!datosCita.horaInicio} name='horaFin' onChange={actualizarDatos} value={datosCita.horaFin || ''}/>{/*la falta del parentesis en la funcion quiere ddecir que se actualiza cuando sucede un evento*/}
                </div>
                
            </div>
            <div className='meetbtns'>
                <button className='btnMeet cancelBtnM' onClick={cerrarVentana}>Cancelar</button>
                {
                    props.tipo ?
                        <button type= "submit" className='btnMeet acceptBtnM' disabled= {validarCita()} onClick={editarCita}>Editar</button>
                    :   
                        <button type= "submit" className='btnMeet acceptBtnM' disabled= {validarCita()} onClick={agendarCita}>Crear</button> 
                }
            </div>
        </div>
    );
}