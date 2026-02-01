import React from 'react'
import './CitasList.css'
import Cita from './Cita';

export default function CitasList(props) {

    function citasDia()
    {
        const citasMostradas = [];

        for (const cita of props.citas)
        {
            const day = new Date(cita.año, cita.mes, cita.dia);
            props.current.setHours(0, 0, 0, 0);
            day.setHours(0, 0, 0, 0);

            if (day.getTime() === props.current.getTime()) {
                citasMostradas.push(
                    <Cita name={cita.nombre} hora={cita.horaI} img={cita.img} handleEdit={props.handleEdit}/>
                );
            }
        }

        return citasMostradas;
    }

    return (
        <div className="citas">
            {
                citasDia()
            }
            <div className='newCita' onClick={props.handleAdd}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='svgCita'>
                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    );
}