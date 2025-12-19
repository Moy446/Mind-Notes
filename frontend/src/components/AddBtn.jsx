import React from 'react'
import './AddBtn.css'

export default function AddBtn(props){

    return (
            <button type="submit" className="add-btn">
               <img src={props.img} alt="Descripción de la imagen" className='image-add'/>
            </button>
    );
}
