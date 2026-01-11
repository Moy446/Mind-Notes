import React, { useState } from 'react';
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
        <a href="#" className="a-headermenu">Nosotros</a>
        <a href="#" className="a-headermenu">¿Cómo funciona?</a>
        <a href="#" className="a-headermenu">Precios</a>
        <a href="#" className="a-headermenu">Ingresar</a>
      </nav>
    </div>
  );
}
