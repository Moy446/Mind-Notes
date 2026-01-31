import React from 'react'
import { useState, useCallback, useEffect, useContext } from 'react';
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
import socket from './services/socketService'; // NUEVO: Import del socket
import { AuthContext } from './context/AuthContext';
import { obtenerPacientesVinculados , obtenerMensajes } from './services/vinculacionService';

export default function ChatPsiF(props){

    const {qrOpen , handleOpen, uidOpen, handleOpenUID, refreshKey} = useOutletContext();
    const { id } = useParams(); // NUEVO: Obtener el ID del chat de la URL
    const { user } = useContext(AuthContext); // Obtén el usuario del contexto

    // NUEVO: Estados para el chat en tiempo real
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(id || null);
    const idUser = user?.id; // Usa el ID del contexto
    const [n, setN] = useState('Paciente');

    const fetchSelectedName = useCallback(async () => {
        if(!selectedChat) {
            setN('Paciente');
            return;     
        }
        try {
            const data = await obtenerPacientesVinculados(idUser);
            const lista = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            const paciente = lista.find(p => p.idPaciente === selectedChat);
            setN(paciente ? paciente.nombrePaciente ||  paciente?.nombre : 'Paciente');
        } catch (error) {
            console.error('Error al obtener el nombre del paciente:', error);
            setN('Paciente');
        }
    }, [idUser, selectedChat]);


    useEffect(() => {
        fetchSelectedName();
}, [fetchSelectedName]);

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
        
        // Cargar mensajes existentes
        const loadMessages = async () => {
            try {
                const data = await obtenerMensajes(idUser, selectedChat);
                const mensajes = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                setMessages(mensajes);
            } catch (error) {
                console.error('Error al cargar mensajes:', error);
                setMessages([]);
            }
        };
        loadMessages();
        
        // Unirse al chat
        socket.emit('joinChat', { 
            idPsicologo: idUser, 
            idPaciente: selectedChat 
        });

        // Escuchar mensajes nuevos
        socket.on('receiveMessage', (newMessage) => {
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
            socket.emit('sendMessage', {
                idPsicologo: idUser,
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
                refreshKey={refreshKey}
            />
            <div className='nameVarCon'>
                <NameBar img = "/src/images/pimg1.png" name ={n} open = {infoOpen} handleOpen={handleOpenInfo}/>
                <div className='chatCon'>
                    <div className='chatView'>
                        <div className='bubbles'>
                            {/* NUEVO: Renderizar mensajes dinámicos */}
                            {messages.length === 0 ? (
                                // Mensajes de prueba existentes (se mostrarán si no hay mensajes reales)
                                <>
                                    <BubbleChat text = "Manda un mensaje para comenzar el chat" type = "send"/>
                                    
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