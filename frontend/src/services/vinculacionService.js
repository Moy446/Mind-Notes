import clienteAxios from './axios';
/**
 * Vincula un paciente a un psicólogo
 * @param {string} idPsicologo - ID del psicólogo
 * @param {string} idPaciente - ID del paciente a vincular
 * @returns {Promise} Respuesta del servidor
 */
export const vincularPaciente = async (idPsicologo, idPaciente) => {
    try {
        const response = await clienteAxios.post(
            `/vincularPacientes/${idPsicologo}`,
            { idPaciente },
            {
                withCredentials: true, // IMPORTANTE: envía las cookies HttpOnly
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al vincular paciente:', error);
        throw error;
    }
};

/**
 * Vincula un psicólogo a un paciente
 * @param {string} idPaciente - ID del paciente
 * @param {string} idPsicologo - ID del psicólogo a vincular
 * @returns {Promise} Respuesta del servidor
 */
export const vincularPsicologo = async (idPaciente, idPsicologo) => {
    try {
        const response = await clienteAxios.post(
            `/vincularPsicologo/${idPaciente}`,
            { idPsicologo },
            {
                withCredentials: true, // IMPORTANTE: envía las cookies HttpOnly
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error al vincular psicólogo:', error);
        throw error;
    }
};

/**
 * Obtiene la lista de pacientes vinculados a un psicólogo
 * @param {string} idPsicologo - ID del psicólogo
 * @returns {Promise} Lista de pacientes
 */
export const obtenerPacientesVinculados = async (idPsicologo) => {
    try {
        const response = await clienteAxios.get(`/pacientes/${idPsicologo}`, {
            withCredentials: true // IMPORTANTE: envía las cookies HttpOnly
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        throw error;
    }
};

/**
 * Obtiene la lista de psicólogos vinculados a un paciente
 * @param {string} idPaciente - ID del paciente
 * @returns {Promise} Lista de psicólogos
 */
export const obtenerPsicologosVinculados = async (idPaciente) => {
    try {
        const response = await clienteAxios.get(`/psicologos/${idPaciente}`, {
            withCredentials: true // IMPORTANTE: envía las cookies HttpOnly
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener psicólogos:', error);
        throw error;
    }
};