import React, { useContext, useState, useCallback, useEffect, useRef } from 'react'
import './PerfilPaF.css'
import DeleteMenu from './components/DeleteMenu';
import EliminarBtn from './components/EliminarBtn';
import DataPsi from './components/DataPsi';
import EditModal from './components/EditModal';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './context/AuthContext';
import { actualizarPerfil, cambiarFotoPerfil, eliminarCuenta } from './services/usuarioService';    
import { getImageUrl } from './utils/imageHelper';
import Swal from 'sweetalert2';

export default function PerfilPaF(props){

    const navigate = useNavigate();
    const { user, logout, loading, updateUser } = useContext(AuthContext);
    const fotoInputRef = useRef(null);
    
    const [userData, setUserData] = useState({
        nombre: '',
        email: '',
        fotoPerfil: '/src/images/testimg.png'
    });

    const [delMenu, openDelMenu] = useState(false);
    const [editModal, setEditModal] = useState({ open: false, field: '', title: '', value: '' });

    const handleOpenDel = useCallback(() => {
            openDelMenu((prev) => !prev)
        }, [])

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
    
                const deleteResult = await eliminarCuenta(user.id);
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
    const handleOpenEdit = (field, title, value) => {
        setEditModal({ open: true, field, title, value });
    };

    const handleCloseEdit = () => {
        setEditModal({ open: false, field: '', title: '', value: '' });
    };

    const handleSaveEdit = async (newValue) => {
        try {
            const updateData = { [editModal.field]: newValue };
            const result = await actualizarPerfil(user.id, updateData);
            
            if (result.success) {
                setUserData(prev => ({ ...prev, [editModal.field]: newValue }));
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    };

    const handleCambiarFoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: 'Error',
                text: 'Solo se permiten imágenes',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: 'Error',
                text: 'La imagen debe pesar menos de 5MB',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const formData = new FormData();
        formData.append('foto', file);

        try {
            const result = await cambiarFotoPerfil(formData);
            if (result.success) {
    const nuevaFoto = `http://localhost:5000/${result.fotoPerfil}`;
    console.log('Nueva foto:', nuevaFoto); // TEMPORAL
    console.log('result.fotoPerfil:', result.fotoPerfil); // TEMPORAL
    
    setUserData(prev => ({
        ...prev,
        fotoPerfil: nuevaFoto
    }));

    // Actualizar el contexto también
    updateUser({ fotoPerfil: result.fotoPerfil });

    Swal.fire({
        title: 'Foto actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    console.log(userData.fotoPerfil); 
}
        } catch (error) {
            Swal.fire({
                title: 'Error al cambiar la foto',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };
    
    useEffect(() => {
        if (user) {
            setUserData({
                nombre: user.nombre || user.name || 'Usuario',
                email: user.email || '',
                fotoPerfil: user.fotoPerfil || '/src/images/testimg.png'
            });
            
            console.log(user.fotoPerfil);
        }
    }, [user]);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    }
    
    return (
        <div className="perfilPaF">
            <div className='paTitle'>
                Perfil
                <EliminarBtn texto="Cerrar sesión" img="2" handleDel={handleLogout} />
            </div>
            <div className='perfilInfo'>
                <div className='imgPerfilPaC'>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCambiarFoto}
                        style={{ display: 'none' }}
                        ref={fotoInputRef}
                        id="fotoInputPa"
                    />
                    <label 
                        htmlFor="fotoInputPa" 
                        style={{ cursor: 'pointer', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <img src={userData.fotoPerfil} className='imgPerfilPa' alt="Foto de perfil"/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F2EFE7" className='svgimgPerfilPa svgPerfilPa'>
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                    </label>
                </div>
                <DataPsi 
                    data={userData.nombre} 
                    title="Nombre" 
                    patient={true}
                    click={() => handleOpenEdit('nombre', 'Nombre', userData.nombre)}
                />
                <DataPsi 
                    data={userData.email} 
                    title="Correo" 
                    patient={true}
                    click={() => handleOpenEdit('email', 'Correo', userData.email)}
                />
                <EliminarBtn texto = "Eliminar cuenta" img = "1" handleDel = {handleOpenDel}/>
            </div>
            <div className={delMenu ? "showDelMenuPa" : "hiddeDelMenuPa"}>
               <DeleteMenu
                    title = "¿Esta seguro de eliminar su cuenta?"
                    subtitle = "Todos los datos se perderan"
                    del={delMenu}
                    onCancel={handleOpenDel}
                    onConfirm={handleEliminarCuenta}
                />
            </div>
            <EditModal
                open={editModal.open}
                handleClose={handleCloseEdit}
                title={editModal.title}
                currentValue={editModal.value}
                onSave={handleSaveEdit}
                type={editModal.field === 'email' ? 'email' : 'text'}
            />
        </div>
    );
}