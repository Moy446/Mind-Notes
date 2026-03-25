import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Spinner from './components/spinner';
import clienteAxios from './services/axios';
import MeetMenu from './components/MeetMenu';
import CitasList from './components/CitasList';
import AddBtn from './components/AddBtn';
import { authService } from './services/authService';
import Select from 'react-select'
import './Calendario.css'



export default function Calendario() {

    const [citas, setCitas] = useState([]);
    const [psicologos, setPsicologos] = useState([])
    const [role, setRole] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [cont, setCont] = useState(null)
    const currentDate = new Date()

    const formatDate = (fecha) => {
        const [y, m, d] = fecha.split('-');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    };

    const cargarCitas = async () => {
        try {
            let res = {}
            const data = await authService.getSession();
            setRole(data.user.role)
            if (data.user.role === 'psicologo') {
                res = await clienteAxios.get('/psicologo/calendario/')
            } else {
                const listaPsicolgos = await clienteAxios.get('/paciente/getPsicologist/')
                if (!listaPsicolgos) {
                    throw new Error('Error al obtener los psicologos')
                }
                const lista = listaPsicolgos.data.data
                setCont(lista.length)
                setPsicologos(lista.map(psicologo => ({
                    id: psicologo.idPsicologo,
                    nombre: psicologo.nombrePsicologo,
                    fotoPerfil: psicologo.fotoPerfilPsicologo
                })))
                setIsLoading(false)
                return
            }

            if (res.data.success) {
                const citasList = res.data.formattedAgenda

                setCitas(citasList.map(cita => ({
                    id: cita.id,
                    title: cita.nombre,
                    start: new Date(`${formatDate(cita.fecha)}T${cita.horaI}:00`),
                    end: new Date(`${formatDate(cita.fecha)}T${cita.horaF}:00`),
                    extendedProps: {
                        estado: cita.estado,
                        img: cita.img || './images/userDefault.png'
                    }
                })));
                setIsLoading(false);
            } else {
                console.log('Error al cargar las citas' + res.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        cargarCitas()
    }, [])

    const [addMenu, openAddMenu] = useState(false);
    const handleAdd = useCallback((e) => {
        openAddMenu(!addMenu)
        if (e) {
            cargarCitas();
        }
    }, [addMenu])

    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [editMenu, openEditMenu] = useState(false);
    const handleEdit = useCallback((id, e) => {
        setSelectedCitaId(id);
        openEditMenu(!editMenu)
        if (e) {
            cargarCitas();
        }
    }, [editMenu])

    const getHorarioPsicologo = async (e) => {
        try {
            const res = await clienteAxios.get(`/paciente/calendario/${e.id}`);
            const citasList = res.data.formattedAgenda;
            setCitas(citasList.map(cita =>({
                id: cita.id,
                title: cita.nombre,
                start: new Date(`${formatDate(cita.fecha)}T${cita.horaI}:00`),
                end: new Date(`${formatDate(cita.fecha)}T${cita.horaF}:00`),
                extendedProps: {
                    estado: cita.estado,
                    img: cita.img || '/src/images/userDefault.png'
                }
            })));

        } catch (error) {
            console.log('Error al cargar las citas paciente' + res.data.message);
        }
    }

    //cargar spinner
    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="calendario">
            <Select name="listaPsicologo" className={`${role != 'paciente' ? 'hideAddMenu' : ''}`}
                id="listaPacientes"
                unstyled
                classNamePrefix="selectP"
                options={psicologos}
                isSearchable={true}
                getOptionLabel={(p) => p.nombre}
                getOptionValue={(p) => p.id}
                components={{ IndicatorSeparator: () => null }}
                onChange={(e) =>getHorarioPsicologo(e)}
                value={psicologos[cont]}
                formatOptionLabel={(p) => (
                    <div className='optionContentP' key={p.id}>
                        <img src={p.fotoPerfil} className="avatarP" />
                        <span>{p.nombre}</span>
                    </div>
                )}
            />
            <div className='row'>
                <div className='rbnShowAddMenu'>
                    <AddBtn num={'1'} handleOpen={handleAdd} />
                </div>
                <CitasList citas={citas} current={currentDate} handleAdd={handleAdd} handleEdit={handleEdit} />
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    allDaySlot={false}
                    headerToolbar={{
                        start: 'dayGridMonth,timeGridWeek,timeGridDay',
                        center: 'title',
                        end: 'today,prev,next'
                    }}
                    timeZone="local"
                    events={citas}
                    height="100%"
                    slotMinTime="07:00:00"
                    slotMaxTime="21:30:00"
                    eventClick={(info) => {
                        if (info.event.id === null) return;
                        handleEdit(info.event.id);
                    }}
                    eventContent={(eventInfo) => {
                        const estado = eventInfo.event.extendedProps.estado;
                        const img = eventInfo.event.extendedProps.img;

                        let color = "#A3D8F4";

                        if (estado === "confirmada") color = "#A3F4B5";
                        else if (estado === "reagendada") color = "#e8f4a3";
                        else if (estado === "cancelada") color = "#f4a3a3";

                        return (
                            <div className='infoCita' style={{ backgroundColor: color }}>
                                <img
                                    src={img}
                                    alt="perfil"
                                />
                                <div className='infoCita-text'>
                                    {eventInfo.event.title}
                                </div>
                            </div>
                        );
                    }}
                />
                <div className={addMenu ? "showAddMenu" : "hideAddMenu"}>
                    <MeetMenu handleAdd={handleAdd} role={role} />
                </div>
                <div className={editMenu ? "showAddMenu" : "hideAddMenu"}>
                    <MeetMenu handleAdd={handleAdd}  role={role} tipo={true} handleEdit={handleEdit} citaId={selectedCitaId} />
                </div>
            </div>
        </div>
    )

}
