import { View, Text, TextInput, Alert, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { UseAuthStore } from '@/store/auth/UseAuthStore'
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
    <KeyboardAvoidingView style={{marginTop: 50, alignItems: 'center'}}>
        <TextInput 
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
        <TextInput 
            placeholder="Contraseña" 
            secureTextEntry 
            autoCapitalize='none'
            value={form.password}
            onChangeText={(value) => setForm(prev =>({
                ...prev, 
                ["password"]: value
            }))}
        />
        <Pressable onPress={onLogin} disabled={isPosting}>
            <Text>Ingresar</Text>
        </Pressable>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen