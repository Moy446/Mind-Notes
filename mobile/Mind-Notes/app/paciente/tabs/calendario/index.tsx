import { View, Text, Modal, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import CalendarComponent from '@/components/calendar/calendario'
import { infoCita } from '@/core/interfaces/Dates'
import CustomSelector from '@/components/popup/CustomSelector'
import { useCalendarPaciente } from '@/hooks/calendar/UseCalendarPaciente'
import CalendarPopUp from '@/components/popup/CalendarPopUp'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { useFocusEffect } from 'expo-router'

const calendarioPaciente = () => {

  interface Cita {
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

  const { allDates, userList, citas, currentDate, tomorrowDate, validateDate, loadDates , loadUserList, formatLocalDate, loadDateEvents, addEvent, editEvent } = useCalendarPaciente()
  const [date, setDate] = useState(new Date())
  const formattedDate = formatLocalDate(date) // Formato YYYY-MM-DD
  const [showPopup, setShowPopup] = useState(false);
  const [createDate, setCreateDate] = useState(false)
  const [selectedCita, setSelectedCita] = useState<infoCita>({
    idCita: '',
    idUsuario: '',
    nombre: '',
    fechaCita: '',
    horaInicio: '',
    horaFin: ''
  });

  useFocusEffect(
    useCallback(() => {
      loadUserList()
    }, [])
  )
  
  useEffect(() => {
    if(selectedCita.idUsuario) {
      loadDates(selectedCita.idUsuario)
    }
  },[selectedCita])

  useEffect(() => {
    loadDateEvents(date)
}, [allDates, date])

  const psicologistList = userList

  const resetSelectedCita = () => {
    setSelectedCita({
      ...selectedCita,
      idCita: '',
      horaInicio: '',
      horaFin: ''
    })
  }

  useEffect(() => {
    validateDate(selectedCita) ? setCreateDate(true) : setCreateDate(false)
  }, [date])

  return (
    <View style={calendarioStyle.container}>
      <CustomSelector 
          data={ psicologistList || [] }
          value={selectedCita?.idUsuario}
          placeholder='Selecciona tu psicólogo'
          onChange={(user) => setSelectedCita({...selectedCita, idUsuario: user.id, nombre: user.nombre})}
        />
      <CalendarComponent onDayPress={(date) => {
          setDate(date);
          setSelectedCita({...selectedCita, fechaCita: validateDate(selectedCita) ? formatLocalDate(date) : tomorrowDate })
          loadDateEvents(date);
        }} 
        citas={allDates} 
      />
      <FlatList
        data={citas}
        keyExtractor={( item:Cita ) => item.idCita || item.start.toString() }
        contentContainerStyle={{
          ...calendarioStyle.EventsContainer
        }}
        ListHeaderComponent={
          <>
            <Text style={calendarioStyle.txtDate}>{ formattedDate }</Text>
            <AddNewDateComponent disabled={createDate} onPress={() => {
              setShowPopup(true)
              setCreateDate(true)
            }} />
          </>
        }
        renderItem={({item}) => (
          <ViewDatesComponent
            info={item}
            onPress={() => {
              if(item.title === 'reservado') return
              const {idUsuario:idUsuario,title:nombre,start:horaInicio,end:horaFin} = item
              const fechaCita = formattedDate
              const cita: infoCita = {
                idCita: item.idCita,
                idUsuario,
                nombre,
                fechaCita,
                horaInicio: horaInicio.toLocaleTimeString().substring(0,5),
                horaFin:horaFin.toLocaleTimeString().substring(0,5)
              }
              setSelectedCita(cita)
              setShowPopup(true)
            }}
          />
        )}
      />
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={calendarioStyle.darkThemeModal}>
          <View style={calendarioStyle.modalContainer}>
            <CalendarPopUp
              placeholder={"Selecciona un psicologo"}
              patients={userList}
              selectedCita={selectedCita}
              onAccept={async (infoCita) => {
                if(selectedCita.idCita) {
                  await editEvent(infoCita)
                }else {
                  await addEvent(infoCita)
                }
                await loadDates(selectedCita.idUsuario)
                resetSelectedCita()
                setShowPopup(false)
                setCreateDate(false)
              }} 
              onClose={() => {
                resetSelectedCita()
                setShowPopup(false)
                setCreateDate(false)
              }} 
              />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default calendarioPaciente