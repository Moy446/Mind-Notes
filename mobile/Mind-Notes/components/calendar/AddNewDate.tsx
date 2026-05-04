import { Pressable, PressableProps } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'

interface Props extends PressableProps{

    //methods
    onPress: () => void
}

const AddNewDateComponent = ({onPress,disabled, ...props}: Props) => {
  return (
    <Pressable 
        {...props}
        disabled={disabled}
        style={({pressed}) =>({
            ...calendarioStyle.addContainer,
            opacity: pressed ? 0.6 : 1,
            ...(disabled && calendarioStyle.disabledButton)
        })}
        onPress={()=>{
            Haptics.selectionAsync()
            onPress()
        }}>
        <Ionicons name='add-outline' color={disabled ? Colors.disabledIcon : Colors.primaryButton} size={35} />

    </Pressable>
  )
}

export default AddNewDateComponent