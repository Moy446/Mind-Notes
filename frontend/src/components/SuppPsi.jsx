import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SuppPsi.css'

export default function SuppPsi(props) {


    const [paginador, setPaginador] = useState(1);
    const itemsPerPage = 20;
    const [activo, setActivo] = useState(false);

    const currentData = activo ? props.materialAdjunto || [] : [...(props.expedientes || []), ...(props.grabaciones || [])];
    const maxPaginador = Math.ceil(currentData.length / itemsPerPage);

    useEffect(() => {
        setPaginador(1);
    }, [activo]);

    const indexOfLastItem = paginador * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentItems);
    const handleClick = () => {
        setActivo(!activo);
    };

    const movePaginator = (next) => {
        if (next) {
            setPaginador(prev => Math.min(prev + 1, maxPaginador));
        } else {
            setPaginador(prev => Math.max(prev - 1, 1));
        }
    };
    const renderIcon = (type) => {
        if (["pdf", "docx", "doc", "txt"].includes(type)) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            );
        }

        if (["mp4", "mov", "avi"].includes(type)) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            );
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
        );
    };

    return (
        <div className='suppPsi'>
            <div className='headerSuppPsi'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth="1.5"
                    stroke="white" className='size-6 svgsuppPsi btnSuppPsi'
                    onClick={props.handleSuppInfo}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                <div className='suppPsiOp'>
                    <p className={!activo ? 'activeOp' : 'inactiveOp'} onClick={handleClick}>
                        Resumenes y grabaciones
                    </p>
                    <p className={activo ? 'activeOp' : 'inactiveOp'} onClick={handleClick}>
                        Material de apoyo
                    </p>
                </div>
            </div>

            <hr className={activo ? 'lineDown2' : 'lineDown'} />

            <div className='matApo'>
                {currentItems.map((item) => 
                (
                    <Link
                        key={item._id}
                        to={`/psicologo/doc/${props.idPaciente}/${item._id}`}
                        className='itemsmatApo btnSuppPsi'
                    >
                        {renderIcon(item.type)}
                        <p className='pMatApo'>{item.nombre}</p>
                    </Link>
                ))}
            </div>

            <div className='paginatorSuppPsi'>
                {paginador > 1 &&
                    <button className='btnPaginator'
                        onClick={() => movePaginator(false)}>
                        anterior
                    </button>
                }

                <p className='textPaginator'>
                    {paginador} / {maxPaginador || 1}
                </p>

                {paginador < maxPaginador &&
                    <button className='btnPaginator'
                        onClick={() => movePaginator(true)}>
                        siguiente
                    </button>
                }
            </div>
        </div>
    );
}