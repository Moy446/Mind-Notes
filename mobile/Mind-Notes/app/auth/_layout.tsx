import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
        headerShown: false,
    }}>
        <Stack.Screen name='login/index' />
        <Stack.Screen name='register/index' />
        <Stack.Screen name='forgot-password/index' />
    </Stack>
  )
}

export default AuthLayout