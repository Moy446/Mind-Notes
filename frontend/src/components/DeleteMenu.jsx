import React, { useEffect, useRef } from 'react'
import './DeleteMenu.css'

export default function DeleteMenu(props){

    const ref = useRef(null);

    const handleCancel = props.onCancel || props.handleDel;
    const handleConfirm = props.onConfirm || props.handleDel;
    
    useEffect(() => {
            function handleClickOutside(event) {
                if (props.del && ref.current && !ref.current.contains(event.target)) {
                    if (handleCancel) {
                        handleCancel();
                    }
                }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
        }, [props.del, handleCancel]);
    
    if (!props.del) return null;

    return (
        <div ref={ref} className='deletemenu'>
            <span className='title-deletemenu'>{props.title}</span>
            <span className='subtutle'>{props.subtitle}</span>
            <div className='buttons'>
                <button className='cancel-button' onClick={handleCancel}>Cancelar</button>
                <button className='acceptBtnD' onClick={handleConfirm}>Aceptar</button>
            </div>
            
        </div>
    );
}