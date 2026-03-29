import { View, Text, TextInput, Alert, Pressable, KeyboardAvoidingView } from 'react-native'
import React, { use, useCallback, useState } from 'react'
import { router } from 'expo-router'
import { UseAuthStore } from '@/store/auth/UseAuthStore'

const LoginScreen = () => {

    const { login } = UseAuthStore();

    const [isPosting, setIsPosting] = useState(false)
    const [form, setForm] = useState({
        email: 'a22310402@ceti.mx',
        password: 'Celeste446?',
    })


    const onLogin = useCallback(async () => {
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
    }, [])

  return (
    <KeyboardAvoidingView style={{marginTop: 50, alignItems: 'center'}}>
        <TextInput 
            placeholder="Correo electrónico"
            keyboardType='email-address' 
            autoCapitalize='none'
            value={form.email}
            onChangeText={(value) => setForm({...form, email: value})}
        />
        <TextInput 
            placeholder="Contraseña" 
            secureTextEntry 
            autoCapitalize='none'
            value={form.password}
            onChangeText={(value) => setForm({...form, password: value})}
        />
        <Pressable onPress={onLogin} disabled={isPosting}>
            <Text>Ingresar</Text>
        </Pressable>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen