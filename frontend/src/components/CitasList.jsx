import React from 'react'
import './CitasList.css'
import Cita from './Cita';

export default function CitasList(props) {

    function citasDia() {
        const citasMostradas = [];

        const today = new Date(props.current);
        today.setHours(0, 0, 0, 0);

        for (const cita of props.citas) {
            const citaDate = new Date(cita.start);
            citaDate.setHours(0, 0, 0, 0);

            if (citaDate.getTime() === today.getTime()) {

                const horaDate = new Date(cita.start);
                const hora = horaDate.getHours().toString().padStart(2, '0');
                const minutes = horaDate.getMinutes().toString().padStart(2, '0');

                const time = `${hora}:${minutes}`;

                citasMostradas.push(
                    <Cita
                        id ={cita.id}
                        name={cita.title}
                        hora={time}
                        img={cita.extendedProps.img}
                        handleEdit={() => props.handleEdit(cita.id)}
                    />
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
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}