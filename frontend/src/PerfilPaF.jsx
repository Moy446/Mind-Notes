import React, { useContext,useState, useCallback, useEffects, use, useEffect} from 'react'
import './PerfilPaF.css'
import DeleteMenu from './components/DeleteMenu';
import EliminarBtn from './components/EliminarBtn';
import DataPsi from './components/DataPsi';
import EditModal from './components/EditModal';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './context/AuthContext';
import { actualizarPerfil } from './services/usuarioService';    

export default function PerfilPaF(props){

    const navigate = useNavigate();
    const { user, logout, loading } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        nombre: '',
        email: '',
        fotoPerfil: '/src/images/testimg.png'
    });

    const [delMenu, openDelMenu] = useState(false);
    const [editModal, setEditModal] = useState({ open: false, field: '', title: '', value: '' });

    const handleOpenDel = useCallback(() => {
            openDelMenu(!delMenu)
        }, [delMenu])

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
                // Actualizar también en el contexto si es necesario
                // Puedes agregar un método updateUser en AuthContext
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    };
    
    useEffect(() => {
        if (user) {
            setUserData({
                nombre: user.nombre || user.name || 'Usuario',
                email: user.email || '',
                fotoPerfil: user.fotoPerfil || '/src/images/testimg.png'
            });
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
                    <img src='/src/images/testimg.png' className='imgPerfilPa'/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F2EFE7" class="size-6" className='svgimgPerfilPa svgPerfilPa'>
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
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
               <DeleteMenu title = "¿Esta seguro de eliminar su cuenta?" subtitle = "Todos los datos se perderan" del={delMenu} handleDel={handleOpenDel}/>
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