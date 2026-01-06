import React from 'react'
import './SuppPsi.css'

export default function SuppPa(){

    return (
        <div className='suppPsi'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6" className='svgsuppPsi btnSuppPsi'>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <div className='suppPsiOp'>
                <p className='activeOp'>
                    Material de apoyo
                </p>
            </div>
            <hr className="unique"/>
            <div className='matApo'>
                    <img src="src/images/testimg.png" className='itemsmatApo btnSuppPsi'/>
                    <img src="src/images/testimg.png" className='itemsmatApo btnSuppPsi'/>
                    <img src="src/images/testimg.png" className='itemsmatApo btnSuppPsi'/>
                    <img src="src/images/testimg.png" className='itemsmatApo btnSuppPsi'/>
                </div>
        </div>
    );
}