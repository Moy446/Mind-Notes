//Archivo creado para manejar los tabs que se creen
import React from 'react';
import { Tabs } from 'expo-router';
import { tabStyle } from '../../../styles/tabStyle';
import TabBarButton from '@/components/tabs/TabBarButton';
import {  Image } from 'react-native';
import { Colors } from '@/constants/theme';

const tabsPsicologo = () => {
  
  return (
    <Tabs
      screenOptions={{
        headerStyle: tabStyle.topTab,
        headerTitle: '',
        headerLeft: () => (
          <Image
          source={require('@/assets/images/logocolor.png')}
          style={{ width: 50, height: 50, marginLeft: 15 }}
          />
        ),
        tabBarStyle: {
          ...tabStyle.buttonTab,
          elevation: 0,
          shadowColor: 'transparent',
          borderTopWidth: 0,
          overflow: 'hidden',
        },
        tabBarActiveTintColor: Colors.white,
        

      }}
      >
        <Tabs.Screen 
          name='grabacion/index' 
          options={{
            tabBarButton: (props) => (
              <TabBarButton 
                {...props} 
                icon='record'
                route="grabacion"
                
              >
              Grabacion
              </TabBarButton>
            )
          }}
        />
        <Tabs.Screen 
          name='calendario/index' 
          options={{
            tabBarButton: (props) => (
              <TabBarButton 
                {...props} 
                icon='calendar'
                route="calendario"
              >
              Calendario
              </TabBarButton>
            )
          }}
        />
        <Tabs.Screen 
          name='chat/index' 
          options={{
            tabBarButton: (props) => (
              <TabBarButton 
                {...props} 
                icon='chat'
                route="chat"
              >
              Chat
              </TabBarButton>
            )
          }}

        />
        <Tabs.Screen 
          name='perfil/index' 
          options={{
            tabBarButton: (props) => (
              <TabBarButton 
                {...props} 
                icon='profile'
                route="perfil"
              >
              Perfil
              </TabBarButton>
            )
          }}
        />
    </Tabs>
  )
}

export default tabsPsicologo