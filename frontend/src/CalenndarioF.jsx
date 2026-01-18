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
        date.setDate(currentDate.getDate() -jsDay + i);
        return {
            day,
            date: date.getDate()
        };
    });

    console.log(week.at(0));

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
                                    <div className='numero'>
                                        {dia.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='horas'>
                            {listaHoras()}
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