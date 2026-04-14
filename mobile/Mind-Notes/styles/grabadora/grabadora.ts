import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const grabadoraStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        gap: 25
    },
    boton:
    {
        width: '20%',
        backgroundColor: Colors.secondaryButton,
        aspectRatio: 1,
        borderRadius: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centroBoton:{
        width: '40%',
        aspectRatio: 1,
        backgroundColor: Colors.principal,
        borderRadius: '100%'
    },
    darkThemeModal:{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",  
    },
    modalContainer:{
        width: "85%",
        backgroundColor: Colors.primaryButton,
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: "#000", 
        shadowOpacity: 0.25,
        shadowRadius: 4,
        gap: 5
    },
    radioBtnContainer:{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    radioBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    circleRadio:{
        width: 30,
        aspectRatio: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999
    },
    active:{
        width: '70%',
        aspectRatio: 1,
        backgroundColor: Colors.principal,
        borderRadius: 999
    },
    acceptBtn:{
        backgroundColor: Colors.principal,
        width: '50%',
        borderRadius: 25,
        alignSelf: 'center',
        alignItems: 'center'
    },
    accetpText:
    {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800'
    }

   
})