import React from 'react'
import { Pressable, Text, View, StyleSheet, PressableProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { loginStyle } from '@/styles/auth/loginStyle';

interface Props extends PressableProps {
    onPress: () => void;
    text?: string;
}

const GoogleButton = ({ onPress, disabled = false, text = 'Continuar con Google' }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        loginStyle.googleButtonStyle,
        { opacity: disabled ? 0.6 : pressed ? 0.7 : 1 }
      ]}
    >
      <View style={loginStyle.contentGoogleButton}>
        <AntDesign name="google" size={20} color="#DB4437" />
        <Text style={loginStyle.textGoogleButton}>{text}</Text>
      </View>
    </Pressable>
  );
};

export default GoogleButton