import { clienteAxios } from "@/core/API/clienteAxios"

//TODO: Crear una interfaz para las citas de los pacientes, similar a la de los psicologos


export const cargarCitasPacientes = async (idPsicologo:string)=> {
    try {
        const res = await clienteAxios.get(`/paciente/calendario/${idPsicologo}`)
        return res.data
    } catch (error) {
        console.log(error)
        throw('No se pudieron cargar las citas')
    }
}