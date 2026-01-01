import React from 'react'
import './SubBtn.css'

export default function SubBtn(props){

    const styleRender = (price) => {
         switch(price) {
            case "Gratis":
                return (
                    "subbtn free"                
                    );
            case "USD$10":
                return (
                    "subbtn D10"                
                    );
            case "USD$30":
                return(
                    "subbtn D30"
                );
            case "USD$40":
                return(
                    "subbtn D40"
                );
         }
    }

    const imgRender = (price) =>
    {
        if(price == "Gratis")
        {
            return(
                <img src="src/images/logocolor.png" alt="Descripción de la imagen" className='imgsub'/>
            );
        }
        return(
            <img src="src/images/logowithe.png" alt="Descripción de la imagen" className='imgsub'/>
        );
    }

    return (
        <div className={styleRender(props.price)}>
            <div className='txt-cont'>
                <a className={props.time == "30 Días" || props.time == "1 Mes" ? 'time' : 'time time2'}>
                    {props.time}
                </a>
                <b className='price'>
                    {props.price}
                </b>
            </div>
            {imgRender(props.price)}
            <div className='des-cont free'>
                    {props.des}
            </div>
        </div>
    );
}