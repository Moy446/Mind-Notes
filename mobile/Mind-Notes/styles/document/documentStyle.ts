import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const documentStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        flex: 1,
    },
    header: {
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
    textTitle: {
        color: Colors.white,
        fontSize: 30,
        fontWeight: '400'
    },
    documentText: {
        margin: 10,
        fontSize: 20,
        fontWeight: '400'
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.principal,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

})