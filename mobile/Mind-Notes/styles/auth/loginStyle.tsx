import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const loginStyle = StyleSheet.create({
    container:{
        backgroundColor: Colors.background,
    },
    topContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.principal,
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
    inputStyle:{
        width: '80%',
        backgroundColor: 'rgba(41, 115, 178, 0.3)',
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        padding: 5,

    },
    textStyle:{
        fontSize: 16,
        fontFamily: 'SairaMedium',
        marginTop: 5,
    },


    buttonStyle:{
        backgroundColor: Colors.primaryButton,
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
    },

    googleButtonStyle:{
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    contentGoogleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // si no funciona en tu versión, usa margin
    },
    textGoogleButton: {
        fontSize: 16,
        color: '#333',
    },
})