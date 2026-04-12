import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import CustomSelector from './CustomSelector'
import DatePicker from './DatePicker'
import TimeRangePicker from './timePicker'
import { calendarPopUpStyle } from '@/styles/popup/calendar.popUpStyle'
import { Colors } from '@/constants/theme'
import { formatedPatientList, infoCita } from '@/core/interfaces/Dates'


interface Props {
    //Atributos
    placeholder?: string
    patients?: formatedPatientList[]
    selectedCita?: infoCita;

    //Metodos
    onClose: () => void;
    onAccept: (user: infoCita) => void;

}

const CalendarPopUp = ({placeholder, patients, selectedCita, onAccept, onClose}: Props) => {

    const [selectedUser, setSelectedUser] = useState<infoCita>({
        idCita: selectedCita?.idCita || '',
        idUsuario: selectedCita?.idUsuario || '',
        nombre: selectedCita?.nombre || '',
        fechaCita: selectedCita?.fechaCita || '',
        horaInicio: selectedCita?.horaInicio || '',
        horaFin: selectedCita?.horaFin || ''
    });

    const [isValid, setIsValid] = useState(false);

    useEffect(() => { 
        const {idUsuario, nombre, fechaCita, horaInicio, horaFin} = selectedUser;
        const valid = !!(idUsuario && nombre && fechaCita && horaInicio && horaFin);
        setIsValid(valid);

}, [selectedUser]);
    

    return (
        <View>
            <CustomSelector 
                data={patients || []}
                value={selectedCita?.idUsuario}
                placeholder={placeholder || 'Selecciona el paciente'}
                onChange={(user) => setSelectedUser({...selectedUser, idUsuario: user.id, nombre: user.nombre})}
            />
            <DatePicker
                value={selectedUser.fechaCita}
                onChange={(newDate) => setSelectedUser({...selectedUser, fechaCita: newDate})}
            />
            <TimeRangePicker
                start={selectedUser.horaInicio}
                end={selectedUser.horaFin}
                onChange={(s, e) => {
                    setSelectedUser({...selectedUser, horaInicio: s, horaFin: e});
                }}
            />
            <View style={calendarPopUpStyle.btnContainer}>
                <Pressable style={{...calendarPopUpStyle.btn, backgroundColor: Colors.secondaryButton}} onPress={() => {
                    Haptics.selectionAsync()
                    onClose()
                }}>
                    <Text style={calendarPopUpStyle.btnText}>Cancelar</Text>
                </Pressable>
                <Pressable style={{...calendarPopUpStyle.btn, backgroundColor: Colors.primaryButton}} disabled={!isValid} onPress={() => {
                    Haptics.selectionAsync()
                    onAccept(selectedUser)
                }}>
                    <Text style={calendarPopUpStyle.btnText}>Aceptar</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default CalendarPopUp