import React, { useState, useEffect, useCallback, useContext } from 'react';
import './ChatSelector.css'
import SearchBar from './SearchBar';
import AddBtn from './AddBtn';
import ChatBox from './ChatBox';
import AddBtnsMenu from './AddBtnsMenu';
import { obtenerPacientesVinculados } from '../services/vinculacionService';
import { obtenerPsicologosVinculados } from '../services/vinculacionService';
import { AuthContext } from '../context/AuthContext';


export default function ChatSelector(props){

    const { user } = useContext(AuthContext); // Obtén el usuario del contexto
    const [selectedId, setSelectedId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            const userRole = user?.role;
            const userId = user?.id;
            if (!userRole || !userId) {
                setContacts([]);
                return;
            }

            let data = [];
            if (userRole === 'psicologo') {
                data = await obtenerPacientesVinculados(userId);
            } else if (userRole === 'paciente') {
                data = await obtenerPsicologosVinculados(userId);
            }

            // Algunos endpoints pueden devolver {data: []} o [] directo
            const parsed = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            setContacts(parsed);
        } catch (error) {
            console.error('Error al obtener contactos vinculados:', error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadContacts();
    }, [loadContacts, props.refreshKey]);

    const handleSelect = (id) => {
        setSelectedId(id);
        props.onSelectChat(id);
    };

    return (
        <div className='chatselec'>
            <div className='wiwiwiCS'>
                <p className='textCS'>MindNotes</p>
                <SearchBar/>
                <div className='chatboxes'>
                    {loading && <span className='text-chatbox-message'>Cargando...</span>}
                    {!loading && contacts.length === 0 && (
                        <span className='text-chatbox-message'>Sin vinculaciones aún</span>
                    )}
                    {!loading && contacts.map((contact, idx) => {
                        const contactId = contact.idPaciente || contact.idPsicologo || contact._id || contact.id || idx;
                        const displayName = contact.nombrePaciente || contact.nombrePsicologo || contact.nombre || 'Contacto';
                        const lastMsg = contact.ultimoMensaje || contact.ultimoMensajeTexto || '';
                        return (
                            <ChatBox
                                key={contactId}
                                img={contact.fotoPerfilPaciente || contact.fotoPerfilPsicologo || '/src/images/pimg1.png'} //esto genera pedos pq siempre lee la foto del paciente
                                name={displayName}
                                message={lastMsg}
                                isSelected={selectedId === contactId}
                                onSelect={() => handleSelect(contactId)}
                            />
                        );
                    })}
                </div>
            </div>
            <div className='addDivCS'>
                <AddBtnsMenu qrOpen = {props.qrOpen} handleOpen = {props.handleOpen} uidOpen = {props.uidOpen} handleOpenUID = {props.handleOpenUID}/>
            </div>
        </div>
    );
}