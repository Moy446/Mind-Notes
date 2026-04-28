import React, { useEffect, useState } from 'react'
import { Pressable, Text, View, Alert, ScrollView } from 'react-native'
import * as Haptics from 'expo-haptics'
import { horarioStyle } from '@/styles/perfil/horarioStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'
import SwitchHorario from './SwitchHorario';
import TimeRangePicker from '../popup/timePicker';
import HorarioItem from './HorarioItem';
import { obtenerHorario, actualizarHorario } from '@/core/actions/perfil/perfil.actions'

interface Props {
    //Metodos
    onClose: () => void;
    userId: string;
}

const HorarioPopUp = ({ onClose, userId }: Props,) => {

    const [dom, setDom] = useState({ activo: false, inicio: '', fin: '' });
    const [lun, setLun] = useState({ activo: false, inicio: '', fin: '' });
    const [mar, setMar] = useState({ activo: false, inicio: '', fin: '' });
    const [mie, setMie] = useState({ activo: false, inicio: '', fin: '' });
    const [jue, setJue] = useState({ activo: false, inicio: '', fin: '' });
    const [vie, setVie] = useState({ activo: false, inicio: '', fin: '' });
    const [sab, setSab] = useState({ activo: false, inicio: '', fin: '' });
    const [loading, setLoading] = useState(true);

    const handleGuardarHorario = async (horario) => {
        try {
            const response = await actualizarHorario(userId, horario);

            if (response?.success) {
                // Alert en React Native
                Alert.alert("Éxito", "Horario guardado correctamente");
            } else {
                Alert.alert("Error", response?.message || "No se pudo guardar");
            }

        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el horario");
        }
    };

    useEffect(() => {
        const fetchHorario = async () => {
            if (!userId) { setLoading(false); return; }
            try {
                const data = await obtenerHorario(userId);
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
    }, [userId]);

    return (
        <View style={horarioStyle.container}>
            <View style={horarioStyle.header}>
                <Pressable onPress={onClose} style={horarioStyle.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={Colors.principal} />
                </Pressable>
                <Text style={horarioStyle.title}>Horario</Text>
            </View>
            <ScrollView style={horarioStyle.daysContainer} contentContainerStyle={{ justifyContent: 'space-evenly',gap: 15 }}>

                <HorarioItem day="Dom" valor={dom} onCambio={setDom} />
                <HorarioItem day="Lun" valor={lun} onCambio={setLun} />
                <HorarioItem day="Mar" valor={mar} onCambio={setMar} />
                <HorarioItem day="Mie" valor={mie} onCambio={setMie} />
                <HorarioItem day="Jue" valor={jue} onCambio={setJue} />
                <HorarioItem day="Vie" valor={vie} onCambio={setVie} />
                <HorarioItem day="Sab" valor={sab} onCambio={setSab} />

                <Pressable style={horarioStyle.guardarBtn} onPress={() => handleGuardarHorario({ dom, lun, mar, mie, jue, vie, sab })}>
                    <Text style={horarioStyle.textGuardar}>Guardar</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default HorarioPopUp