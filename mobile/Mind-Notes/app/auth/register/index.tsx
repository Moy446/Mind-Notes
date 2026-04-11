import { View, Text, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { registerStyle } from '@/styles/auth/registerStyle'
import BarTittle from '@/components/auth/BarTittle'
import ThemedTextInput from '@/components/auth/ThemedTextInput'
import ThemedSwitch from '@/components/auth/ThemedSwitch'
import CustomButton from '@/components/auth/CustomButton'
import GoogleButton from '@/components/auth/GoogleButton'
import { router } from 'expo-router'
import UseRegister from '@/hooks/auth/UseRegister'
import { registerPaciente, registerPsicologo } from '@/core/actions/auth/register.actions'
import ThemedLink from '@/components/auth/ThemedLink'

const RegisterScreen = () => {

  const {validarPassword} = UseRegister()
  const [esPsicologo, setEsPsicologo] = useState(false);
  const [isPosting, setIsPosting] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const validations = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const renderValidation = (label: string, isValid: boolean) => (
    <Text style={{ color: isValid ? 'green' : 'red' }}>
      {isValid ? '✔' : '✖'} {label}
    </Text>
  );

  const onRegister = async () => {
    const {email, fullName, password, confirmPassword} = form
    if (!email || !fullName || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (!validarPassword(form.password)) {
      Alert.alert('Error', 'La contraseña no cumple con los requisitos de seguridad.');
      return;
    }
    try {
      setIsPosting(true)
      if(esPsicologo) {
        await registerPsicologo(fullName, email, password, confirmPassword)
      } else {
        await registerPaciente(fullName, email, password, confirmPassword)
      }
      Alert.alert('Éxito', 'Registro exitoso. Valida tu cuenta a través del correo electrónico.');
      router.push('/auth/login')
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrar. Por favor, inténtalo de nuevo.');
      
    }finally{
      setIsPosting(false)
    }
  }


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
        {renderValidation('Mínimo 8 caracteres', validations.length)}
        {renderValidation('Al menos una mayúscula', validations.upper)}
        {renderValidation('Al menos una minúscula', validations.lower)}
        {renderValidation('Al menos un número', validations.number)}
        {renderValidation('Al menos un carácter especial', validations.special)}

      </KeyboardAvoidingView>
      <View style={registerStyle.containerLeft}>
        <Text style={registerStyle.TextLeft}>
          ¿Eres un psicólogo?
        </Text>
        <ThemedSwitch value={esPsicologo} onChange={() => setEsPsicologo(!esPsicologo)}/>
      </View>
      <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
        <Text style={[registerStyle.termsText, { textAlign: 'center' }]}>
          Al registrarte, aceptas nuestros{' '}        
          <Text
            style={{ fontSize: 12, fontFamily: 'SairaMedium', color: 'blue' }}
            onPress={() => router.push('/auth/register/privacidad/terminosYCondiciones')}
          >
            términos y condiciones
          </Text>
          {' '}y nuestro{' '}
          <Text
            style={{ fontSize: 12, fontFamily: 'SairaMedium', color: 'blue' }}
            onPress={() => router.push('/auth/register/privacidad/avisoPrivacidad')}
          >
            aviso de privacidad
          </Text>
        </Text>
      </View>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <CustomButton 
          text='Registrarse' 
          textColor='black' 
          size='lg'
          onPress={() => onRegister()}
          disabled={isPosting}
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