import React, { useContext, useState, useEffect } from 'react'
import './PerfilPsiInfo.css'
import EliminarBtn from './EliminarBtn';
import DataPsi from './DataPsi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PerfilPsiInfo(props) {
    
    const navigate = useNavigate();
    const { user, logout, loading } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        nombre: '',
        email: '',
        plan: 'Plan Gratuito',
        fotoPerfil: '/src/images/testimg.png'
    });

    useEffect(() => {
        if (user) {
            setUserData({
                nombre: user.nombre || user.name || 'Usuario',
                email: user.email || 'correo@ejemplo.com',
                plan: user.plan || 'Plan Gratuito',
                fotoPerfil: user.fotoPerfil || '/src/images/testimg.png'
            });
        }
    }, [user]);

    const changePlan = () => {
        const userRole = user?.role || 'psicologo';
        navigate(`/${userRole}/planes`); 
    }

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    }

    const handleNombreChange = () => {
        // Lógica para cambiar el nombre
    }
    
    const deleteAccount = () => {
        // Lógica para eliminar la cuenta
    }

    if (loading) {
        return (
            <div className="perfilPsiI">
                <div className='perfiltop'>
                    <div className='titlePerfil'>Perfil</div>
                </div>
                <div className='perfilbody'>
                    <p style={{ textAlign: 'center', padding: '20px' }}>Cargando...</p>
                </div>
            </div>
        );
    }
    

    return (
        <div className="perfilPsiI">
            <div className='perfiltop'>
                <div className='titlePerfil'>
                    Perfil
                </div>
                <EliminarBtn texto="Cerrar sesión" img="2" handleDel={handleLogout}/>
            </div>
            <div className='perfilbody'>
                <div className='imgPerfilC'>
                    <img src={userData.fotoPerfil} className='imgPerfil' alt="Foto de perfil" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className='svgimgPerfil svgPerfil'>
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                </div>
                <DataPsi data={userData.nombre} title="Nombre" click={handleNombreChange}/>
                <DataPsi data={userData.email} title="Correo"/>
                <DataPsi data={userData.plan} title="Plan" click={changePlan}/>
            </div>
            <div className='bottomPerfil'>
                <EliminarBtn texto = "Eliminar cuenta" img = "1" handleDel = {props.handleDel}/>
            </div>
        </div>
    );
}