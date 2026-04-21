import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { horarioStyle } from '@/styles/perfil/horarioStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'
import SwitchHorario from './SwitchHorario';
import TimeRangePicker from '../popup/timePicker';

interface Props {
    //Metodos
    onClose: () => void;
}

const HorarioPopUp = ({ onClose }: Props) => {

    const [dias, setInfo] = useState([
        {
            id: 1,
            name: "Lunes",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 2,
            name: "Martes",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 3,
            name: "Miercoles",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 4,
            name: "Jueves",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 5,
            name: "Viernes",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 6,
            name: "Sabado",
            value: false,
            horaI: '',
            horaF: ''
        },
        {
            id: 7,
            name: "Domingo",
            value: false,
            horaI: '',
            horaF: ''
        },
    ])

    return (
        <View style={horarioStyle.container}>
            <View style={horarioStyle.header}>
                <Pressable onPress={onClose} style={horarioStyle.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={Colors.principal} />
                </Pressable>
                <Text style={horarioStyle.title}>Horario</Text>
            </View>
            <View style={horarioStyle.daysContainer}>
                {
                    dias.map(dia =>
                        <View key={dia.id}>
                            <View style={horarioStyle.dayContainer} >
                                <SwitchHorario temporal={dia.value} onChange={(val) => {
                                    setInfo(prev =>
                                        prev.map(d =>
                                            d.id === dia.id
                                                ? { ...d, value: val }
                                                : d
                                        )
                                    );
                                }} />
                                <Text style={horarioStyle.dayText}>{dia.name}</Text>
                            </View>
                             {
                                    dia.value && (
                                        <View style={horarioStyle.horas}>
                                            <TimeRangePicker
                                                start={dia.horaI}
                                                end={dia.horaF}
                                                onChange={(s, e) => {
                                                    setInfo(prev =>
                                                        prev.map(d =>
                                                            d.id === dia.id
                                                                ? { ...d, horaI: s, horaF: e }
                                                                : d
                                                        )
                                                    );
                                                }}
                                            />
                                        </View>
                                    )
                                }
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export default HorarioPopUp