import React, { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import './Error.css'

function Error(props) {

    return (
        <div className='error'>
            <div className='textTitleError'>
                ERROR {props.number}
            </div>
            <div className='textDescriptionError'>
                {props.desc}
            </div>
        </div>  
    );
}

export default Error