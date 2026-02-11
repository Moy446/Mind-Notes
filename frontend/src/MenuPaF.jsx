import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import './Menu.css'
import MenuPa from './components/MenuPa';
import AddQr from './components/AddQr';
import AddUID from './components/AddUID';
import { AuthContext } from './context/AuthContext';

function MenuPaF() {

    const { user } = useContext(AuthContext); // Obtén el usuario del contexto
    const [qrOpen, setOpenQr] = useState(false)
    
    const handleOpen = useCallback(() => {
        setOpenQr(!qrOpen)
    }, [qrOpen])

    const [uidOpen, setOpenUID] = useState(false)
    
    const handleOpenUID = useCallback(() => {
        setOpenUID(!uidOpen)
    }, [uidOpen])

    const [refreshKey, setRefreshKey] = useState(0); // Para refrescar la lista de psicólogos

    // Callback para cuando se vincula exitosamente un psicólogo
    const handleVinculacionExitosa = useCallback(() => {
        console.log('Psicólogo vinculado exitosamente');
        setRefreshKey(prev => prev + 1); // Trigger refresh en componentes hijos
    }, []);

    return (
        <div className='menuFullCon'>
            <MenuPa/>
            <Outlet context={{qrOpen , handleOpen, uidOpen, handleOpenUID, refreshKey}}/>
            <div className={qrOpen ? 'showQr' : 'hidenMenu'}>
                <AddQr title = "Agregar Psicologo" img = "/src/images/pqr.png" open = {qrOpen} handleOpen = {handleOpen}/>
            </div>
            <div className={uidOpen ? 'showUID' : 'hidenMenu'}>
                <AddUID 
                    open={uidOpen} 
                    handleOpen={handleOpenUID}  
                    handleOpenQR={handleOpen}
                    userRole="Paciente"
                    userId={user?.id}
                    onVinculacionExitosa={handleVinculacionExitosa}
                />
            </div>
        </div>  
    );
}

export default MenuPaF
