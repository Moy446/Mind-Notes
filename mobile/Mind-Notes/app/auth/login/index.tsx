import { View, Text, TextInput, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { UseAuthStore } from '@/store/auth/useAuthStore'
import { router } from 'expo-router'

const LoginScreen = () => {

    const login = UseAuthStore(state => state.login)

    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [isPosting, setIsPosting] = useState(false)

    const onLogin = async () => {
        const {email, password} = form
        
        if(!email || !password) return;
        
        setIsPosting(true)
        const wasSuccesful = await login(email, password)
        setIsPosting(false)

        if(!wasSuccesful.success){
            Alert.alert('Error', 'Correo o contraseña incorrectos');
            return;
        }
        if(wasSuccesful.role === 'paciente'){
            router.replace('/(user)/(paciente)/(tabs)/chat')
        }else{
            router.replace('/(user)/(psicologo)/(tabs)/chat')
        }
    }

  return (
    <View style={{marginTop: 50, alignItems: 'center'}}>
        <TextInput 
            placeholder="Correo electrónico"
            keyboardType='email-address' 
            autoCapitalize='none'
            value={form.email}
            onChangeText={(text) => setForm({...form, email: text})}
        />
        <TextInput 
            placeholder="Contraseña" 
            secureTextEntry 
            autoCapitalize='none'
            value={form.password}
            onChangeText={(text) => setForm({...form, password: text})}
        />
        <Pressable onPress={onLogin} disabled={isPosting}>
            <Text>Ingresar</Text>
        </Pressable>
    </View>
  )
}

export default LoginScreen