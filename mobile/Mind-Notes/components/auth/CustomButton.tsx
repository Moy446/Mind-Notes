import { View, Text, PressableProps, Pressable, ViewStyle } from 'react-native'
import React from 'react'
import { loginStyle } from '@/styles/auth/loginStyle';
import { Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics'

interface Props extends PressableProps {
    text: string;
    size?: 'sm' | 'md' | 'lg';
    textColor?: 'white' | 'black';

    //methods
    onPress: () => void;
}

const sizeStyles = {
    sm: { width:'30%' as const, padding: 8 },
    md: { width:'60%' as const, padding: 12 },
    lg: { width:'80%' as const, padding: 16 }
};

const textSizes = {
    sm: { fontSize: 15 },
    md: { fontSize: 17 },
    lg: { fontSize: 19 }
};


const CustomButton = ({ text, size = 'md', textColor = 'white', style, onPress, ...props }: Props) => {
    return (
        <Pressable
            style={({ pressed }) => [{ 
                ...sizeStyles[size],
                opacity: pressed ? 0.6 : 1 ,
                ...loginStyle.buttonStyle,
                ...style as ViewStyle,
            },
            ]}
            onPress={()=>{
                Haptics.selectionAsync()
                onPress()
            }}
            {...props}
        >
            <Text style={{...textSizes[size], fontFamily: 'SairaMedium', color: Colors[textColor], textAlign: 'center'}}>{text}</Text>
        </Pressable>
    );
};

export default CustomButton