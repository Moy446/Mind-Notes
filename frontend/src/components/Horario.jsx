import React, { useEffect, useState } from 'react'
import './Horario.css'
import HorarioItem from './HorarioItem';
import { obtenerHorario } from '../services/usuarioService';

export default function Horario(props) {
    const [dom, setDom] = useState({ activo: false, inicio: '', fin: '' });
    const [lun, setLun] = useState({ activo: false, inicio: '', fin: '' });
    const [mar, setMar] = useState({ activo: false, inicio: '', fin: '' });
    const [mie, setMie] = useState({ activo: false, inicio: '', fin: '' });
    const [jue, setJue] = useState({ activo: false, inicio: '', fin: '' });
    const [vie, setVie] = useState({ activo: false, inicio: '', fin: '' });
    const [sab, setSab] = useState({ activo: false, inicio: '', fin: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHorario = async () => {
            if (!props.userId) { setLoading(false); return; }
            try {
                const data = await obtenerHorario(props.userId);
                const horarioRaw = data?.data?.horario;
                
                if (horarioRaw) {
                    const h = typeof horarioRaw === 'string' ? JSON.parse(horarioRaw) : horarioRaw;
                    
                    // Normalizar: Si viene booleano, convertir a objeto
                    const normalizar = (valor) => {
                        if (typeof valor === 'boolean') {
                            return { activo: valor, inicio: '', fin: '' };
                        }
                        if (valor && typeof valor === 'object') {
                            return { 
                                activo: valor.activo || false, 
                                inicio: valor.inicio || '', 
                                fin: valor.fin || '' 
                            };
                        }
                        return { activo: false, inicio: '', fin: '' };
                    };
    
                    setDom(normalizar(h.dom));
                    setLun(normalizar(h.lun));
                    setMar(normalizar(h.mar));
                    setMie(normalizar(h.mie));
                    setJue(normalizar(h.jue));
                    setVie(normalizar(h.vie));
                    setSab(normalizar(h.sab));
                }
            } catch (error) {
                console.error('Error al obtener el horario:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHorario();
    }, [props.userId]);

    const handleGuardar = () => {
        props.onGuardar({ dom, lun, mar, mie, jue, vie, sab });
    };
    

    if (loading) return <div className="horario"><div className='titleHorario'>Cargando horario...</div></div>;

    return (
        <div className="horario">
            <div className='titleHorario'>Horario</div>
            <HorarioItem day="Dom" valor={dom} onCambio={setDom} />
            <HorarioItem day="Lun" valor={lun} onCambio={setLun} />
            <HorarioItem day="Mar" valor={mar} onCambio={setMar} />
            <HorarioItem day="Mie" valor={mie} onCambio={setMie} />
            <HorarioItem day="Jue" valor={jue} onCambio={setJue} />
            <HorarioItem day="Vie" valor={vie} onCambio={setVie} />
            <HorarioItem day="Sab" valor={sab} onCambio={setSab} />
            <button className="btnGuardarHorario" onClick={handleGuardar}>Guardar horario</button>
        </div>
    );
}