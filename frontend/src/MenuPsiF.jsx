import React, { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import './Menu.css'
import MenuPsi from './components/MenuPsi';
import AddQr from './components/AddQr';
import AddUID from './components/AddUID';

function MenuPsiF() {

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
            <Outlet context={{qrOpen , handleOpen, uidOpen, handleOpenUID, refreshKey}}/>
            <div className={qrOpen ? 'showQr' : 'hidenMenu'}>
                <AddQr title = "Agregar Paciente" img = "/src/images/pqr.png" open = {qrOpen} handleOpen = {handleOpen}/>
            </div>
            <div className={uidOpen ? 'showUID' : 'hidenMenu'}>
                <AddUID 
                    open={uidOpen} 
                    handleOpen={handleOpenUID}
                    handleOpenQR={handleOpen}
                    userRole="psicologo"
                    userId={localStorage.getItem('idPsicologo')}
                    onVinculacionExitosa={handleVinculacionExitosa}
                />
            </div>
        </div>  
    );
}

export default MenuPsiF