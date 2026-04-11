import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const forgotPasswordStyle = StyleSheet.create({
    container:{
        backgroundColor: Colors.background,
        height: '100%',
    },
    topContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.primaryButton,
        padding: 10,
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50,
    },
    topTextTitle:{
        marginTop: 40,
        color: Colors.white,
        fontSize: 25,
        fontFamily: 'SairaMedium',
        textAlign: 'center',
    },
    topTextDescription:{
        color: Colors.white,
        fontSize: 16,
        fontFamily: 'SairaMedium',
        textAlign: 'center',
    },
})