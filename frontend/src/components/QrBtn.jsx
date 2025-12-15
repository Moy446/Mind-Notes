import React from 'react'
import './AddBtn.css'

export default function QrBtn(){

    return (
        <div className="add-btn">
            <button type="submit" className="add-btn">
               <img src="src/images/qr.png" alt="Descripción de la imagen" className='image-add'/>
            </button>
        </div>  
    );
}
