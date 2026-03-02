import React, { useState, useCallback } from 'react'
import './PerfilPsiF.css'
import PerfilPsiInfo from './components/PerfilPsiInfo';
import Horario from './components/Horario';
import DeleteMenu from './components/DeleteMenu';
import clienteAxios from './services/axios';
import { use } from 'react';
import Swal from 'sweetalert2';
import { actualizarHorario } from './services/usuarioService';
import { useOutletContext } from 'react-router-dom';



export default function PerfilPsiF(props) {

    const [delMenu, openDelMenu] = useState(false);
    const { userId } = useOutletContext();


    const handleOpenDel = useCallback(() => {
        openDelMenu(!delMenu)
    }, [delMenu])

    const handleGuardarHorario = useCallback(async (horario) => {
        try {
            const response = await actualizarHorario(userId, horario);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Horario guardado',
                    text: 'El horario se ha guardado exitosamente.',
                    confirmButtonColor: '#2973B2'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar el horario',
                    text: 'No se pudo guardar el horario.',
                    confirmButtonColor: '#2973B2'
                });
            }
        } catch (error) {
            console.error('Error al guardar el horario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar el horario',
                text: 'No se pudo guardar el horario.',
                confirmButtonColor: '#2973B2'
            });
        }
    }, []);
    return (
        <div className="perfilPsiF">
            <PerfilPsiInfo handleDel={handleOpenDel} />
            <Horario userId={userId} onGuardar={handleGuardarHorario} />
            <div className={delMenu ? "showDelMenuP" : "hiddeDelMenuP"}>
                <DeleteMenu title="¿Esta seguro de eliminar su cuenta?" subtitle="Todos los datos se perderan y se cancelara la suscripción" del={delMenu} handleDel={handleOpenDel} />
            </div>
        </div>
    );
}