import React from 'react'
import { View, Text, Pressable, PressableProps, Image } from 'react-native'
import * as Haptics from 'expo-haptics'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import { resolveMediaUrl } from '@/core/API/mediaUrl'

type Cita = {
  idCita: string,
  idUsuario: string,
  title:string,
  start: Date,
  end: Date,
  extendedProps: {
    estado: string,
    img: string
  }
}

interface Props extends PressableProps{

  info: Cita
  //methods
  onPress: () => void
}

const ViewDatesComponent = ({info, onPress, ...props}:Props) => {
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
            <Image source={info.extendedProps.img?.includes('userDefault')
              ? require('../../assets/images/userDefault.png')
              : { uri: resolveMediaUrl(info.extendedProps.img )}} alt='ImagenPaciente' style={calendarioStyle.infoDateContainer_img} 
            />
            <View style={calendarioStyle.infoDateContainer_dataPacient}>
              <Text style={calendarioStyle.infoDateContainer_text}>{info.title}</Text>
              <Text style={calendarioStyle.infoDateContainer_text}>{info.start.toLocaleTimeString().substring(0, 5)} - {info.end.toLocaleTimeString().substring(0, 5)}</Text>
            </View>
        </View>
    </Pressable>
  )
}

export default ViewDatesComponent