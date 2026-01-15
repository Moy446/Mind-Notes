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
        <Link to={'/'}>Nosotros</Link>
        <Link to={"/ComoFunciona"}>¿Cómo funciona?</Link>
        <Link to={'/ComoFunciona'}>Precios</Link>
        <Link to={'/ComoFunciona'}>Ingresar</Link>
      </nav>
    </div>
  );
}
