import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
        headerShown: false,
    }}>
        <Stack.Screen name='login/index' options={{ title: 'Login' }} />
        <Stack.Screen name='register/index' options={{ title: 'Register' }} />
        <Stack.Screen name='forgot-password/index' options={{ title: 'Forgot Password' }} />
    </Stack>
  )
}

export default AuthLayout