import { View, Text, Pressable, Animated, Modal } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { grabadoraStyle } from '@/styles/grabadora/grabadora'
import FakeWave from '@/components/grabadora/Ondas'
import { Audio } from 'expo-av'
import { useCalendarPsicologo } from '@/hooks/calendar/useCalendarPsicologo'
import CustomSelector from '@/components/popup/CustomSelector'

const recordScreen = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [resumen, setResumen] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { userList, loadUserList } = useCalendarPsicologo()

  useEffect(() => {
    loadUserList()
  }, [])

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      setAudioUri(uri);

      console.log("Audio:", uri);

      setRecording(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePress = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    Animated.timing(scale, {
      toValue: recording ? 1.6 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [recording]);

  return (
    <View style={grabadoraStyle.container}>
      <FakeWave isRecording={!!recording} />
      <Pressable
        style={grabadoraStyle.boton}
        onPress={() => setShowPopup(true)}
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
              />
              <View style={grabadoraStyle.radioBtnContainer}>

                <Pressable style={grabadoraStyle.radioBtn} onPress={() => setResumen(!resumen)}>
                  <View style={grabadoraStyle.circleRadio}>
                    <View style={resumen ? grabadoraStyle.active : null}/>
                  </View>
                  <Text>Resumen</Text>
                </Pressable>

                <Pressable style={grabadoraStyle.radioBtn} onPress={() => setTranscript(!transcript)}>
                  <View style={grabadoraStyle.circleRadio}>
                    <View style={transcript ? grabadoraStyle.active : null}/>
                  </View>
                  <Text>Transcripción</Text>
                </Pressable>

              </View>

              <Pressable style={grabadoraStyle.acceptBtn}>
                <Text style={grabadoraStyle.accetpText}>Aceptar</Text>
              </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default recordScreen