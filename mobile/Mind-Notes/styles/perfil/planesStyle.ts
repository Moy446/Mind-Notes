import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const planesStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
        flex: 1,
        alignItems: 'center',
        gap: 50
    },
    header:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 20
    },
    planGratis:
    {
        flexDirection: 'row',
        width: '70%',
        height: '15%',
        borderRadius: 15,
        borderColor: Colors.principal,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    imgPlan:{
        width: '30%',
        resizeMode: 'contain',
        aspectRatio: 1,
        
    },
    txtPlan:{
        alignItems: 'center',
        width: '50%',
        justifyContent: 'space-around'
    },
    txtPrice:{
        color: Colors.principal,
        fontWeight: '800',
        fontSize: 20
    },
    txtTime:{
        color: Colors.principal,
        fontSize: 30,
        fontWeight: '400'
    },
    planSmall:{
        flexDirection: 'row',
        width: '70%',
        height: '15%',
        borderRadius: 15,
        borderColor: Colors.principal,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        backgroundColor: Colors.secondaryButton,
        justifyContent: 'space-around'
    },
    planMedium:{
        flexDirection: 'row',
        width: '70%',
        height: '15%',
        borderRadius: 15,
        borderColor: Colors.principal,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        backgroundColor: Colors.primaryButton,
        justifyContent: 'space-around'
    },
    txtPriceSecondary:{
        color: Colors.white,
        fontWeight: '800',
        fontSize: 20
    },
    txtTimeSecondary:{
        color: Colors.white,
        fontSize: 30,
        fontWeight: '400'
    },
    planBig:{
        flexDirection: 'row',
        width: '70%',
        height: '15%',
        borderRadius: 15,
        borderColor: Colors.principal,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        backgroundColor: Colors.principal,
        justifyContent: 'space-around'
    }
})