import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";
export const tabStyle = StyleSheet.create({
    topTab:{
        backgroundColor: Colors.principal,
        borderBottomStartRadius: 35,
        borderBottomEndRadius: 35,
    },
    buttonTab:{
        backgroundColor: Colors.principal,
        borderTopStartRadius: 35,
        borderTopEndRadius: 35,
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
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 10 },
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
    },
    fontTab:{
        color: '#ffffff',
        fontFamily: 'SairaMedium',
        fontSize: 10,
    }
})