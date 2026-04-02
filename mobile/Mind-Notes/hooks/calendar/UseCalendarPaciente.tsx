import { agendarCita, cargarCitasPsicologo, cargarListaPsicologos, editarCita } from "@/core/actions/calendario/pacientes/calendarioPaciente.actions";
import { formatedPatientList, FormattedAgendum, infoCita } from "@/core/interfaces/Dates";
import { useState } from "react"
import { Alert } from "react-native";


export const useCalendarPaciente = () => {
    type CitaCalendar = {
        idCita: string;
        idUsuario: string;
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

    //Formatear fechas
    const buildLocalDateTime = (fechaISO: string, hora: string) => {
        const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
        const [hours, minutes] = hora.split(':').map(Number);

        return new Date(
        year,
        month - 1,
        day,
        hours,
        minutes
        );
    };

    const formatLocalDate = (date: Date) => {
        return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
    };


    const loadUserList =   () => {
        //TODO: cargar psicologos
        const psychologists = cargarListaPsicologos()
        psychologists.then((res) => {
            setUserList(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    const loadDates = async (idPsicologo: string) => {
        const citas = await cargarCitasPsicologo(idPsicologo)
        const formattedCitas = citas.map((cita: FormattedAgendum) => ({
            idCita: cita.id,
            idUsuario: idPsicologo,
            title: cita.nombre,
            start: buildLocalDateTime(cita.fecha, cita.horaI),
            end: buildLocalDateTime(cita.fecha, cita.horaF),
            extendedProps: {
                estado: cita.estado,
                img: cita.img
            }
        }))
        setAllDates(formattedCitas)
    }

    const loadDateEvents = (date: Date) => {
        const selectedDate = formatLocalDate(date);
        const filtered = allDates.filter((cita) => {
            const citaDate = formatLocalDate(cita.start);
            return citaDate === selectedDate;
        });
        setCitas(filtered);
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
    const editEvent = async (infoCita: infoCita) => {
        try{
            if (!infoCita.idCita) {
                throw new Error('ID de cita no proporcionado para edición');
            }
            const result = await editarCita(infoCita, infoCita.idCita);
            //Todo: mostrar mensaje de exito
            Alert.alert('Cita editada con éxito')
        }catch(error: any){
            Alert.alert('Error', error.response?.data?.message || 'No se pudo editar la cita');
        } 
    }



    return{
        loadUserList,
        formatLocalDate,
        loadDates,
        loadDateEvents,
        addEvent,
        editEvent,
        userList,
        allDates,
        citas,
        error
    }
}