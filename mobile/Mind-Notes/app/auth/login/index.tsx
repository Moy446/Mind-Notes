import { View, Text, TextInput, Alert, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { UseAuthStore } from '@/store/auth/useAuthStore';
import { loginStyle } from '@/styles/auth/loginStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/auth/CustomButton';
import BarTittle from '@/components/auth/BarTittle';
import ThemedLink from '@/components/auth/ThemedLink';
import ThemedTextInput from '@/components/auth/ThemedTextInput';
import GoogleButton from '@/components/auth/GoogleButton';

//Todo: Hay que ver el token refresh

const LoginScreen = () => {

    const login = UseAuthStore.getState().login;

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
            router.replace('/(paciente)/chat')
            return;
        }else{
            router.replace('/(psicologo)/chat')
            return;
        }
    }

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
            <GoogleButton onPress={()=>{console.log('Google login pressed')}} />

        </KeyboardAvoidingView>
    </View>
    )
}

export default LoginScreen