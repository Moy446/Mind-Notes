import { cargarCitasPsicologos } from "@/core/actions/calendario/cargarCitas.actions"
import { useState } from "react"

export const useCalendar = () => {

  const [citas, setCitas] = useState([])
  const [error, setError] = useState(null)

  const formatDate = (fecha:string) => {
    const [y, m, d] = fecha.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const loadPacientsEvents = () => {

  }

  const cargarCitas = async () => {
    try {

      const data = await cargarCitasPsicologos()

      if (data.success) {
        const citasList = data.formattedAgenda

        const citasFormateadas = citasList.map((cita: any) => ({
        id: cita.id,
        title: cita.nombre,
        start: new Date(`${formatDate(cita.fecha)}T${cita.horaI}:00`),
        end: new Date(`${formatDate(cita.fecha)}T${cita.horaF}:00`),
        extendedProps: {
            estado: cita.estado,
            img: cita.img || './images/userDefault.png'
        }
      }))
      setCitas(citasFormateadas)
      } else {
        throw new Error(data.message)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const addEvent = () => {
    console.log('Evento agregado');
  }

  return {
    loadPacientsEvents,
    addEvent,
    cargarCitas,
    error,
    citas
  }
}

