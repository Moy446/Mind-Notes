import React, { useEffect, useRef } from 'react'
import './AddUID.css'

export default function AddUID(props){
    
    const ref = useRef(null);

    useEffect(() => {
            function handleClickOutside(event) {
                if (props.open && ref.current && !ref.current.contains(event.target)) {
                    props.handleOpen();
                }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.handleOpen]);
    
    if (!props.open) return null;

    return (
        <div ref={ref} className='Adduid'>
            <div className='row1'>
                <input type="number" id="uid" name="uid" placeholder="Ingresar UID" className='txtuid'></input>
                <button className='btnuid btnefect'>Buscar</button>
            </div>
            <button className='btnqr btnefect'>Escanear codigo QR</button>
        </div>
    );
}