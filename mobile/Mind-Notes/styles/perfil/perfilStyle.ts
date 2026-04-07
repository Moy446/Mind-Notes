import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const perfilStyle = StyleSheet.create({
    container:{
        height: '100%', 
        backgroundColor: Colors.background, 
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        paddingBottom: '20%'
    },
    title:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    titleText:{
        fontWeight: '700',
        fontSize: 20
    },
    imgContainer:{
        alignItems: 'center',
        position: 'relative',
        height:'40%',
        aspectRatio: 1,
        justifyContent: 'center',
        overflow: 'hidden'
        
    },
    imgPerfil:{
        height: '100%',
        borderRadius:400,
        resizeMode: 'contain',
        aspectRatio: 1,
        
    },
    imgSvg:{
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    campoContainer:{
        width: '70%'
    },
    infoContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoDescription:{
        fontWeight: '700',
        fontSize: 15
    },
    btnHorario:{
        backgroundColor: Colors.principal,
        height: '10%',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom:10

    },
    btnText:{
        color: 'white',
        fontSize: 35,
        fontWeight: '500',
    },
    btnDelete:{
        position: 'absolute',
        right: 20,
        bottom: 20
    }
})