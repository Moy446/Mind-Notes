import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { UseAuthStore } from '@/store/auth/useAuthStore';
import { Redirect } from 'expo-router';

const checkoutAuthenticateLayout = () => {
    const { user , status, checkStatus } = UseAuthStore();
    
    useEffect(() => {
        checkStatus();
    }, [])
    
    if(status === 'checking'){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
                <ActivityIndicator />
            </View>
        )
    }
    
    if(status === 'unauthenticated'){
        return <Redirect href={"/auth/login"} />
    }

    if(user?.role === 'psicologo'){
        return <Redirect href={"./(psicologo)/(tabs)/chat"} />
    }
    return <Redirect href={"./(paciente)/(tabs)/chat"} />
}

export default checkoutAuthenticateLayout