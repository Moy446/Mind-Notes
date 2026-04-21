import { View, Text, Pressable, Animated, Modal } from 'react-native'
import React, { useEffect, useState, useRef, use } from 'react'
import { grabadoraStyle } from '@/styles/grabadora/grabadora'
import FakeWave from '@/components/grabadora/Ondas'
import { Audio } from 'expo-av'
import { useCalendarPsicologo } from '@/hooks/calendar/useCalendarPsicologo'
import CustomSelector from '@/components/popup/CustomSelector'
import { subirGrabacion } from '@/core/actions/grabacion/grabacion.actions'


const RecordScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [resumen, setResumen] = useState<boolean>(false);
  const [grabacion, setGrabacion] = useState<boolean>(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { userList, loadUserList } = useCalendarPsicologo()
  const [selectedUser, setSelectedUser] = useState({
    idUsuario: '',
    nombre: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [audioLevel, setAudioLevel] = useState(-160);
  const [levels, setLevels] = useState(Array(40).fill(-160));

  useEffect(() => {
    loadUserList()
  }, [])

  useEffect(() => {
  let interval: any;

  if (recording && isRecording) {
    interval = setInterval(async () => {
      try {
        const status = await recording.getStatusAsync();

        if (status.metering !== undefined) {
          setAudioLevel(status.metering);

          setLevels(prev => [
            status.metering,
            ...prev.slice(0, 39),
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    }, 100);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [recording, isRecording]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") return;
      if (selectedUser.idUsuario === '') {
        alert('Selecciona un paciente para empezar la grabación')
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });

      setRecording(recording);
      setIsRecording(true)
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (!recording || isStopping) return;
    setIsStopping(true);
    try {
      const status = await recording.getStatusAsync();
      if (!status.isRecording) {
        setRecording(null);
        setIsRecording(false);
        return;
      }  

      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      setAudioUri(uri);
      console.log("Audio:", uri);
      
      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        name: "grabacion.wav",
        type: "audio/wav",
      });
      formData.append("idPaciente", selectedUser.idUsuario);
      formData.append("nombrePaciente", selectedUser.nombre);
      formData.append("resume", resumen);
      formData.append("grabacion", grabacion);
      subirGrabacion(formData);
      alert('La grabación se está procesando, se le enviara un correo cuando esté lista');
    } catch (err) {
      console.error(err);
      alert('Hubo un error para guardar la grabacion')
    } finally {
      setRecording(null);
      setIsRecording(false)
      setIsStopping(false);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    Animated.timing(scale, {
      toValue: isRecording ? 1.6 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [recording]);

  return (
    <View style={grabadoraStyle.container}>
      <FakeWave levels={levels} />
      <Pressable
        style={grabadoraStyle.boton}
        disabled={isStopping}
        onPress={() => isRecording ? stopRecording() : setShowPopup(true)}
      >
        <Animated.View style={[
          grabadoraStyle.centroBoton,
          { transform: [{ scale }], },
        ]}></Animated.View>
      </Pressable>
      <Modal visible={showPopup} transparent animationType="slide"
        onRequestClose={() => setShowPopup(false)}>
        <View style={grabadoraStyle.darkThemeModal}>
          <View style={grabadoraStyle.modalContainer}>
            
              <Text>Paciente:</Text>
              <CustomSelector 
                data={userList || []}
                value={'0'}
                placeholder={'Selecciona el paciente'}
                onChange={(user) => setSelectedUser({ idUsuario: user.id, nombre: user.nombre })}
              />
              <View style={grabadoraStyle.radioBtnContainer}>

                <Pressable style={grabadoraStyle.radioBtn} onPress={() => setResumen(!resumen)}>
                  <View style={grabadoraStyle.circleRadio}>
                    <View style={resumen ? grabadoraStyle.active : null}/>
                  </View>
                  <Text>Resumen</Text>
                </Pressable>

                <Pressable style={grabadoraStyle.radioBtn} onPress={() => setGrabacion(!grabacion)}>
                  <View style={grabadoraStyle.circleRadio}>
                    <View style={grabacion ? grabadoraStyle.active : null}/>
                  </View>
                  <Text>Guardar grabación</Text>
                </Pressable>

              </View>

              <Pressable style={grabadoraStyle.acceptBtn}
                onPress={()=>{
                  handlePress(); 
                  setShowPopup(false)
                }}
              >
                <Text style={grabadoraStyle.accetpText}>Aceptar</Text>
              </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default RecordScreen