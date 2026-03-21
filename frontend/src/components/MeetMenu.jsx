import React from 'react'
import { useState, useEffect } from "react";
import './MeetMenu.css'
import Select from 'react-select';
import clienteAxios from '../services/axios';
import Swal from 'sweetalert2';


export default function MeetMenu(props) {


    //datos user = state setUsers = funcion para actualizar el state
    const [users, setUsers] = useState([]);
    const role = props.role;

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    //carga todos los pacientes o psicologos registrados 
    const cargarLista = async () => {
        try {
            const res = await clienteAxios.get('/psicologo/calendario/pacientes/lista')
            if (res.data.success) {
                const usersList = res.data.nombresUsuarios
                setUsers(usersList.map(p => ({
                    idUsuario: role == 'psicologo' ? p.idPaciente : p.idPsicologo,
                    nombre: role == 'psicologo' ? p.nombrePaciente : p.nombrePsicologo,
                    fotoPerfil: role == 'psicologo' ? p.fotoPerfilPaciente : p.fotoPerfilPsicologo
                })));
            } else {
                console.log('Error al cargar la lista de usuarios vinculados');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        cargarLista();
    }, []);

    //datos cita = state guardarDatosCita = funcion para actualizar el state
    const [datosCita, guardarDatosCita] = useState({
        idUsuario: '',
        nombre: '',
        fechaCita: '',
        horaInicio: '',
        horaFin: ''
    });

    const actualizarDatos = e => {
        guardarDatosCita({
            ...datosCita,
            [e.target.name]: e.target.value
        })
    }
    const actualizarDatosPaciente = e => {
        guardarDatosCita({
            ...datosCita,
            ["idUsuario"]: e.idUsuario,
            ["nombre"]: e.nombre
        });
    }

    const validarCita = () => {
        const { idUsuario, nombre, fechaCita, horaInicio, horaFin } = datosCita;
        if (!idUsuario || !nombre || !fechaCita || !horaInicio || !horaFin || horaInicio >= horaFin) {
            return true;
        }
        // falta validaciones de hora
        return false;
    }

    const agendarCita = e => {
        e.preventDefault()
        //enviar peticion a axios
        clienteAxios.post('/psicologo/calendario', datosCita)
            .then(async res => {
                if (res.data.success) {
                    await Swal.fire({
                        title: "Se agendó la cita correctamente",
                        text: `Se agendó cita a ${datosCita.nombre}`,
                        icon: "success"
                    });
                    props.handleAdd(true);
                    limpiarDatos();
                } else {
                    Swal.fire({
                        title: `Error al agendar la cita a ${datosCita.nombre}`,
                        text: err.response?.data?.message || "Error desconocido",
                        icon: "error"
                    });
                }
            }).catch(err => {
                Swal.fire({
                    title: `Error al agendar la cita a ${datosCita.nombre}`,
                    text: err.response?.data?.message || "Error desconocido",
                    icon: "error"
                });
            })
    }

    const editarCita = e => {
        e.preventDefault()
        //enviar peticion a axios
        clienteAxios.put(`/psicologo/calendario/${props.citaId}`, datosCita)
            .then(async res => {
                if (res.data.success) {
                    await Swal.fire({
                        title: "Se modificó la cita correctamente",
                        text: `Se modificó la cita a ${datosCita.nombre}`,
                        icon: "success"
                    });
                    props.handleEdit("", true);
                    limpiarDatos();
                } else {
                    Swal.fire({
                        title: `Error al modificar la cita a ${datosCita.nombre}`,
                        text: err.response?.data?.message || "Error desconocido",
                        icon: "error"
                    });
                }
            }).catch(err => {
                Swal.fire({
                    title: `Error al modificar la cita a ${datosCita.nombre}`,
                    text: err.response?.data?.message || "Error desconocido",
                    icon: "error"
                });
            })
    }

    const limpiarDatos = () => {
        guardarDatosCita({
            idUsuario: '',
            nombre: '',
            fechaCita: '',
            horaInicio: '',
            horaFin: ''
        })
    }

    const cerrarVentana = () => {
        limpiarDatos();
        props.tipo ? props.handleEdit() : props.handleAdd();
    }

    const [position, setPosition] = useState(null);

    //carga la informacion de la cita del paciente seleccionado
    const cargarDatosPaciente = async (idCita) => {
        if (!idCita) return;
        try {
            const res = await clienteAxios.get(`/psicologo/calendario/${idCita}`)
            if (res.data.success) {
                guardarDatosCita({
                    ...datosCita,
                    ["idUsuario"]: res.data.cita.idUsuario,
                    ["nombre"]: res.data.cita.nombre,
                    ["fechaCita"]: res.data.cita.fechaCita,
                    ["horaInicio"]: res.data.cita.horaInicio,
                    ["horaFin"]: res.data.cita.horaFin,
                    ["fotoPerfil"]: res.data.cita.fotoPerfil
                })
            }
            for (let user of users) {
                let cont = 0
                if (user.idUsuario == res.data.cita.idUsuario) {
                    setPosition(cont);
                    break;
                }
                cont++;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        cargarDatosPaciente(props.citaId)
    }, [props.citaId != null])

    return (
        <div className='meetMenu'>
            {
                <div className="custom-selectM">
                    <Select name="listaPacientes"
                        id="listaPacientes"
                        unstyled
                        classNamePrefix="selectM"
                        options={users}
                        maxMenuHeight={200}
                        isSearchable={true}
                        getOptionLabel={(u) => u.nombre}
                        getOptionValue={(u) => u.idUsuario}
                        components={{ IndicatorSeparator: () => null }}
                        onChange={actualizarDatosPaciente}
                        value={users[position]}
                        formatOptionLabel={(u) => (
                            <div className='optionContentM' key={u.idUsuario}>
                                <img src={u.fotoPerfil} className="avatarM" />
                                <span>{u.nombre}</span>
                            </div>
                        )} />
                </div>
            }

            <div className='divTime marginDivTime'>
                <input type='date' className='dateIn' min={manana.toLocaleDateString('sv')} name='fechaCita' onChange={actualizarDatos} value={datosCita.fechaCita || ''} />
                <div className='divTime'>
                    <input type='time' className='dateIn' name='horaInicio' onChange={actualizarDatos} value={datosCita.horaInicio || ''} />
                    <hr className='line' />
                    <input type='time' className='dateIn' disabled={!datosCita.horaInicio} name='horaFin' onChange={actualizarDatos} value={datosCita.horaFin || ''} />{/*la falta del parentesis en la funcion quiere ddecir que se actualiza cuando sucede un evento*/}
                </div>

            </div>
            <div className='meetbtns'>
                <button className='btnMeet cancelBtnM' onClick={cerrarVentana}>Cancelar</button>
                {
                    props.tipo ?
                        <button type="submit" className='btnMeet acceptBtnM' disabled={validarCita()} onClick={editarCita}>Editar</button>
                        :
                        <button type="submit" className='btnMeet acceptBtnM' disabled={validarCita()} onClick={agendarCita}>Crear</button>
                }
            </div>
        </div>
    );
}