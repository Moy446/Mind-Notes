import React, { useState } from 'react';
import './MessageField.css'

const MessageField = (props) => { // CAMBIO: Recibir props completo
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() && props.onSendMessage) { // NUEVO: Verificar que existe la función
            props.onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClick = () => {
        alert("Wiwiwiwiwi");
    };

    return (
        <div className='message-field' style={{ 
            padding: '15px', 
            borderTop: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            gap: '10px'
        }}>
            <input
                type="text"
                id="message"
                name="message"
                required
                minLength="1"
                maxLength="59"
                size="10"
                className='message-text'
                placeholder="Escribe un mensaje..."
                style={{
                    flex: 1,
                    padding: '10px 15px',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    outline: 'none',
                    fontSize: '14px'
                }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button 
                onClick={handleSend}
                disabled={!message.trim()}
                className='send-button'
                style={{
                    padding: '10px 25px',
                    backgroundColor: !message.trim() ? '#ccc' : '#25d366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: !message.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}
            >
                Enviar
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='img-message' onClick={props.handleOpen}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='img-message' onClick={handleClick}>
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
        </div>
    );
};

export default MessageField;