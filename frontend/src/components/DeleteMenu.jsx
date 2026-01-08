import React, { useEffect, useRef } from 'react'
import './DeleteMenu.css'

export default function DeleteMenu(props){

    const ref = useRef(null);
    
    useEffect(() => {
            function handleClickOutside(event) {
                if (props.del && ref.current && !ref.current.contains(event.target)) {
                    props.handleDel();
                }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.handleDel]);
    
    if (!props.del) return null;

    return (
        <div ref={ref} className='deletemenu'>
            <span className='title-deletemenu'>{props.title}</span>
            <span className='subtutle'>{props.subtitle}</span>
            <div className='buttons'>
                <button className='cancel-button' onClick={props.handleDel}>Cancelar</button>
                <button className='acceptBtnD' onClick={props.handleDel}>Aceptar</button>
            </div>
            
        </div>
    );
}