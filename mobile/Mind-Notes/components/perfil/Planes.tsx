import React from 'react'
import { View, Text, Pressable, PressableProps, Image } from 'react-native'
import * as Haptics from 'expo-haptics'
import { planesStyle } from '@/styles/perfil/planesStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'
import Svg, { Path } from 'react-native-svg'


interface Props {
    //Metodos
    onClose: () => void;
}

const PlanesComponent = ({ onClose }: Props) => {
    return (
        <View style={planesStyle.container}>
            <View style={planesStyle.header}>
                <Pressable onPress={onClose} >
                    <MaterialIcons name="arrow-back" size={24} color={Colors.principal} />
                </Pressable>
                <Svg
                    viewBox="0 0 24 24"
                    width={30}
                    height={30}
                    fill="red"
                >
                    <Path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </Svg>
            </View>
            <View style={planesStyle.planGratis}>
                <Image source={require('../../assets/images/logocolor.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPrice}>Gratis</Text>
                    <Text style={planesStyle.txtTime}>30 Días</Text>
                </View>
            </View>
            <View style={planesStyle.planSmall}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPrice}>USD$10</Text>
                    <Text style={planesStyle.txtTime}>1 Mes</Text>
                </View>
            </View>
            <View style={planesStyle.planMedium}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPriceSecondary}>USD$30</Text>
                    <Text style={planesStyle.txtTimeSecondary}>6 Meses</Text>
                </View>
            </View>
            <View style={planesStyle.planBig}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPriceSecondary}>USD$40</Text>
                    <Text style={planesStyle.txtTimeSecondary}>1 año</Text>
                </View>
            </View>
        </View>
    )
}

export default PlanesComponent