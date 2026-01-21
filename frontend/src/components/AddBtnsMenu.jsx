import React, { useCallback } from 'react'
import { useState } from 'react';
import './AddBtnsMenu.css'
import AddBtn from './AddBtn';
import AddQr from './AddQr';

export default function AddBtnsMenu(props){

    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = useCallback(() => {
        setIsOpen(!isOpen)
    }, [isOpen])

    return(
        <div className='addMenu'>
            <div className={`frontbtn ${isOpen ? 'giraGira' : ''}`}>
                <AddBtn num = "1" isOpen = {isOpen} handleOpen={handleOpen}/>
            </div>
            <div className={isOpen ? 'btn1' : 'backBtn'}>
                <AddBtn num = "4" isOpen = {props.qrOpen} handleOpen = {props.handleOpen}/>
            </div>
            <div className={isOpen ? 'btn2' : 'backBtn'}>
                <AddBtn num = "3" isOpen = {props.uidOpen} handleOpen = {props.handleOpenUID}/>
            </div>       
        </div>
    );
}