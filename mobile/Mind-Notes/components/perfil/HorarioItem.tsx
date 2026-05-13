import React, { useEffect, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { horarioStyle } from '@/styles/perfil/horarioStyle'
import { Colors } from '@/constants/theme'
import SwitchHorario from './SwitchHorario';
import TimeRangePicker from '../popup/timePicker';


const HorarioItem = ({ day, valor, onCambio }) => {

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };
    
    const isAfter = (t1: string, t2: string) => {
        return timeToMinutes(t1) > timeToMinutes(t2);
    };

    const handleSwitchChange = (nuevoValor) => {
        onCambio({
            activo: nuevoValor,
            inicio: nuevoValor ? valor.inicio : '',
            fin: nuevoValor ? valor.fin : ''
        });
    };

    const handleTimeChange = (start, end ) => {
        if (start && end && !isAfter(end, start)) {
            // Alert en React Native
            Alert.alert("Error", "La hora de fin debe ser posterior a la hora de inicio");
            return;
        }
        onCambio({
            ...valor,
            inicio: start,
            fin: end
        });
    };

    return (
        <View>
            <View style={horarioStyle.dayContainer} >
                <SwitchHorario temporal={valor.activo} onChange={handleSwitchChange} />
                <Text style={horarioStyle.dayText}>{day}</Text>
            </View>
            {
                valor.activo && (
                    <View style={horarioStyle.horas}>
                        <TimeRangePicker
                            start={valor.inicio}
                            end={valor.fin}
                            onChange={handleTimeChange}
                        />
                    </View>
                )
            }
        </View>
    )

}
export default HorarioItem