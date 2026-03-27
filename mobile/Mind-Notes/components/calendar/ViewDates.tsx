import React from 'react'
import { View, Text, Pressable, PressableProps, Image } from 'react-native'
import * as Haptics from 'expo-haptics'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
interface Props extends PressableProps{

  name:string
  hour:string
  //methods
  onPress: () => void
}

const ViewDatesComponent = ({name, hour, onPress, ...props}:Props) => {
  return (
    <Pressable 
      {...props}
      style={({pressed}) =>({
        ...calendarioStyle.datesContainer,
        opacity: pressed ? 0.6 : 1,
      })}
      onPress={()=>{
        Haptics.selectionAsync()
        onPress()
      }}>
        <View style={calendarioStyle.infoDateContainer}>
            <Image source={require('../../assets/images/userDefault.png')} alt='ImagenPaciente' style={calendarioStyle.infoDateContainer_img} />
            <View style={calendarioStyle.infoDateContainer_dataPacient}>
              <Text style={calendarioStyle.infoDateContainer_text}>{name}</Text>
              <Text style={calendarioStyle.infoDateContainer_text}>{hour}</Text>
            </View>
        </View>
    </Pressable>
  )
}

export default ViewDatesComponent