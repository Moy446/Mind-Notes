import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './Menu.css'
import MenuPsi from './components/MenuPsi';
import ChatSelector from './components/ChatSelector';

function MenuPsiF() {
    return (
        <div className='menuFullCon'>
            <MenuPsi/>
            <Outlet/>
        </div>  
    );
}

export default MenuPsiF