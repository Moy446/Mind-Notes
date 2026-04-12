import { clienteAxios } from "@/core/API/clienteAxios"
import { Datum, formatedPatientList, FormattedAgendum, infoCita, ListPsycologist } from "@/core/interfaces/Dates"

//TODO: Crear una interfaz para las citas de los pacientes, similar a la de los psicologos

export const formatPsicologistsList = (list: Datum[]): formatedPatientList[] => {
    return list.map(psicologo => ({
        id: psicologo.idPsicologo,
        nombre: psicologo.nombrePsicologo,
        img: psicologo.fotoPerfilPsicologo
    }))
}

export const cargarListaPsicologos = async (): Promise<formatedPatientList[]> => {
    try {
        const res = await clienteAxios.get<ListPsycologist>('/paciente/getPsicologist/')
        return formatPsicologistsList(res.data.data)
    } catch (error) {
        console.log(error?.response?.data || error)
        throw('No se pudieron obtener los psicologos')
    }
}

const returnFormattedAgenda = (data: any): FormattedAgendum[] => {
    if (!data.success || !data.formattedAgenda) {
        return []
    }
    return data.formattedAgenda

}

export const cargarCitasPsicologo = async (idPsicologo: string): Promise<FormattedAgendum[]> => {
    try {
        const res = await clienteAxios.get<FormattedAgendum[]>(`/paciente/calendario/${idPsicologo}`)
        return returnFormattedAgenda(res.data)
    } catch (error) {
        console.log(error?.response?.data || error)
        throw('No se pudieron obtener las citas')
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