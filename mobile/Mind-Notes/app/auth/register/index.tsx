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
import { loginWithGoogle } from '@/services/googleAuthService'
import { UseAuthStore } from '@/store/auth/useAuthStore'

const RegisterScreen = () => {

  const {validarPassword} = UseRegister()
  const changeStatus = UseAuthStore.getState().changeStatus;
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
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (!validarPassword(form.password)) {
      Alert.alert('Error', 'La contraseña no cumple con los requisitos de seguridad.');
      return;
    }
    if (!email || !fullName || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
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

  const handleGoogleAuth = async () => {
    const selectedRole = esPsicologo ? 'psicologo' : 'paciente';

    setIsPosting(true);
    const result = await loginWithGoogle(selectedRole);
    setIsPosting(false);

    if (result.success) {
      const sessionReady = changeStatus(result.accessToken, result.user);
      if (!sessionReady) {
        Alert.alert('Error', 'No se pudo guardar la sesión de Google');
        return;
      }

      if (result.role === 'psicologo') {
        router.replace('/psicologo/tabs/chat');
      } else {
        router.replace('/paciente/tabs/chat');
      }
      return;
    }

    if (result.errorCode === 'GOOGLE_ACCOUNT_NOT_REGISTERED') {
      Alert.alert(
        'Cuenta no registrada',
        'Ese correo aún no existe. Completa el registro manual y luego inicia sesión.'
      );
      return;
    }

    Alert.alert('Error', result.message || 'Error al iniciar sesión con Google');
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
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '25%'}}>
          <Text style={registerStyle.TextLeftSwitch}>
            No
          </Text>
          <Text style={registerStyle.TextRigthSwitch}>
            Si
          </Text>
        </View>
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
          text={isPosting ? 'Registrando...' : 'Registrarse'} 
          textColor='black' 
          size='lg'
          onPress={() => onRegister()}
          disabled={isPosting}
          />
          <Text style={registerStyle.textStyle}> O ingresa con: </Text>
            <GoogleButton onPress={handleGoogleAuth} />
      </View>
      <View style={registerStyle.bottomContainer}>
            <Text style={registerStyle.bottomTextTitle}>¡Hola, de nuevo!</Text>
            <Text style={registerStyle.bottomTextDescription}>¿Ya tienes una cuenta?</Text>
            <CustomButton text='Iniciar sesión' size='md' onPress={() => router.push('/auth/login')} style={{marginBottom: 50}} />
        </View>
    </ScrollView>
  )
}

export default RegisterScreen