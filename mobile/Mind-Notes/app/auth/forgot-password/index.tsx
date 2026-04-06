import React, { useState } from 'react'
import { View, Text, KeyboardAvoidingView, Alert } from 'react-native'
import BarTittle from '@/components/auth/BarTittle'
import { forgotPasswordStyle } from '@/styles/auth/forgotPasswordStyle'
import CustomButton from '@/components/auth/CustomButton'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import ThemedTextInput from '@/components/auth/ThemedTextInput'
import { recoverPassword } from '@/core/actions/auth/forgotPassword.action'

const ForgotPassowrdScreen = () => {

  const [email, setEmail] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const onForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }
    try {
      setIsPosting(true)
      const resp = await recoverPassword(email)
      Alert.alert('Éxito', 'Si el correo existe en nuestro sistema, recibirás un email con instrucciones para restablecer tu contraseña.');

    } catch (error) {
      Alert.alert('Error', 'Hubo un error al enviarle el correo de recuperación. Inténtalo de nuevo más tarde.');
    }finally{
      setIsPosting(false)
    }
  }

  return (
    <View style={forgotPasswordStyle.container}>
      <View style={forgotPasswordStyle.topContainer}>
            <Text style={forgotPasswordStyle.topTextTitle}>¡Hola, de nuevo!</Text>
            <Text style={forgotPasswordStyle.topTextDescription}>¿Ya tienes una cuenta?</Text>
            <CustomButton text='Iniciar sesión' size='md' onPress={() => router.push('/auth/login')} style={{marginBottom: 20, backgroundColor: Colors.principal}} />
        </View>
        <BarTittle title='Restablecer contraseña' align='left' textSize={26} backgroundColor={Colors.principal} />
        <KeyboardAvoidingView style={{marginTop: 30, alignItems: 'center'}}>
          <ThemedTextInput 
                icon='mail-outline'
                placeholder="Correo electrónico"
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={setEmail}
            />
            <CustomButton onPress={onForgotPassword} disabled={isPosting} text='Recuperar contraseña' size='lg' style={{marginBottom: 10, backgroundColor: Colors.principal}} />
        </KeyboardAvoidingView>
    </View>
  )
}

export default ForgotPassowrdScreen