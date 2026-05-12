import React, { useEffect } from "react"
import { Redirect } from "expo-router"
import { UseAuthStore } from "@/store/auth/useAuthStore";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

const StatusLayout = () => {
  const user = UseAuthStore(state => state.user);
  const status = UseAuthStore(state => state.status);
  const  checkStatus  = UseAuthStore.getState().checkStatus;

  useEffect(() => {
    checkStatus();
  }, []);
    
  if(status === 'checking'){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }
    
  if (status === 'unauthenticated') {
    return <Redirect href={'/auth/login'} />;
  }

  if (status === 'authenticated' && user?.role === 'psicologo') {
    return <Redirect href={'/psicologo/tabs/chat'} />
  }


  return <Redirect href={'/paciente/tabs/chat'} />
}

export default StatusLayout