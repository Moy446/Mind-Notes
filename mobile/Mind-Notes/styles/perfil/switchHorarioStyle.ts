import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const switchHorarioStyle = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    btn: {
        width: 60,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 35,
        position: 'absolute',
        backgroundColor: 'white',
        left: 0
    },
    titleBox: {
        position: 'absolute'
    },
    tittleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 7.5,
        paddingBottom: 1.5
    }
    
})