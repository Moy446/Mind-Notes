import React, { use } from 'react'
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
import clienteAxios from './services/axios';
import { tr } from 'framer-motion/client';

export default function ChatPsiF(props){

    const { qrOpen, handleOpen, uidOpen, handleOpenUID, refreshKey} = useOutletContext();
    const { id } = useParams(); // NUEVO: Obtener el ID del chat de la URL
    const { user } = useContext(AuthContext); // Obtén el usuario del contexto

    // NUEVO: Estados para el chat en tiempo real
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const idUser = user?.id; // Usa el ID del contexto
    const [n, setN] = useState('Usuario no seleccionado');
    const [image, setImage] = useState('/src/images/pimg2.png');
    const [patientData, setPatientData] = useState({});

    const fetchSelectedName = useCallback(async () => {
        if (!selectedChat) {
            setN('Usuario no seleccionado');
            return;
        }
        try {
            const data = await obtenerPacientesVinculados(idUser);
            const lista = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            const paciente = lista.find(p => p.idPaciente === selectedChat);
            setN(paciente ? paciente.nombrePaciente || paciente?.nombre : 'Usuario no seleccionado');
            setImage(paciente ? paciente.fotoPerfilPaciente : '/src/images/pimg2.png');
        } catch (error) {
            setN('Usuario no seleccionado');
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

    // NUEVO: Efecto para conectar al chat cuando se selecciona un paciente
    useEffect(() => {
        if (selectedChat) {

            // Cargar mensajes existentes
            const loadMessages = async () => {
                try {
                    const data = await obtenerMensajes(idUser, selectedChat);
                    const mensajes = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                    setMessages(mensajes);
                } catch (error) {
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
                console.log('📨 Nuevo mensaje recibido:', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [selectedChat, idUser]);

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
        // Evitar volver a seleccionar el mismo chat
        if (chatId === selectedChat) {
            return;
        }
        setSelectedChat(chatId);
        setMessages([]); // Limpiar mensajes al cambiar de chat
        getInformationChat(chatId);
        console.log('💬 Chat seleccionado:', chatId);
    };

    //cargar informacion en el sidebar del paciente
    const getInformationChat = async (pacienteId) => {
        try {
            const idPsicologo = id;
            const response = await clienteAxios.get(`/chat/info/${idPsicologo}/${pacienteId}`);
            setPatientData(response.data.patientData);
        } catch (error) {
            console.error('Error al obtener la información del chat:', error);
            setPatientData({});
        }
    }

    const handleOpenChatSelector = useCallback(() => {
        setSelectedChat(null);
        setOpenInfo(false);
    }, []);

    return (
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
                    <div className={`chatView ${infoOpen ? 'hidden-movile' : ''}`}>
                        <div className='bubbles'>
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
                                        type={msg.remitente === 'psicologo' ? 'send' : 'receive'}
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
                                <SupportMenu suppOpen={suppOpen} handleOpen={handleOpenSupp} />
                            </div>
                        </div>
                    </div>
                    <div className={infoOpen ? '' : 'hiddeInfo'}>
                        {suppInfoOpen
                            ? <SuppPsi
                                suppInfO={suppInfoOpen}
                                handleSuppInfo={handleOpenInfoSupp}
                                expedientes={patientData.expedientes}
                                materialAdjunto={patientData.materialAdjunto}
                                grabaciones={patientData.grabaciones}
                            />
                            : <InfoPsi
                                img={image}
                                name={patientData.nombre}
                                materialAdjunto={patientData.materialAdjunto}
                                open={infoOpen} handleOpen={handleOpenInfo}
                                del={delOpen} handleDel={handleOpenDel}
                                suppInfO={suppInfoOpen} handleSuppInfo={handleOpenInfoSupp}
                            />
                        }
                    </div>
                    <div className={delOpen ? 'showDelMenu' : 'hideSuppMenu'}>
                        <DeleteMenu title={`¿Esta seguro de eliminar al paciente ${patientData.nombre}? `} subtitle="Todos los datos se perderan" del={delOpen} handleDel={handleOpenDel} />
                    </div>
                </div>
            </div>
        </div>
    );
}