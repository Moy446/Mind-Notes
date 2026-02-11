import React, { use } from 'react'
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarioF.css'
import CitasList from './components/CitasList';
import MeetMenu from './components/MeetMenu'
import clienteAxios from './services/axios';
import Spinner from './components/spinner';

export default function CalendarioF(props) {

    const [citas, setCitas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    

    const cargarCitas = async () => {
        try {
            const res = await clienteAxios.get('/psicologo/calendario/')
            if(res.data.success){
                const citasList = res.data.formattedAgenda
                setCitas(citasList.map(cita =>({
                    id: cita.id,
                    nombre: cita.nombre,
                    img: cita.img,
                    horaI: cita.horaI,
                    horaF: cita.horaF,
                    año: cita.año,
                    mes: cita.mes,
                    dia: cita.dia,
                    estado: cita.estado
                })));
                setIsLoading(false);
            }else{
                console.log('Error al cargar las citas'+ res.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        cargarCitas();
    },[])

    const [addMenu, openAddMenu] = useState(false);
    const handleAdd = useCallback((e) => {
                openAddMenu(!addMenu)
                if (e){
                    cargarCitas();
                }
            }, [addMenu])

    const [selectedCitaId, setSelectedCitaId] = useState(null);
    const [editMenu, openEditMenu] = useState(false);
    const handleEdit = useCallback((id,e) => {
                setSelectedCitaId(id);
                openEditMenu(!editMenu)
                if (e){
                    cargarCitas();
                }
            }, [editMenu])

    function listaHoras() {
        const elementos = [];
        for (let i = 1; i <= 23; i++) {
            elementos.push(
                <div key={i}>
                    {i}
                </div>
            );
        }
        return (
            <div className='numHoras'>
                {elementos}
            </div>
        );
    }

    function listaLineas(dia) {
        const elementos = [];
        const citasMostradas = [];


        for (let i = 1; i <= 23; i++) {
            elementos.push(
                <hr className='lineHour' />
            );
        }
        for (const cita of citas) {   
            const day = new Date(cita.año, cita.mes, cita.dia);
            dia.fullDate.setHours(0, 0, 0, 0);
            day.setHours(0, 0, 0, 0);
            if (day.getTime() === dia.fullDate.getTime()) {
                citasMostradas.push(
                    <div className='citaF' onClick={() => handleEdit(cita.id)} style={{
                        top: `${cita.horaI * 4.166667}%`,
                        height: `${(cita.horaF - cita.horaI) * 4.166667}%`,
                        backgroundColor: cita.estado === 'confirmada' ? '#A3F4B5' : cita.estado === 'programada' ? '#A3D8F4' : cita.estado === 'reagendada' ? '#e8f4a3' : '#f4a3a3'
                    }}>
                        <img src={cita.img} className='imgCitaF' />
                        {cita.nombre}
                    </div>
                );
            }
        }

        return (
            <div className='showCitas'>
                {elementos}
                {citasMostradas}
            </div>
        );
    }

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    const mesesAño = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ]

    const currentDate = new Date()
    // const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    // const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

    const jsDay = currentDate.getDay();

    const week = diasSemana.map((day, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - jsDay + i);
        return {
            day,
            date: date.getDate(),
            fullDate: date
        };
    });

    //cargar spinner
    if (isLoading){
        return <Spinner/>
    }

    return (
        <div className="calendarioF">
            <div className='fecha'>
                Hoy
            </div>
            <div className='contentCalendario'>
                <CitasList citas={citas} current={currentDate} handleAdd={handleAdd} handleEdit={handleEdit} />
                <div className='calendarioWrapper'>
                    <div className='calendario'>
                        <div className='dias'>
                            {week.map((dia) => (
                                <div className='dia' key={dia.day}>
                                    {dia.day}
                                    <div className={dia.fullDate.getTime() === currentDate.getTime() ? "numero diaActual" : "numero"}>
                                        {dia.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='horas'>
                            {listaHoras()}
                            {week.map((dia) => (
                                listaLineas(dia)
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={addMenu ? "showAddMenu" : "hideAddMenu"}>
                  <MeetMenu handleAdd={handleAdd}/>          
            </div>
            <div className={editMenu ? "showAddMenu" : "hideAddMenu"}>
                  <MeetMenu handleAdd={handleAdd} tipo={true} handleEdit={handleEdit} citaId= {selectedCitaId}/>          
            </div>
        </div>
    );
}