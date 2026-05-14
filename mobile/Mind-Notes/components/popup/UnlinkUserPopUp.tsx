import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { deleteAccountPopUpStyle } from '@/styles/popup/perfil.deleteAccountpopUpStyle';
import * as Haptics from 'expo-haptics'

interface Props {
  //Metodos
  onClose: () => void;
  onAccept: () => void;
}


const UnlinkUserPopUp = ({ onClose, onAccept }: Props) => {
  return (
    <View style={deleteAccountPopUpStyle.container}>
      <Text style={deleteAccountPopUpStyle.warningText}>¿Esta seguro de desvincular esta cuenta?</Text>
      <View style={deleteAccountPopUpStyle.btnsContainer}>
        <Pressable style={deleteAccountPopUpStyle.acceptBtn} onPress={() => {     
          Haptics.selectionAsync()         
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

export default UnlinkUserPopUp