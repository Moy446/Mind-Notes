import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const calendarioStyle = StyleSheet.create({
    container:{
        height: '100%', 
        backgroundColor: Colors.background, 
        paddingTop: 10,
    },
    selectedDay:{
        borderRadius: 5,
    },
    dotStyle:{
        width: '100%',
        backgroundColor: Colors.principal,
    },
    EventsContainer:{
        display: 'flex',
        flexDirection:'column',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: Colors.principal,
        gap: 5,
    },
    addContainer:{
        width:'100%',
        height: 55,
        backgroundColor: Colors.secondaryButton,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    datesContainer:{
        width:'100%',
        backgroundColor: Colors.principal,
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden',

    },
    txtDate:{
        color: Colors.principal,
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Saira-Medium'
    },
    infoDateContainer:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 10,
    },
    infoDateContainer_img :{
        width: 40,
        height: 40,
        backgroundColor: Colors.white,
        borderRadius: 20,

    },
    infoDateContainer_dataPacient:{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    },
    infoDateContainer_text :{
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Saira-Medium'
    },
    darkThemeModal:{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",  
    },
    modalContainer:{
        width: "85%",
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: "#000", 
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
})