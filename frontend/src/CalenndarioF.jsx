import React from 'react'
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarioF.css'
import CitasList from './components/CitasList';
import MeetMenu from './components/MeetMenu'

export default function CalendarioF(props) {

    const citas = [
        { id: 1, nombre: "Teisel", img: "/src/images/testimg.png", horaI: 9, horaF: 10.2, año: "2026", mes: "0", dia: "20" },
        { id: 2, nombre: "Wiwiw", img: "/src/images/testimg.png", horaI: 9, horaF: 10.2, año: "2026", mes: "0", dia: "24" },
        { id: 1, nombre: "Teisel", img: "/src/images/testimg.png", horaI: 11, horaF: 13, año: "2026", mes: "0", dia: "20" },
    ];

    const [addMenu, openAddMenu] = useState(false);
    const handleAdd = useCallback(() => {
                openAddMenu(!addMenu)
            }, [addMenu])

    const [editMenu, openEditMenu] = useState(false);
    const handleEdit = useCallback(() => {
                openEditMenu(!editMenu)
            }, [editMenu])

    function listaHoras() {
        const elementos = [];
        for (let i = 1; i <= 23; i++) {
            elementos.push(
                <div>
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
                    <div className='citaF' onClick={handleEdit} style={{
                        top: `${cita.horaI * 4.166667}%`,
                        height: `${(cita.horaF - cita.horaI) * 4.166667}%`
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
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

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

    return (
        <div className="calendarioF">
            <div className='fecha'>
                Hoy
            </div>
            <div className='contentCalendario'>
                <CitasList citas={citas} current={currentDate} handleAdd={handleAdd} handleEdit={handleEdit}/>
                <div className='calendarioWrapper'>
                    <div className='calendario'>
                        <div className='dias'>
                            {week.map((dia) => (
                                <div className='dia' key={dia}>
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
                  <MeetMenu handleAdd={handleAdd} tipo={true} handleEdit={handleEdit}/>          
            </div>
        </div>
    );
}