import React from 'react'
import './PerfilPsiF.css'
import PerfilPsiInfo from './components/PerfilPsiInfo';
import Horario from './components/Horario';

export default function PerfilPsiF(props){

    return (
        <div className="perfilPsiF">
            <PerfilPsiInfo/>
            <Horario/>
        </div>
    );
}