import React from 'react'
import './SearchBar.css'

export default function SearchBar(){

    const handleClick = () => {
        alert("Wiwiwiwiwi");
    };

    return (
            <div className='div-search'>
                <input type="text" id="message" name="message" required minlength="1" maxlength="59" size="10" className='searchbar-text' placeholder="Buscar psicologo"/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" className='img-searchbar' onClick={handleClick}>
                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                </svg>
            </div>
    );
}