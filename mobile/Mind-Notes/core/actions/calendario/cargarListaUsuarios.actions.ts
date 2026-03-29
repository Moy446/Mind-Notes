import { clienteAxios } from "@/core/API/clienteAxios"



export const cargarListaPsicologos = async () => {
    try {
        const res = await clienteAxios.get('/paciente/getPsicologist/')
        return res.data.data
    } catch (error) {
        console.log(error)
        throw('No se pudieron obtener los psicologos')
    }
}