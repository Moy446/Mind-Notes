import React from 'react'
import './AddBtn.css'

export default function CloseBtn(){

    return (
        <div className="add-btn">
            <button type="submit" className="add-btn">
               <img src="src/images/close.png" alt="Descripción de la imagen" className='image-add'/>
            </button>
        </div>  
    );
}
