import { View, Pressable, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { registerStyle } from '@/styles/auth/registerStyle';

interface Props {
    value?: boolean;
    onChange: (val: boolean) => void;
}

const ThemedSwitch = ({ value = false, onChange }: Props) => {
    const isChecked = value;

    const animation = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
        toValue: isChecked ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
        }).start();
    }, [isChecked]);

    const handlePress = () => {
        onChange(!isChecked);
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 60], // ajusta según tamaño
    });

    return (
    <View style={registerStyle.switchContainer}>
        <Pressable onPress={handlePress}>
            <View
            style={[
                registerStyle.switchTrack,
                {
                backgroundColor: isChecked
                    ? 'rgba(41,115,178,0.6)'
                    : 'rgba(41,115,178,0.3)',
                },
            ]}
            >
            <Animated.View
                style={[
                    registerStyle.switchThumb,
                    {
                    transform: [{ translateX }],
                    backgroundColor: isChecked
                        ? 'rgba(242,239,231,0.9)'
                        : 'rgba(41,115,178,0.5)',
                    },
                ]}
            />
            </View>
        </Pressable>
    </View>
    );
};

export default ThemedSwitch;