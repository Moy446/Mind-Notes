import { clienteAxios } from "@/core/API/clienteAxios"


export const cargarCitasPsicologos = async () => {
    try {
        const res = await clienteAxios.get('/psicologo/calendario/')
        return res.data
    } catch (error) {
        console.log(error)
        throw('No se pudieron cargar las citas')
    }
}

export const cargarCitasPacientes = async (idPsicologo:string) => {
    try {
        const res = await clienteAxios.get(`/paciente/calendario/${idPsicologo}`)
        return res.data.formattedAgenda
    } catch (error) {
        console.log(error)
        throw('No se pudieron cargar las citas')
    }
}