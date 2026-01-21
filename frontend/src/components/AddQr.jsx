import React, { useEffect, useRef } from 'react'
import './AddQr.css'

export default function AddQr(props){

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
        <div ref={ref} className='addqr'>
            <span className='title-addqr'>{props.title}</span>
            <img src={props.img} alt="Descripción de la imagen" className='img-addqr'/>
            <button className='cancel-addqr' onClick={props.handleOpen}>Cancelar</button>
        </div>
    );
}