import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import './ChatSelector.css'
import SearchBar from './SearchBar';
import AddBtn from './AddBtn';
import ChatBox from './ChatBox';
import AddBtnsMenu from './AddBtnsMenu';
import { obtenerPacientesVinculados } from '../services/vinculacionService';
import { obtenerPsicologosVinculados } from '../services/vinculacionService';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';
import socket from '../services/socketService';
import userDefault from './images/userDefault.png'


export default function ChatSelector(props) {

    const { user } = useContext(AuthContext); // Obtén el usuario del contexto
    const [selectedId, setSelectedId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasLoadedOnceRef = useRef(false);
    const [searchTerm, setSearchTerm] = useState('');

    const normalizeId = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            if (typeof value.$oid === 'string') return value.$oid;
            if (typeof value.toString === 'function') {
                const parsed = value.toString();
                if (parsed && parsed !== '[object Object]') return parsed;
            }
        }
        return null;
    };

    const normalizeContact = (contact) => {
        if (!contact || typeof contact !== 'object') return null;

        return {
            ...contact,
            idPaciente: normalizeId(contact.idPaciente),
            idPsicologo: normalizeId(contact.idPsicologo),
            _id: normalizeId(contact._id),
            id: normalizeId(contact.id),
        };
    };

    const loadContacts = useCallback(async ({ silent = false } = {}) => {
        try {
            const shouldShowLoader = !silent && !hasLoadedOnceRef.current;
            if (shouldShowLoader) {
                setLoading(true);
            }

            const userRole = user?.role;
            const userId = user?.id || user?.idUsuario;
            if (!userRole || !userId) {
                setContacts([]);
                hasLoadedOnceRef.current = true;
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
            const normalizedContacts = parsed.map(normalizeContact).filter(Boolean);
            setContacts(normalizedContacts);
            hasLoadedOnceRef.current = true;
        } catch (error) {
            console.error('Error al obtener contactos vinculados:', error);
            setContacts([]);
            hasLoadedOnceRef.current = true;
        } finally {
            if (!silent && !hasLoadedOnceRef.current) {
                setLoading(false);
            } else if (!silent) {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        loadContacts();
    }, [loadContacts, props.refreshKey]);

    useEffect(() => {
        const onFocus = () => loadContacts({ silent: true });
        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, [loadContacts]);

    useEffect(() => {
        const userId = user?.id || user?.idUsuario;
        if (!userId) return;

        socket.emit('joinUserRoom', { userId });

        const handleChatListUpdate = () => {
            loadContacts({ silent: true });
        };

        socket.on('updateChatList', handleChatListUpdate);

        return () => {
            socket.off('updateChatList', handleChatListUpdate);
        };
    }, [loadContacts, user]);

    const handleSelect = (id) => {
        setSelectedId(id);
        props.onSelectChat(id);
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    const parseDateToMs = (value) => {
        if (!value) return 0;
        const ms = new Date(value).getTime();
        return Number.isNaN(ms) ? 0 : ms;
    };

    const objectIdToMs = (value) => {
        const id = typeof value === 'string' ? value : '';
        const hex = id.slice(0, 8);
        if (!/^[0-9a-fA-F]{8}$/.test(hex)) return 0;
        return parseInt(hex, 16) * 1000;
    };

    const getLastActivityMs = (contact) => {
        const candidates = [
            contact?.ultimoMensajeFecha,
            contact?.fechaUltimoMensaje,
            contact?.updatedAt,
            contact?.ultimoMensaje?.timestamp,
            contact?.ultimoMensaje?.createdAt,
            contact?.ultimoMensaje?.fecha,
            contact?.ultimoMensajeTimestamp,
            contact?.timestamp
        ];

        for (const candidate of candidates) {
            const parsed = parseDateToMs(candidate);
            if (parsed > 0) return parsed;
        }

        return objectIdToMs(String(contact?.idVinculacion || contact?._id || ''));
    };

    // Filtrar contactos basándose en el término de búsqueda
    const filteredContacts = contacts.filter((contact) => {
        if (!contact) return false;
        const userRole = user?.role;
        const displayName = userRole === 'psicologo'
            ? (contact.nombrePaciente || contact.nombre || '')
            : (contact.nombrePsicologo || contact.nombre || '');
        return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedContacts = [...filteredContacts].sort(
        (a, b) => getLastActivityMs(b) - getLastActivityMs(a)
    );

    const userRole = user?.role;
    const searchPlaceholder = userRole === 'psicologo' ? 'Buscar paciente' : 'Buscar psicólogo';

    return (
        <div className='chatselec'>
            <div className='wiwiwiCS'>
                <p className='textCS'>MindNotes</p>
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                />
                <div className='chatboxes'>
                    {loading && <span className='text-chatbox-message'>Cargando...</span>}
                    {!loading && contacts.length === 0 && (
                        <span className='text-chatbox-message'>Sin vinculaciones aún</span>
                    )}
                    {!loading && filteredContacts.length === 0 && contacts.length > 0 && (
                        <span className='text-chatbox-message'>No se encontraron resultados</span>
                    )}
                    {!loading && sortedContacts.map((contact, idx) => {
                        const userRole = user?.role;
                        const contactId = userRole === 'psicologo' ? (contact.idPaciente || contact._id || contact.id || idx) : (contact.idPsicologo || contact._id || contact.id || idx);
                        const displayName = userRole === 'psicologo' ? (contact.nombrePaciente || contact.nombre || 'Contacto') : (contact.nombrePsicologo || contact.nombre || 'Contacto');
                        const lastMsg = typeof contact.ultimoMensaje === 'object'
                            ? (contact.ultimoMensaje?.mensaje || '')
                            : (contact.ultimoMensaje || contact.ultimoMensajeTexto || '');
                        const imagenFinal = userRole === 'psicologo'
                            ? getImageUrl(contact.fotoPerfilPaciente.includes('userDefault') ? userDefault : contact.fotoPerfilPaciente, userDefault)
                            : getImageUrl(contact.fotoPerfilPsicologo.includes('userDefault') ? userDefault : contact.fotoPerfilPsicologo, userDefault);
                            return (
                                <ChatBox
                                    key={contactId}
                                    img={imagenFinal}
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
                <AddBtnsMenu qrOpen={props.qrOpen} handleOpen={props.handleOpen} uidOpen={props.uidOpen} handleOpenUID={props.handleOpenUID} />
            </div>
        </div>
    );
}