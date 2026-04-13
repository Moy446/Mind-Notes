import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const documentStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        flex: 1,
    },
    header:{
        backgroundColor: Colors.principal,
        width: '100%',
        height: 70,
        borderBottomStartRadius: 35,
        borderBottomEndRadius: 35,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 10,
        paddingLeft: 10,
        gap: 10
    },
    textTitle:{
        color: Colors.white,
        fontSize: 30,
        fontWeight: '400'
    },
    documentText:{
        margin: 10,
        fontSize: 20,
        fontWeight: '400'
    }

})