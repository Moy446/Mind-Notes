import { Colors } from "@/constants/theme";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";

export const registerStyle = StyleSheet.create({
    container:{
        backgroundColor: Colors.background,
    },

    containerLeft:{
        marginLeft: 30,
        marginBottom: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    TextLeft:{
        fontSize: 14,
        fontFamily: 'SairaMedium',
        marginBottom: 5,
    },
    TextLeftSwitch:{
        fontSize: 11,
        fontFamily: 'SairaMedium',
    },
    TextRigthSwitch:{
        fontSize: 11,
        fontFamily: 'SairaMedium',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    switchContainer:{
        width: '60%',
    },
    switchThumb:{
        width: 28,
        height: 28,
        borderRadius: 12,
    },
    switchTrack:{
        width: 100,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 4,
    },
    termsText:{
        fontSize: 12,
        fontFamily: 'SairaMedium',
        color: Colors.principal,
    },
    textStyle:{
        fontSize: 16,
        fontFamily: 'SairaMedium',
        marginTop: 5,
    },
    bottomContainer:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.principal,
        padding: 10,
        borderTopEndRadius: 50,
        borderTopStartRadius: 50,
    },
    bottomTextTitle:{
        color: Colors.white,
        fontSize: 25,
        fontFamily: 'SairaMedium',
        textAlign: 'center',
    },
    bottomTextDescription:{
        color: Colors.white,
        fontSize: 16,
        fontFamily: 'SairaMedium',
        textAlign: 'center',
    },


})