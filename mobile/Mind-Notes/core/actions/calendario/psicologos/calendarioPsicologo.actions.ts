import { clienteAxios } from "@/core/API/clienteAxios"
import { formatedPatientList, FormattedAgendum, infoCita, NombresUsuario, PatientList, PsicologoDates } from "@/core/interfaces/Dates";

const returnFormattedAgenda = (data: PsicologoDates): FormattedAgendum[] => {
    if (!data.success || !data.formattedAgenda) {
        return []
    }
    return data.formattedAgenda

}

export const cargarCitasPsicologos = async (): Promise<FormattedAgendum[]> => {
    try {
        const res = await clienteAxios.get<PsicologoDates>('/psicologo/calendario/')
        return returnFormattedAgenda(res.data)
    } catch (error) {
        console.log(error)
        throw('No se pudieron cargar las citas')
    }
}

const formatedList = (patients: NombresUsuario[]): formatedPatientList[] => {
    return patients.map((patient) => ({
        id: patient.idPaciente,
        nombre: patient.nombrePaciente,
        img: patient.fotoPerfilPaciente
    }))
}

export const loadListPatients = async (): Promise<formatedPatientList[]> => {
    try {
        const res = await clienteAxios.get<PatientList>('/psicologo/calendario/pacientes/lista')
        return formatedList(res.data.nombresUsuarios)
    } catch (error) {
        console.log(error)
        throw('No se pudieron cargar las citas')
    }
}

//TODO :AGENDAR CITA
export const agendarCita = async (infoCita:infoCita) => {
    try {
        const res = await clienteAxios.post('/psicologo/calendario/', infoCita)
        return res.data.success
    } catch (error) {
        throw(error)
    }
}

//TODO :EDITAR CITA
export const editarCita = async (infoCita:infoCita, idCita:string) => {
    try {
        const res = await clienteAxios.put(`/psicologo/calendario/${idCita}`, infoCita)
        return res.data.success
    } catch (error) {
        throw(error)
    }
}

