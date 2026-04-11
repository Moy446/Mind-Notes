import React from 'react'
import { Pressable, Text, View, StyleSheet, PressableProps } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { loginStyle } from '@/styles/auth/loginStyle';

interface Props extends PressableProps {
    onPress: () => void;
}

const GoogleButton = ({ onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        loginStyle.googleButtonStyle,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={loginStyle.contentGoogleButton}>
        <AntDesign name="google" size={20} color="#DB4437" />
        <Text style={loginStyle.textGoogleButton}>Continuar con Google</Text>
      </View>
    </Pressable>
  );
};

export default GoogleButton