import { View, Text, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Svg, { Path } from 'react-native-svg'
import { perfilStyle } from '@/styles/perfil/perfilStyle'
import DeliteAcountPopUp from '@/components/popup/DeleteAcountPopUp'

const profileScreen = () => {

  const [showPopup, setShowPopup] = useState(false);

  return (
    <View style={perfilStyle.container}>
      <View style={perfilStyle.title}>
        <Text style={perfilStyle.titleText}>Perfil</Text>
        <Svg
          viewBox="0 0 24 24"
          width={40}
          height={40}
          fill="red"
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
          />
        </Svg>
      </View>
      <View style={perfilStyle.imgContainer}>
        <Image source={require('../../../../assets/images/userDefault.png')} style={perfilStyle.imgPerfil} />
        <Svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          fill="black"
          style={perfilStyle.imgSvg}
          >
          <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </Svg>        
      </View>

      <View style={perfilStyle.campoContainer}>
        <Text style={perfilStyle.infoDescription}>Nombre</Text>
        <View style={perfilStyle.infoContainer}>
          <Text>Nombre del psicologo</Text>
          <Svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          fill="black"
          style={perfilStyle.imgSvg}
          >
          <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </Svg> 
        </View>
      </View>
      
      <View style={perfilStyle.campoContainer}>
        <Text style={perfilStyle.infoDescription}>Correo</Text>
        <View style={perfilStyle.infoContainer}>
          <Text>Correo del psicologo</Text>
          <Svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          fill="black"
          style={perfilStyle.imgSvg}
          >
          <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </Svg> 
        </View>
      </View>

      <View style={perfilStyle.campoContainer}>
        <Text style={perfilStyle.infoDescription}>Plan</Text>
        <View style={perfilStyle.infoContainer}>
          <Text>Plan del psicologo</Text>
          <Svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          fill="black"
          style={perfilStyle.imgSvg}
          >
          <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </Svg> 
        </View>
      </View>

      <TouchableOpacity style={perfilStyle.btnHorario} onPress={() => console.log('Presionado')}>
        <Text style={perfilStyle.btnText}>Horario</Text>
      </TouchableOpacity>

      <Svg
        viewBox="0 0 24 24"
        width={40}
        height={40}
        fill="red"
        style={perfilStyle.btnDelete}
        onPress={() => setShowPopup(true)}
      >
        <Path fillRule="evenodd"
          clipRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
      </Svg>
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={perfilStyle.darkThemeModal}>
          <View style={perfilStyle.modalContainer}>
            <DeliteAcountPopUp
              onAccept={() => {
                setShowPopup(false)
              }} 
              onClose={() => {
                setShowPopup(false)
              }} 
              />
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default profileScreen