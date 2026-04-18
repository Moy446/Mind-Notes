import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { horarioStyle } from '@/styles/perfil/horarioStyle'
import { Colors } from '@/constants/theme'
import SwitchHorario from './SwitchHorario';
import TimeRangePicker from '../popup/timePicker';


const HorarioItem = ({ day, valor, onCambio }) => {

    const handleSwitchChange = (nuevoValor) => {
        onCambio({
            activo: nuevoValor,
            inicio: nuevoValor ? valor.inicio : '',
            fin: nuevoValor ? valor.fin : ''
        });
    };

    const handleTimeChange = (start, end ) => {
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