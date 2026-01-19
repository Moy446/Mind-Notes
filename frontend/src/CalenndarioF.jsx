import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarioF.css'
import CitasList from './components/CitasList';

export default function CalendarioF(props) {

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

    function listaLineas() {
        const elementos = [];
        for (let i = 1; i <= 23; i++) {
            elementos.push(
                <hr className='lineHour' />
            );
        }
        return (
            <div className='showCitas'>
                {elementos}
                <div className='citaF' style={{
                    top: `${18.75}%`,
                    height: `${1 * 4.166667}%`
                }}>
                    <img src='/src/images/testimg.png' className='imgCitaF'/>
                    Teisel
                </div>
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

    console.log(week)
    console.log(currentDate)

    const citas = [
        { id: 1, nombre: "Teisel", img: "/src/images/testimg.png", horaI: 9, horaF: 10.2 },
    ];

    return (
        <div className="calendarioF">
            <div className='fecha'>
                Hoy
            </div>
            <div className='contentCalendario'>
                <CitasList />
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
                            {listaLineas()}
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                            <div className='showCitas'>
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                                <hr className='lineHour' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}