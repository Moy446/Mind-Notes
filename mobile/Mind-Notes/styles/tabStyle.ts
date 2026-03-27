import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";
export const tabStyle = StyleSheet.create({
    generalTab:{
        backgroundColor: Colors.principal,
        borderRadius: 35,
    },
    containerTab:{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',      
        padding: 6,
    },
    button:{
        flex: 1,
        height: 60,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedButton:{
        backgroundColor: Colors.secondaryButton,
        borderRadius: 50,
        elevation: 5,
    },
    fontTab:{
        color: '#ffffff',
        fontFamily: 'SairaMedium',
        fontSize: 10,
    }
})