import { View, Text, Pressable } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics'
import { nameBarStyle } from '@/styles/chat/nameBarStyle'

interface MoreOptionsViewProps {
    onPress: () => void
}

const MoreOptionsView = ({ onPress }: MoreOptionsViewProps) => {
    return (
        <View style={nameBarStyle.moreInformationContainer}>
            <Pressable style={({pressed}) =>({
                flex: 1,
                padding: 8,
                opacity: pressed ? 0.6 : 1,})}
                onPress={() => {
                    Haptics.selectionAsync()
                    onPress()
                }}
            >
                <Text style={{ color: 'red' }}> Eliminar cuenta</Text>
            </Pressable>
        </View>
    )
}

export default MoreOptionsView