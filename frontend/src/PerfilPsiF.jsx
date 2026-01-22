import React, { useState, useCallback } from 'react'
import './PerfilPsiF.css'
import PerfilPsiInfo from './components/PerfilPsiInfo';
import Horario from './components/Horario';
import DeleteMenu from './components/DeleteMenu';

export default function PerfilPsiF(props){

    const [delMenu, openDelMenu] = useState(false);

    const handleOpenDel = useCallback(() => {
            openDelMenu(!delMenu)
        }, [delMenu])

    return (
        <div className="perfilPsiF">
            <PerfilPsiInfo handleDel = {handleOpenDel}/>
            <Horario/>
            <div className={delMenu ? "showDelMenuP" : "hiddeDelMenuP"}>
                <DeleteMenu title = "¿Esta seguro de eliminar su cuenta?" subtitle = "Todos los datos se perderan y se cancelara la suscripción" del ={delMenu} handleDel ={handleOpenDel}/>
            </div>
        </div>
    );
}