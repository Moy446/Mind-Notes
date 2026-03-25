import React from 'react'
import { View, Text, Pressable, PressableProps } from 'react-native'
import { usePathname } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { tabStyle } from '@/styles/tabStyle'
import { Colors } from '@/constants/theme'


type IconName = 'record' | 'calendar' | 'chat' | 'profile'

interface Props extends PressableProps {
    children?: string ,
    icon: IconName,
    route:string,
}

const iconMap: Record<IconName, keyof typeof Ionicons.glyphMap> = {
  record: 'mic',
  calendar: 'calendar',
  chat: 'chatbox-ellipses',
  profile: 'person',
}

const TabBarButton = ({icon, children, route ,...props}: Props) => {
    const pathname = usePathname()
    const isActive = pathname.includes(route)
  return (
        <Pressable 
            style={({pressed}) =>({
                ...tabStyle.button,
                opacity : pressed ? 0.6 : 1,
                ...(isActive && tabStyle.selectedButton)
            })}
            onPress={(e) => {
                console.log(isActive);
                Haptics.selectionAsync()
                props.onPress?.(e)
            }}
        >
            <View style={tabStyle.containerTab}>
                <Ionicons name={iconMap[icon]} size={children ? 20: 25} color={Colors.white} />
                <Text style={tabStyle.fontTab}>{children}</Text>
            </View>
        </Pressable>

  )
}

export default TabBarButton