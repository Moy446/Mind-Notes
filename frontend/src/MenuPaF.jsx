import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './Menu.css'
import MenuPa from './components/MenuPa';
import { authService } from './services/authService';

function MenuPaF() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!authService.isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className='menuFullCon'>
            <MenuPa/>
            <Outlet/>
        </div>
    )
}

export default MenuPaF
