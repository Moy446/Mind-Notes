import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const deleteAccountPopUpStyle = StyleSheet.create({
    container:{
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center'
    },
    warningText:{
        fontSize: 20,
        fontWeight: '700',
    },
    btnsContainer:
    {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'space-around'
    },
    acceptBtn:
    {
        backgroundColor: Colors.primaryButton,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 50
    },
    acceptText:
    {
        fontSize: 15,
        color: 'white',
        fontWeight: '600'
    },
    cancelBtn:{
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 50
    },
    cancelText:
    {
        fontSize: 15,
        color: 'black',
        fontWeight: '600'
    }
})