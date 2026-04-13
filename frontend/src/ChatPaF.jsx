import React from 'react'
import { useState, useCallback, useEffect, useContext } from 'react';
import './Chat.css'
import NameBar from './components/NameBar';
import ChatSelector from './components/ChatSelector';
import MessageField from './components/MessageField';
import BubbleChat from './components/BubbleChat';
import ArchivoItem from './components/ArchivoItem';
import SupportMenu from './components/SupportMenu';
import InfoPsi from './components/InfoPsi';
import DeleteMenu from './components/DeleteMenu';
import SuppPa from './components/SuppPa';
import { useOutletContext, useParams } from 'react-router-dom';
import socket from './services/socketService';
import { AuthContext } from './context/AuthContext';
import { obtenerPsicologosVinculados } from './services/vinculacionService';
import { obtenerMensajes, obtenerInformacionChat } from './services/chatService';
import clienteAxios from './services/axios';
import { getImageUrl } from './utils/imageHelper';

export default function ChatPsiF(props){

    const {qrOpen , handleOpen, uidOpen, handleOpenUID, refreshKey} = useOutletContext();
    const { id } = useParams(); // NUEVO: Obtener el ID del chat de la URL
    const { user } = useContext(AuthContext); // Obtén el usuario del contexto
    

    // NUEVO: Estados para el chat en tiempo real
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const idUser = user?.id; // Usa el ID del contexto
    const [n, setN] = useState('Usuario no seleccionado');
    const [image, setImage] = useState('/src/images/pimg2.png');
    const [patientData, setPatientData] = useState({});
    const [archivos, setArchivos] = useState([]);
    const nombreMostrado = n !== 'Usuario no seleccionado'
        ? n
        : (patientData?.nombre || 'Usuario no seleccionado');

    const fetchSelectedName = useCallback(async () => {
    if(!selectedChat) {
        setN('Usuario no seleccionado');
        setImage('/src/images/pimg2.png');
        return;     
    }
    try {
        const data = await obtenerPsicologosVinculados(idUser);
        const lista = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        const psicologo = lista.find(p => p.idPsicologo === selectedChat);
        
        if (psicologo) {
            setN(psicologo.nombrePsicologo || psicologo?.nombre);
            
            // Usar helper centralizado para construir URL
            let fotoUrl = getImageUrl(psicologo.fotoPerfilPsicologo || '');
            if (!fotoUrl || fotoUrl === '/src/images/testimg.png') {
                fotoUrl = '/src/images/pimg2.png';
            }
            setImage(fotoUrl);
        } else {
            setN('Usuario no seleccionado');
            setImage('/src/images/pimg2.png');
        }
    } catch (error) {
        console.error('Error al obtener psicólogos:', error);
        setN('Usuario no seleccionado');
        setImage('/src/images/pimg2.png');
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

    const [infoOpen, setOpenInfo] = useState(false)
        
    const handleOpenInfo = useCallback(() => {
        setOpenInfo(!infoOpen)
    }, [infoOpen])

    const [delOpen, setOpenDel] = useState(false)
        
    const handleOpenDel = useCallback(() => {
        setOpenDel(!delOpen)
    }, [delOpen])

    const [suppInfoOpen, setOpenSuppInfo] = useState(false)
        
    const handleOpenInfoSupp = useCallback(() => {
        setOpenSuppInfo(!suppInfoOpen)
    }, [suppInfoOpen])

    // NUEVO: Efecto para conectar al chat cuando se selecciona un psicólogo
    useEffect(() => {
        if (selectedChat) {
        
        // Cargar mensajes existentes
        const loadMessages = async () => {
            try {
                const data = await obtenerMensajes(selectedChat, idUser);
                const mensajes = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                setMessages(mensajes);
            } catch (error) {
                setMessages([]);
            }
        };
        loadMessages();
        
        // Unirse al chat
        socket.emit('joinChat', { 
            idPsicologo: selectedChat,
            idPaciente: idUser 
        });

        // Escuchar mensajes nuevos
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }
    }, [selectedChat, idUser]);

    // Auto-scroll al final de los mensajes
    useEffect(() => {
        const bubblesContainer = document.querySelector('.bubbles');
        if (bubblesContainer) {
            setTimeout(() => {
                bubblesContainer.scrollTop = bubblesContainer.scrollHeight;
            }, 0);
        }
    }, [messages]);

    // NUEVO: Función para enviar mensajes
    const handleSendMessage = (message) => {
        if (message.trim() && selectedChat) {
            socket.emit('sendMessage', {
                idPsicologo: selectedChat,
                idPaciente: idUser,
                mensaje: message,
                remitente: 'paciente'
            });
        }
    };

    // NUEVO: Función para seleccionar un chat
    const handleSelectChat = (chatId) => {
        // Evitar volver a seleccionar el mismo chat
        if (chatId === selectedChat) {
            return;
        }
        setSelectedChat(chatId);
        setMessages([]); // Limpiar mensajes al cambiar de chat
        getInformationChat(chatId);
        setOpenInfo(false);
    };

    //cargar informacion en el sidebar del psicólogo
    const getInformationChat = async (chatId) => {
        try {
            const idPaciente = idUser;
            const response = await obtenerInformacionChat(chatId, idPaciente);
            setPatientData(response.patientData);
            setArchivos(response.patientData.materialAdjunto || []);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
            setPatientData({});
            setArchivos([]);
        }
    }

    const handleArchivoSubido = (nuevoArchivo) => {
        if (selectedChat) {
            getInformationChat(selectedChat);
        }
    };

    const handleArchivoEliminado = (archivoId) => {
        setArchivos(archivos.filter(a => a._id !== archivoId));
    };

    const handleOpenChatSelector = useCallback(() => {
        setSelectedChat(null);
        setOpenInfo(false);
    }, []);

    return(
        <div className='chatPsiF'>  
            <div className={`sidebar ${selectedChat ? 'hidden-movile' : ''}`}>
                <ChatSelector 
                    qrOpen={qrOpen} 
                    handleOpen={handleOpen} 
                    uidOpen={uidOpen} 
                    handleOpenUID={handleOpenUID}
                    onSelectChat={handleSelectChat} // NUEVO: Pasar función de selección
                    refreshKey={refreshKey}
                />
            </div>
            <div className={`nameVarCon ${!selectedChat ? 'hidden-movile' : ''}`}>
                {selectedChat && <NameBar img={image} name={n} open={infoOpen} handleOpen={handleOpenInfo} openChat = {handleOpenChatSelector} />}
                <div className='chatCon'>
                    <div className={`chatView ${infoOpen ? 'hidden-movile' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div className='bubbles' style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1 }}>
                            {/* NUEVO: Renderizar mensajes dinámicos */}
                            {!selectedChat ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    color: '#999',
                                    fontSize: '18px'
                                }}>
                                    Selecciona un psicólogo para comenzar a chatear
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    color: '#999',
                                    fontSize: '16px'
                                }}>
                                    No hay mensajes aún
                                </div>
                            ) : (
                                // Mensajes reales del socket
                                messages.map((msg, index) => (
                                    <BubbleChat 
                                        key={index}
                                        text={msg.mensaje}
                                        type={msg.remitente === 'paciente' ? 'send' : 'receive'}
                                    />
                                ))
                            )}
                        </div>
                        <div className='textBarChat'>
                            {selectedChat && <MessageField 
                                suppOpen={suppOpen} 
                                handleOpen={handleOpenSupp}
                                onSendMessage={handleSendMessage} // NUEVO: Pasar función de envío
                            />}
                            <div className={suppOpen ? 'showSuppMenu' : 'hideSuppMenu'}>
                                <SupportMenu 
                                    suppOpen={suppOpen} 
                                    handleOpen={handleOpenSupp}
                                    idPsicologo={selectedChat}
                                    idPaciente={idUser}
                                    onFileUploaded={handleArchivoSubido}
                                />
                            </div>     
                        </div>
                    </div>
                    <div className={infoOpen ? '' : 'hiddeInfo'}>
                        {suppInfoOpen 
                            ? <SuppPa 
                                suppInfO = {suppInfoOpen} 
                                handleSuppInfo = {handleOpenInfoSupp} 
                                materialAdjunto = {patientData.materialAdjunto} 
                                />
                            : <InfoPsi 
                                img = {image} 
                                name = {nombreMostrado} 
                                materialAdjunto = {patientData.materialAdjunto}
                                open = {infoOpen} handleOpen = {handleOpenInfo} 
                                del = {delOpen} handleDel = {handleOpenDel} 
                                suppInfO = {suppInfoOpen} handleSuppInfo = {handleOpenInfoSupp}
                                />
                        }
                    </div>
                    <div className={delOpen ? 'showDelMenu' : 'hideSuppMenu'}>
                        <DeleteMenu title = {`¿Esta seguro de eliminar al paciente ${nombreMostrado}? `} subtitle = "Todos los datos se perderan" del = {delOpen} handleDel = {handleOpenDel}/>
                    </div>
                </div>
            </div>
        </div>
    );
}