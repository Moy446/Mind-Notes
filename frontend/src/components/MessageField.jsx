import React from 'react'
import './MessageField.css'

export default function MessageField(){

    const handleClick = () => {
        alert("Wiwiwiwiwi");
    };

    return (
            <div className='message-field'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" className='img-message' onClick={handleClick}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <input type="text" id="message" name="message" required minlength="1" maxlength="59" size="10" className='message-text' placeholder="Escribe un mensage"/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" className='img-message' onClick={handleClick}>
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
            </div>
    );
}