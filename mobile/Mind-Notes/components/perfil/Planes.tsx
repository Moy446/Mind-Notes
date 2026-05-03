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
                    <MaterialIcons name="arrow-back" size={35} color={Colors.principal} />
                </Pressable>
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
                    <Text style={planesStyle.txtPriceSecondary}>USD$35</Text>
                    <Text style={planesStyle.txtTimeSecondary}>6 Meses</Text>
                </View>
            </View>
            <View style={planesStyle.planBig}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPriceSecondary}>USD$80</Text>
                    <Text style={planesStyle.txtTimeSecondary}>1 año</Text>
                </View>
            </View>
        </View>
    )
}

export default PlanesComponent