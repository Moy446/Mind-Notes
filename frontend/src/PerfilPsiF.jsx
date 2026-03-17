import React, { useState, useCallback } from 'react'
import './PerfilPsiF.css'
import PerfilPsiInfo from './components/PerfilPsiInfo';
import Horario from './components/Horario';
import DeleteMenu from './components/DeleteMenu';
import Swal from 'sweetalert2';
import { actualizarHorario ,eliminarCuenta} from './services/usuarioService';
import { useOutletContext } from 'react-router-dom';



export default function PerfilPsiF() {

    const [delMenu, openDelMenu] = useState(false);
    const { userId } = useOutletContext();


    const handleOpenDel = useCallback(() => {
        openDelMenu((prev) => !prev);
    }, []);

    const handleGuardarHorario = useCallback(async (horario) => {
        try {
            const response = await actualizarHorario(userId, horario);
            if (response?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Horario guardado',
                    text: 'El horario se ha guardado exitosamente.',
                    confirmButtonColor: '#2973B2'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar horario',
                    text: response?.message || 'No se pudo guardar el horario.',
                    confirmButtonColor: '#2973B2'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar horario',
                text: 'No se pudo guardar el horario.',
                confirmButtonColor: '#2973B2'
            });
        }
    }, []);
    const handleEliminarCuenta = async () => {
        try {
            openDelMenu(false);
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.isConfirmed) {
                return;
            }

            const deleteResult = await eliminarCuenta(userId);
            if (deleteResult.success) {
                await Swal.fire({
                    title: 'Cuenta eliminada',
                    text: 'Tu cuenta ha sido eliminada exitosamente.',
                    icon: 'success',
                    confirmButtonColor: '#2973B2'
                });

                // Redirigir al login después de eliminar la cuenta
                window.location.href = '/login';
            } else {
                Swal.fire({
                    title: 'Error al eliminar la cuenta',
                    text: deleteResult?.message || 'No se pudo eliminar la cuenta.',
                    icon: 'error',
                    confirmButtonColor: '#2973B2'
                });
                }
        } catch (error) {
            Swal.fire({
                title: 'Error al eliminar la cuenta',
                text: 'No se pudo eliminar la cuenta.',
                icon: 'error',
                confirmButtonColor: '#2973B2'
            });
        }
    };
    return (
        <div className="perfilPsiF">
            <PerfilPsiInfo handleDel={handleOpenDel} />
            <Horario userId={userId} onGuardar={handleGuardarHorario} />
            <div className={delMenu ? "showDelMenuP" : "hiddeDelMenuP"}>
                <DeleteMenu
                    title="¿Esta seguro de eliminar su cuenta?"
                    subtitle="Todos los datos se perderan y se cancelara la suscripción"
                    del={delMenu}
                    onCancel={handleOpenDel}
                    onConfirm={handleEliminarCuenta}
                />
            </div>
        </div>
    );
}