import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const calendarPopUpStyle = StyleSheet.create({


    selector:{
        backgroundColor: Colors.secondaryButton,
        fontFamily: 'SairaMedium',
        margin:10,
        height:50,
        paddingHorizontal:10,
        borderRadius: 8,
        borderColor: Colors.principal,
        borderWidth: 1,
    },
    renderItemContainer:{
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10,
        padding: 10,
        backgroundColor: Colors.secondaryButton,
        fontFamily: 'SairaMedium',
        fontSize: 12,
    },

    datePicker:{
        backgroundColor: Colors.secondaryButton,
        fontFamily: 'SairaMedium',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.principal,
        padding: 12,
        margin:10,
    },
    timePickerContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        margin:10,
    },

    timePicker:{
        width:'40%',
        backgroundColor: Colors.secondaryButton,
        fontFamily: 'SairaMedium',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.principal,
        padding: 12,
    },
    btnContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:15,
        margin:5,
    },
    btn:{
        alignItems:'center',
        justifyContent:'center',
        padding: 15,
        borderRadius: 10,
    },
    btnText:{
        color: Colors.principal,
        fontSize: 14,
        fontFamily: 'SairaBold',
    },
    
})