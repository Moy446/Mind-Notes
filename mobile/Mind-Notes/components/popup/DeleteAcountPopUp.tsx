import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import CustomSelector from './CustomSelector'
import DatePicker from './DatePicker'
import TimeRangePicker from './timePicker'
import { deleteAccountPopUpStyle } from '@/styles/popup/perfil.deleteAccountpopUpStyle'
import { Colors } from '@/constants/theme'


interface Props {
    //Metodos
    onClose: () => void;
    onAccept: () => void;

}

const DeliteAcountPopUp = ({ onAccept, onClose }: Props) => {

    return (
        <View style={deleteAccountPopUpStyle.container}>
            <Text style={deleteAccountPopUpStyle.warningText}>¿Esta seguro de eliminar su cuenta?</Text>
            <Text>Todos los datos se perderan y se cancelara la suscripción</Text>
            <View style={deleteAccountPopUpStyle.btnsContainer}>
                <Pressable style={deleteAccountPopUpStyle.acceptBtn} onPress={() => {
                    
                    onAccept()
                }}>
                    <Text style={deleteAccountPopUpStyle.acceptText}>Aceptar</Text>
                </Pressable>
                <Pressable style={deleteAccountPopUpStyle.cancelBtn} onPress={() => {
                    Haptics.selectionAsync()
                    onClose()
                }}>
                    <Text style={deleteAccountPopUpStyle.cancelText}>Cancelar</Text>
                </Pressable>
            </View>

        </View>
    )
}

export default DeliteAcountPopUp