import { useState, useEffect, useRef } from "react";
import { Animated, View, Text, TouchableWithoutFeedback, } from "react-native";
import { switchHorarioStyle } from "@/styles/perfil/switchHorarioStyle";
import { Colors } from "@/constants/theme";


const SwitchHorario = ({ temporal, onChange }) => {
    const animatedValues = {
        toggle: useRef(new Animated.Value(0)).current
    }

    const { toggle } = animatedValues

    useEffect(() => {
        handleAnimated()
    }, [temporal])

    const handleAnimated = () => {
        Animated.timing(toggle, {
            toValue: temporal ? 1 : 0,
            duration: 275,
            useNativeDriver: false
        }).start()
    }

    const animatedStyles = {
        transform: [
            {
                translateX: toggle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, 35],
                    extrapolate: 'clamp'
                })
            }
        ]
    }

    return (
        <View style={switchHorarioStyle.container}>
            <TouchableWithoutFeedback onPressIn={() => onChange(!temporal)}>
                <View style={[switchHorarioStyle.btn, {backgroundColor: temporal ? Colors.primaryButton : Colors.secondaryButton}]}>
                    <Animated.View style={[switchHorarioStyle.circle, animatedStyles]}/>
                    <View style={[switchHorarioStyle.titleBox, {left: temporal ? 8 : 27}]}>
                        <Text>{temporal ? 'on' : 'off'}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}
export default SwitchHorario