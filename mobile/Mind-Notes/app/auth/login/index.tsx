import { View, Text, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { UseAuthStore } from '@/store/auth/useAuthStore';
import { loginStyle } from '@/styles/auth/loginStyle';
import CustomButton from '@/components/auth/CustomButton';
import BarTittle from '@/components/auth/BarTittle';
import ThemedLink from '@/components/auth/ThemedLink';
import ThemedTextInput from '@/components/auth/ThemedTextInput';
import GoogleButton from '@/components/auth/GoogleButton';
import { useGoogleAuth, loginWithGoogle } from '@/services/googleAuthService';

//Todo: Hay que ver el token refresh

const LoginScreen = () => {

    const login = UseAuthStore.getState().login;
    const { promptAsync } = useGoogleAuth();

    const [isPosting, setIsPosting] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
    })


    const onLogin = async () => {
        const {email, password} = form;

        if(!email || !password) return;
        
        setIsPosting(true)
        const wasSuccesful = await login(form.email, form.password)
        setIsPosting(false)

        console.log(wasSuccesful)
        if(!wasSuccesful.success){
            Alert.alert('Error', 'El usuario o contraseña son incorrectos')
            return;
        }
        if(wasSuccesful.role === 'paciente'){
            router.replace('/(paciente)/(tabs)/chat')
            return;
        }else{
            router.replace('/(psicologo)/(tabs)/chat')
            return;
        }
    }

    const handleGoogleLogin = async () => {
        if (!promptAsync) {
            Alert.alert('Info', 'Google login está disponible solo en build nativo de Android. Para desarrollar en Expo Go, por favor usa email y contraseña.');
            return;
        }

        setIsPosting(true);
        const result = await loginWithGoogle(promptAsync, 'paciente');
        setIsPosting(false);

        if (result.success) {
            if (result.role === 'paciente') {
                router.replace('/(paciente)/(tabs)/chat');
            } else {
                router.replace('/(psicologo)/(tabs)/chat');
            }
        } else {
            Alert.alert('Error', result.message || 'Error al iniciar sesión con Google');
        }
    };

    return (
    <View style={loginStyle.container}>
        <View style={loginStyle.topContainer}>
            <Text style={loginStyle.topTextTitle}>¡Bienvenido!</Text>
            <Text style={loginStyle.topTextDescription}>¿Aún no tienes una cuenta?</Text>
            <CustomButton text='Registrate' size='md' onPress={() => router.push('/auth/register')} style={{marginBottom: 20}} />
        </View>
        <BarTittle title='MindNotes' align='left' />
        <KeyboardAvoidingView style={{marginTop: 30, alignItems: 'center'}}>
            <ThemedTextInput 
                icon='mail-outline'
                placeholder="Correo electrónico"
                keyboardType='email-address'
                autoCapitalize='none'
                value={form.email}
                onChangeText={(value) => { console.log(form);
                    setForm(prev =>({
                    ...prev, 
                    ["email"]: value
                }))}}
            />
            <ThemedTextInput 
                icon='lock-closed-outline'
                placeholder="Contraseña" 
                secureTextEntry 
                autoCapitalize='none'
                value={form.password}
                onChangeText={(value) => setForm(prev =>({
                    ...prev, 
                    ["password"]: value
                }))}
            />
            <CustomButton onPress={onLogin} disabled={isPosting} text='Ingresar' size='lg' textColor='black' style={{marginBottom: 10}} />
            <ThemedLink href={'/auth/forgot-password'} style={loginStyle.textStyle}>¿Olvidaste tu contraseña?</ThemedLink>
            <Text style={loginStyle.textStyle}> ¿Aún no tienes una cuenta? </Text>
            <ThemedLink href={'/auth/register'} style={loginStyle.textStyle}>Registrate</ThemedLink>
            <Text style={loginStyle.textStyle}> O ingresa con: </Text>
            <GoogleButton onPress={handleGoogleLogin} />

        </KeyboardAvoidingView>
    </View>
    )
}

export default LoginScreen