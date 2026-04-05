import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { registerStyle } from '@/styles/auth/registerStyle'
import BarTittle from '@/components/auth/BarTittle'
import ThemedTextInput from '@/components/auth/ThemedTextInput'
import ThemedSwitch from '@/components/auth/ThemedSwitch'
import CustomButton from '@/components/auth/CustomButton'
import GoogleButton from '@/components/auth/GoogleButton'
import { router } from 'expo-router'

const RegisterScreen = () => {
  const [esPsicologo, setEsPsicologo] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  return (
    <ScrollView style={{...registerStyle.container, marginTop: 40}}>
      <BarTittle title='Registrar' />
      <KeyboardAvoidingView style={{marginTop: 30, alignItems: 'center'}}>  
        <ThemedTextInput 
          placeholder='Nombre completo' 
          keyboardType='default'
          autoCapitalize='words'
          icon='person-outline'
          value={form.fullName}
          onChangeText={(value) => setForm(prev => ({...prev, fullName: value}))}
        />
        <ThemedTextInput 
          placeholder='Correo electrónico' 
          keyboardType='email-address'
          autoCapitalize='none'
          icon='mail-outline'
          value={form.email}
          onChangeText={(value) => setForm(prev => ({...prev, email: value}))}
        />
        <ThemedTextInput 
          placeholder='Contraseña' 
          keyboardType='default'
          autoCapitalize='none'
          icon='lock-closed-outline'
          secureTextEntry
          value={form.password}
          onChangeText={(value) => setForm(prev => ({...prev, password: value}))}
        />
        <ThemedTextInput 
          placeholder='Confirmar contraseña' 
          keyboardType='default'
          autoCapitalize='none'
          icon='lock-closed-outline'
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(value) => setForm(prev => ({...prev, confirmPassword: value}))}
        />
      </KeyboardAvoidingView>
      <View style={registerStyle.containerLeft}>
        <Text style={registerStyle.TextLeft}>
          ¿Eres un psicólogo?
        </Text>
        <ThemedSwitch value={esPsicologo} onChange={() => setEsPsicologo(!esPsicologo)}/>
      </View>
      <View style={{alignItems: 'center', marginVertical: 5, marginLeft: 10}}>
        <Text style={registerStyle.termsText}>
          Al registrarte, aceptas nuestros términos y condiciones.
        </Text>
      </View>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <CustomButton 
          text='Registrarse' 
          textColor='black' 
          size='lg'
          onPress={() => console.log('Registrandose....')}
          />
          <Text style={registerStyle.textStyle}> O ingresa con: </Text>
          <GoogleButton onPress={()=>{console.log('Google login pressed')}} />
      </View>
      <View style={registerStyle.bottomContainer}>
            <Text style={registerStyle.bottomTextTitle}>¡Bienvenido!</Text>
            <Text style={registerStyle.bottomTextDescription}>¿Aún no tienes una cuenta?</Text>
            <CustomButton text='Iniciar sesión' size='md' onPress={() => router.push('/auth/login')} style={{marginBottom: 50}} />
        </View>
    </ScrollView>
  )
}

export default RegisterScreen