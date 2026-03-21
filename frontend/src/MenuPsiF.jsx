import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import './Menu.css'
import MenuPsi from './components/MenuPsi';
import AddQr from './components/AddQr';
import AddUID from './components/AddUID';
import { AuthContext } from './context/AuthContext';

function MenuPsiF() {

    const { user } = useContext(AuthContext); // Obtén el usuario del contexto
    const [qrOpen, setOpenQr] = useState(false)
    const [uidOpen, setOpenUID] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0); // Para refrescar la lista de pacientes
    
    const handleOpen = useCallback(() => {
        setOpenQr(!qrOpen)
    }, [qrOpen])

    const handleOpenUID = useCallback(() => {
        setOpenUID(!uidOpen)
    }, [uidOpen])

    // Callback para cuando se vincula exitosamente un paciente
    const handleVinculacionExitosa = useCallback(() => {
        console.log('Paciente vinculado exitosamente');
        setRefreshKey(prev => prev + 1); // Trigger refresh en componentes hijos
    }, []);

    return (
        <div className='menuFullCon'>
            <MenuPsi/>
            <Outlet context={{qrOpen , handleOpen, uidOpen, handleOpenUID, refreshKey, userId: user?.id}}/>
            <div className={qrOpen ? 'showQr' : 'hidenMenu'}>
                <AddQr 
                    title = "Agregar Paciente" 
                    img = "/src/images/pqr.png" 
                    open = {qrOpen} 
                    handleOpen = {handleOpen}
                    userRole="psicologo"
                    userId={user?.id}
                    onVinculacionExitosa={handleVinculacionExitosa}
                />
            </div>
            <div className={uidOpen ? 'showUID' : 'hidenMenu'}>
                <AddUID 
                    open={uidOpen} 
                    handleOpen={handleOpenUID}  
                    handleOpenQR={handleOpen}
                    userRole="psicologo"
                    userId={user?.id}
                    onVinculacionExitosa={handleVinculacionExitosa}
                />
            </div>
        </div>  
    );
}

export default MenuPsiF