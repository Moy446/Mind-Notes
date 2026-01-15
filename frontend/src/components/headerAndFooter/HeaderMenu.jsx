import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes,Route ,Link } from 'react-router-dom';
import './HeaderMenu.css';

export default function HeaderMenu(props) {
  const [activo, setActivo] = useState(false);

  return (
    <div className="div-HeaderContenedor">
      <img
        src={props.img}
        alt="Logo"
        className="img-headermenu"
      />

      <button
        className="menu-toggle"
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
        <Link to={'/ComoFunciona'} className='nav-link'>Precios</Link>
        <Link to={'/ComoFunciona'} className='nav-link'>Ingresar</Link>
      </nav>
    </div>
  );
}
