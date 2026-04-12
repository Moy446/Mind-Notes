import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/theme'

const AuthLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='login/index' options={{ 
          title: 'Login', 
          headerShown: false 
          }} 
        />
        <Stack.Screen name='register/index' options={{ 
          title: 'Register', 
          headerShown: false 
          }} 
        />
        <Stack.Screen name='register/privacidad/terminosYCondiciones' options={{ 
          title: 'Terminos y Condiciones', 
          headerShown: true, 
          headerStyle: { 
            backgroundColor: Colors.secondaryButton 
            } 
          }} 
        />
        <Stack.Screen name='register/privacidad/avisoPrivacidad' options={{ 
          title: 'Aviso de Privacidad', 
          headerShown: true, 
          headerStyle: { 
            backgroundColor: Colors.secondaryButton 
          }
          }} 
        />
        <Stack.Screen name='forgot-password/index' options={{ 
          title: 'Forgot Password', 
          headerShown: false 
          }} 
        />
    </Stack>
  )
}

export default AuthLayout