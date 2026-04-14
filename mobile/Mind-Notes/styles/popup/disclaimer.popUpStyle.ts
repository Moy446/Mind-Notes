import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const disclaimerPopupStyle = StyleSheet.create({
    titleContainer:{
        backgroundColor: Colors.secondaryButton,
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.principal,
        textAlign: 'center',
        alignItems: 'center',
    },
    titleText:{
        fontFamily: 'SairaMedium',
        fontSize: 18,
        color: '#333',
    },
    bodyContainer:{
        backgroundColor: Colors.background,
        padding: 15,
        alignItems: 'center',
    },
    bodyText:{
        fontFamily: 'SairaMedium',
        fontSize: 14,
        color: '#555',
    },
    button:{
        backgroundColor: Colors.primaryButton,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 20,
        borderColor: Colors.principal,
        alignItems: 'center',
    },
    buttonText:{
        fontFamily: 'SairaMedium',
        fontSize: 14,
        color: Colors.white,
    }
})