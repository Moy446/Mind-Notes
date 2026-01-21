import React from 'react'
import { useState, useCallback, useEffect } from 'react';
import './Chat.css'
import NameBar from './components/NameBar';
import ChatSelector from './components/ChatSelector';
import MessageField from './components/MessageField';
import BubbleChat from './components/BubbleChat';
import SupportMenu from './components/SupportMenu';
import InfoPsi from './components/InfoPsi';
import DeleteMenu from './components/DeleteMenu';
import SuppPsi from './components/SuppPsi';
import { useOutletContext, useParams } from 'react-router-dom';
import socket from './services/socket'; // NUEVO: Import del socket

export default function ChatPsiF(props){

    const {qrOpen , handleOpen, uidOpen, handleOpenUID} = useOutletContext();
    const { id } = useParams(); // NUEVO: Obtener el ID del chat de la URL

    // NUEVO: Estados para el chat en tiempo real
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(id || null);
    const idPsicologo = 'psicologo1'; // Temporal, luego vendrá del login

    // Estados existentes
    const [suppOpen, setOpenSupp] = useState(false)
        
    const handleOpenSupp = useCallback(() => {
        setOpenSupp(!suppOpen)
    }, [suppOpen])

    const [infoOpen, setOpneInfo] = useState(false)
        
    const handleOpenInfo = useCallback(() => {
        setOpneInfo(!infoOpen)
    }, [infoOpen])

    const [delOpen, setOpenDel] = useState(false)
        
    const handleOpenDel = useCallback(() => {
        setOpenDel(!delOpen)
    }, [delOpen])

    const [suppInfoOpen, setOpenSuppInfo] = useState(false)
        
    const handleOpenInfoSupp = useCallback(() => {
        setOpenSuppInfo(!suppInfoOpen)
    }, [suppInfoOpen])

    // NUEVO: Efecto para conectar al chat cuando se selecciona un paciente
    useEffect(() => {
        if (selectedChat) {
            console.log('🔌 Uniéndose al chat:', selectedChat);
            
            // Unirse al chat
            socket.emit('joinChat', { 
                idPsicologo, 
                idPaciente: selectedChat 
            });

            // Escuchar mensajes nuevos
            socket.on('receiveMessage', (newMessage) => {
                console.log('📨 Mensaje recibido:', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [selectedChat]);

    // NUEVO: Función para enviar mensajes
    const handleSendMessage = (message) => {
        if (message.trim() && selectedChat) {
            console.log('📤 Enviando mensaje:', message);
            socket.emit('sendMessage', {
                idPsicologo,
                idPaciente: selectedChat,
                mensaje: message,
                remitente: 'psicologo'
            });
        }
    };

    // NUEVO: Función para seleccionar un chat
    const handleSelectChat = (chatId) => {
        setSelectedChat(chatId);
        setMessages([]); // Limpiar mensajes al cambiar de chat
        console.log('💬 Chat seleccionado:', chatId);
    };

    return(
        <div className='chatPsiF'>
            <ChatSelector 
                qrOpen={qrOpen} 
                handleOpen={handleOpen} 
                uidOpen={uidOpen} 
                handleOpenUID={handleOpenUID}
                onSelectChat={handleSelectChat} // NUEVO: Pasar función de selección
            />
            <div className='nameVarCon'>
                <NameBar img = "/src/images/pimg1.png" name = "Teisel" open = {infoOpen} handleOpen={handleOpenInfo}/>
                <div className='chatCon'>
                    <div className='chatView'>
                        <div className='bubbles'>
                            {/* NUEVO: Renderizar mensajes dinámicos */}
                            {messages.length === 0 ? (
                                // Mensajes de prueba existentes (se mostrarán si no hay mensajes reales)
                                <>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                    <BubbleChat text = "Claro que si, con mucho gusto lo agendo, que día?" type = "send"/>
                                    <BubbleChat text = "Hola, agendeme por favor"/>
                                </>
                            ) : (
                                // Mensajes reales del socket
                                messages.map((msg, index) => (
                                    <BubbleChat 
                                        key={index}
                                        text={msg.mensaje}
                                        type={msg.remitente === 'psicologo' ? 'send' : ''}
                                    />
                                ))
                            )}
                        </div>
                        <div className='textBarChat'>
                            <MessageField 
                                suppOpen={suppOpen} 
                                handleOpen={handleOpenSupp}
                                onSendMessage={handleSendMessage} // NUEVO: Pasar función de envío
                            />
                            <div className={suppOpen ? 'showSuppMenu' : 'hideSuppMenu'}>
                                <SupportMenu suppOpen = {suppOpen} handleOpen = {handleOpenSupp}/>
                            </div>     
                        </div>
                    </div>
                    <div className={infoOpen ? '' : 'hiddeInfo'}>
                        {suppInfoOpen 
                            ? <SuppPsi suppInfO = {suppInfoOpen} handleSuppInfo = {handleOpenInfoSupp}/>
                            : <InfoPsi img = "/src/images/pimg1.png" name = "Teisel" 
                                open = {infoOpen} handleOpen = {handleOpenInfo} 
                                del = {delOpen} handleDel = {handleOpenDel} 
                                suppInfO = {suppInfoOpen} handleSuppInfo = {handleOpenInfoSupp}
                                />
                        }
                    </div>
                    <div className={delOpen ? 'showDelMenu' : 'hideSuppMenu'}>
                        <DeleteMenu title = "¿Esta seguro de eliminar al paciente Teisel? " subtitle = "Todos los datos se perderan" del = {delOpen} handleDel = {handleOpenDel}/>
                    </div>
                </div>
            </div>
        </div>
    );
}