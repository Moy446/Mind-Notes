import { useState } from "react"
import { agendarCita, cargarCitasPsicologos, FormattedAgendum, loadListPatients } from "@/core/actions/calendario/psicologos/calendarioPsicologo.actions";
import { formatedPatientList, infoCita } from "@/core/interfaces/Dates";
import { Alert } from "react-native";

export const useCalendar = () => {

  type CitaCalendar = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      estado: string;
      img: string;
    };
  };

  const [allDates, setAllDates] = useState<CitaCalendar[]>([])
  const [citas, setCitas] = useState<CitaCalendar[]>([])
  const [error, setError] = useState(null)
  const [userList, setUserList] = useState<formatedPatientList[]>([])
  const formatDate = (fecha:string) => {
    const [y, m, d] = fecha.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const loadPacientsEvents = () => {

  }

  const cargarCitas = async () => {
    try {

      const data = await cargarCitasPsicologos()

      if (data) {

        const citasFormateadas = data.map((cita: FormattedAgendum) => ({
        id: cita.id,
        title: cita.nombre,
        start: new Date(`${formatDate(cita.fecha)}T${cita.horaI}:00`),
        end: new Date(`${formatDate(cita.fecha)}T${cita.horaF}:00`),
        extendedProps: {
            estado: cita.estado,
            img: cita.img || './images/userDefault.png'
        }
      }))
      setAllDates(citasFormateadas)
      } else {
        throw new Error('No se pudieron cargar las citas')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadDateEvents = (date: Date) => {
    const selectedDate = formatDate(date.toISOString().split('T')[0]);
    const filtered = allDates.filter((cita) => {
      const citaDate = formatDate(cita.start.toISOString().split('T')[0]);
      return citaDate === selectedDate;
    });

    setCitas(filtered);
    
  }

  const loadUserList =   (role: string) => {
    if (role === 'psicologo') {
      //cargar pacientes 
      const patients = loadListPatients()
      patients.then((res) => {
        setUserList(res)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      //TODO: cargar psicologos
    }
  }

  const addEvent = async (infoCita: infoCita) => {
    try{
      const result = await agendarCita(infoCita);
      //Todo: mostrar mensaje de exito
      Alert.alert('Cita agendada con éxito')
    }catch(error: any){
      Alert.alert('Error', error.response?.data?.message || 'No se pudo agendar la cita');
    }
    
    
  }

  return {
    loadPacientsEvents,
    loadDateEvents,
    addEvent,
    cargarCitas,
    loadUserList,
    allDates,
    citas,
    error,
    userList
  }
}

