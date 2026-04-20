import { clienteAxios } from "@/core/API/clienteAxios"

export const subirGrabacion = async (formData: FormData) => {
    try {
        await clienteAxios.post('/psicologo/grabacion', formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {
        console.error(error?.response?.data);
        throw('Hubo un error para guardar la grabacion')
    }
}