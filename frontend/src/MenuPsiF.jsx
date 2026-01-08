import React, { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import './Menu.css'
import MenuPsi from './components/MenuPsi';
import AddQr from './components/AddQr';
import AddUID from './components/AddUID';

function MenuPsiF() {

    const [qrOpen, setOpenQr] = useState(false)
    
    const handleOpen = useCallback(() => {
        setOpenQr(!qrOpen)
    }, [qrOpen])

    const [uidOpen, setOpenUID] = useState(false)
    
    const handleOpenUID = useCallback(() => {
        setOpenUID(!uidOpen)
    }, [uidOpen])

    return (
        <div className='menuFullCon'>
            <MenuPsi/>
            <Outlet context={{qrOpen , handleOpen, uidOpen, handleOpenUID}}/>
            <div className={qrOpen ? 'showQr' : 'hidenMenu'}>
                <AddQr title = "Agregar Paciente" img = "/src/images/pqr.png" open = {qrOpen} handleOpen = {handleOpen}/>
            </div>
            <div className={uidOpen ? 'showUID' : 'hidenMenu'}>
                <AddUID open = {uidOpen} handleOpen = {handleOpenUID}/>
            </div>
        </div>  
    );
}

export default MenuPsiF