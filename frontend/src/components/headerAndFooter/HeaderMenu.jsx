import { useState } from 'react';
import {Link } from 'react-router-dom';
import './HeaderMenu.css';

//Logo
import logoColor from '../../images/logocolor.png'

export default function HeaderMenu() {
        const [activo, setActivo] = useState(false);

        return (
        <div className="div-HeaderContenedor">
        <img
                src={logoColor}
                alt="Logo"
                className="img-headermenu"
        />

        <button
                className={'menu-toggle'}
                onClick={() => setActivo(!activo)}
                aria-label="Abrir menú"
        >
                <span></span>
                <span></span>
                <span></span>
        </button>

        <nav className={`nav-headermenu ${activo ? 'activo' : ''}`}>
                <Link to={'/'} className='nav-link'>Nosotros</Link>
                <Link to={"/ComoFunciona"} className='nav-link'>¿Cómo funciona?</Link>
                <Link to={"/PlanesGeneral"} className='nav-link'>Precios</Link>
                <Link to={'/Login'} className='nav-link'>Ingresar</Link>
        </nav>
        </div>
        );
}
