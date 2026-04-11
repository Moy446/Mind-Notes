import { View, Text, TextInputProps, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { loginStyle } from '@/styles/auth/loginStyle';
import { Colors } from '@/constants/theme';

interface Props extends TextInputProps {
    icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedTextInput = ({ icon, ...props }: Props) => {
    
    const [isActive, setIsActive] = useState(false);
    const inputRef = useRef<TextInput>(null);

    return (
        <View style={{
            ...loginStyle.inputStyle,
            borderColor: isActive ? Colors.principal : '#ccc',
            }}
            onTouchStart={() => inputRef.current?.focus()}
        >
            {icon && (
                <Ionicons
                name={icon}
                size={24}
                color={Colors.black}
                style={{ marginRight: 10 }}
                />
            )}
            <TextInput
                ref={inputRef}
                placeholderTextColor="#5c5c5c"
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                style={{
                color: Colors.black,
                marginRight: 10,
                flex: 1,
                }}
                {...props}
            />
        </View>
    )
}

export default ThemedTextInput