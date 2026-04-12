import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const horarioStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: 'black'
    },
    header:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton:
    {
        padding: 4,
    },
    dayContainer:
    {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10
    },
    dayText:
    {
        color: 'black',
        fontSize: 20,
        fontWeight: '400'
    },
    daysContainer:
    {
        justifyContent: 'space-evenly',
        height: '100%',
        alignContent: 'center',
        paddingBottom: 20,
    },
    horas:{
        flexDirection: 'row',
    }

})