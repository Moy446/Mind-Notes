import { View, Text, Pressable } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics'
import { disclaimerPopupStyle } from '@/styles/popup/disclaimer.popUpStyle'
import { router } from 'expo-router'


interface Props {
  onPress: () => void;
}

const DisclaimerPopup = ({ onPress }: Props) => {
  return (
    <View>
      <View style={disclaimerPopupStyle.titleContainer}>
        <Text style={disclaimerPopupStyle.titleText}>Disclaimer</Text>
      </View>
      <View style={disclaimerPopupStyle.bodyContainer}>
        <Text style={disclaimerPopupStyle.bodyText}>
          Esta aplicacaion es una herramienta de apoyo para el psicologo para ayudar a mantener la calidad de la informacion durante la sesion psicologica. 
          Cualquier duda o aclaracion no dude en consultarnos y consultar nuestro{' '}
          <Text
            style={{ fontSize: 12, fontFamily: 'SairaMedium', color: 'blue' }}
            onPress={() => router.push('/auth/register/privacidad/avisoPrivacidad')}
          >
            aviso de privacidad
          </Text>
          {' '}y los{' '} 
          <Text
            style={{ fontSize: 12, fontFamily: 'SairaMedium', color: 'blue' }}
            onPress={() => router.push('/auth/register/privacidad/terminosYCondiciones')}
          >
            términos y condiciones
          </Text>
          {' '}de esta aplicacion
        </Text>
        <Pressable style={{...disclaimerPopupStyle.button }} onPress={() =>{
          Haptics.selectionAsync()
          onPress()
          }}>
          <Text style={disclaimerPopupStyle.buttonText}>Aceptar</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default DisclaimerPopup