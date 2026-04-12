
import { Image } from 'react-native'
import React from 'react'
import { tabStyle } from '@/styles/tabStyle'
import { Colors } from '@/constants/theme'
import { Tabs } from 'expo-router'
import TabBarButton from '@/components/tabs/TabBarButton'


const tabsLayout = () => {    
        
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

export default tabsLayout