import React, { act, useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SuppPsi.css'
import clienteAxios from '../services/axios.js';

export default function SuppPsi(props) {

    const [archivos, setArchivos] = useState([]);

    const [paginador, setPaginador] = useState(1);
    const [maxPaginador, setMaxPaginador] = useState(3);

    const [activo, setActivo] = useState(false);

    useEffect(() => {
        if (activo) {
            setMaxPaginador(Math.ceil(props.materialAdjunto?.length / 20));
        } else {
            setMaxPaginador(Math.ceil((props.expedientes?.length + props.grabaciones?.length) / 20));
        }
    }, [activo]);

    const handleClick = () => {
        setActivo(!activo);
    };

    const movePaginator = (next) => {
        if (next) {
            return () => setPaginador(paginador + 1);
        } else {
            return () => setPaginador(paginador - 1);
        }
    };
    const menuRender = (activo) => {
        if (activo) {
            return (
                <div className='matApo'>
                    {
                        props.expedientes?.map((e, i) => {
                            const { _id, type, nombre, path } = m;
                            const documentType = type;
                            if (documentType === "pdf" || documentType === "docx" || documentType === "doc" || documentType === "txt") {
                                return (
                                    <div className="itemsmatApo btnSuppPsi" key={i}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        <p>{nombre}</p>
                                    </div>
                                )

                            } else if (documentType === "mp4" || documentType === "mov" || documentType === "avi") {
                                return (
                                    <div className="itemsmatApo btnSuppPsi" key={i}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                        <p>{nombre}</p>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="itemsmatApo btnSuppPsi" key={i}>
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
            );
        }

        return (
            <div className='matApo'>
                {
                     //e contiene {_id,type,nombre,path}
                    props.expedientes?.map((e, i) =>  {
                        const { _id, type, nombre, path } = e;
                        return (
                            <Link to={`/psicologo/doc/${_id}`} className='itemsmatApo btnSuppPsi'>
                                <div className="itemsmatApo btnSuppPsi" key={i}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    <p>{nombre}</p>
                                </div>
                            </Link>
                        )
                    })
                }
                {
                     //e contiene {_id,type,nombre,path}
                    props.expedientes?.map((e, i) => {
                        const { _id, type, nombre, path } = g;
                        return (
                            <Link to={`/psicologo/doc/${_id}`} className='itemsmatApo btnSuppPsi'>
                                <div className="itemsmatApo btnSuppPsi" key={i}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                        </svg>
                                    <p>{nombre}</p>
                                </div>
                            </Link>
                        )
                    })
                }

            </div>
        );
    };

    return (
        <div className='suppPsi'>
            <div className='headerSuppPsi'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className='size-6 svgsuppPsi btnSuppPsi' onClick={props.handleSuppInfo}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div className='suppPsiOp'>
                    <p className={activo ? 'inactiveOp' : 'activeOp'} onClick={handleClick}>
                        Resumenes y grabaciones
                    </p>
                    <p className={!activo ? 'inactiveOp' : 'activeOp'} onClick={handleClick}>
                        Material de apoyo
                    </p>
                </div>
            </div>
            <hr className={activo ? 'lineDown2' : 'lineDown'} />
            {menuRender(activo)}
            <div className='paginatorSuppPsi'>
                {paginador > 1
                    ? <button className='btnPaginator' onClick={movePaginator(false)}> anterior </button>
                    : null
                }
                <p className='textPaginator'>{paginador}</p>

                {paginador < maxPaginador
                    ? <button className='btnPaginator' onClick={movePaginator(true)}> siguiente </button>
                    : null
                }
            </div>
        </div>
    );
}