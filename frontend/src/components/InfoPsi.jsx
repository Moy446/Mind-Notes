import React, {Fragment, useEffect, useState} from 'react'
import './InfoPsi.css'
import EliminarBtn from './EliminarBtn';
import { div, p } from 'framer-motion/client';

export default function InfoPsi(props){

    const [maxImages, setMaxImages] = useState(4);
    useEffect(() => {
        function adjustMaxImages(){
            if(props.materialAdjunto?.length < 4){
                setMaxImages(props.materialAdjunto.length);
            }
        }
        adjustMaxImages();
    },[]);


    return (
        <div className='infopsi'>
            <div className='upInfoPsi'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="size-6 svgInfopsi btnInfopsi" onClick={props.handleOpen}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <img src={props.img} className='imgInfoPsi'/>
                <p className='nameInfoPsi'>
                    {props.name}
                </p>
                <hr className='infoPsiLine'/>
                <div className='suppMaterial'>
                    <div className='titlesuppmaterialinfopsi btnInfopsi' onClick={props.handleSuppInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className='size-6 svgInfopsi'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                        <p className='suppTitleInfopsi'>
                            Documentos y Material de apoyo
                        </p>
                    </div>
                    <div className='documentsInfoPsi'>
                        {
                            props.materialAdjunto?.map((m,i) =>{
                                if(i >= maxImages){
                                    return;
                                }
                                //m contiene {_id,type,nombre,path}
                                const {_id,type,nombre,path} = m;
                                const documentType = type
                                if ( documentType === "pdf" || documentType === "docx" || documentType === "doc" || documentType === "txt"){
                                    return(
                                        <div className="divDocument btnInfopsi" key={i}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            <p>{nombre}</p>
                                        </div>
                                    )
                                }else if (documentType === "mp4" ||documentType ===  "mov" ||documentType ===  "avi"){
                                    return(
                                        <div className="divDocument btnInfopsi" key={i}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                            <p>{nombre}</p>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div className="divDocument btnInfopsi" key={i}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                            </svg>
                                            <p>{nombre}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <hr className='infoPsiLine'/>
            </div>
            <div className='deleteBtnInfoPsi'>
                <EliminarBtn texto = "Eliminar paciente" img = "1" del = {props.del} handleDel = {props.handleDel}/>
            </div>
        </div>
    );
}