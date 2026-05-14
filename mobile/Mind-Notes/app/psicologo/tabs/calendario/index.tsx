import { FlatList, Modal, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CalendarComponent from '@/components/calendar/calendario'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import { useCalendarPsicologo } from '@/hooks/calendar/useCalendarPsicologo'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import CalendarPopUp from '@/components/popup/CalendarPopUp'
import { infoCita } from '@/core/interfaces/Dates'
import { useFocusEffect } from 'expo-router'

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

const CalendarioScreen = () => {

  

  const { allDates, citas, userList, tomorrowDate, validateDate, cargarCitas, addEvent, editEvent, loadDateEvents, loadUserList, formatLocalDate } = useCalendarPsicologo()
    
  const [date, setDate] = useState(new Date())
  const formattedDate = formatLocalDate(date) // Formato YYYY-MM-DD
  const [showPopup, setShowPopup] = useState(false);
  const [createDate, setCreateDate] = useState(false)
  const [selectedCita, setSelectedCita] = useState<infoCita>({
    idCita: '',
    idUsuario: '',
    nombre: '',
    fechaCita: tomorrowDate,
    horaInicio: '',
    horaFin: ''
  });

  useFocusEffect(
    useCallback(() => {
      cargarCitas()
      loadUserList()
    }, [])
  )

    useEffect(() => {
      if(allDates.length > 0) {
        loadDateEvents(date)
      }
    },[allDates])

    const resetSelectedCita = useCallback(() => {
      setSelectedCita(prev => ({
        ...prev,
        idCita: '',
        idUsuario: '',
        nombre: '',
        horaInicio: '',
        horaFin: ''
      }))
    },[])
    
    useEffect(() => {
        loadDateEvents(date)
    }, [allDates, date])
    
    useEffect(() => {
      validateDate(formattedDate) ? setCreateDate(true) : setCreateDate(false)
    }, [date])
    
  return (
    <View style={calendarioStyle.container}>
      
      <CalendarComponent onDayPress={(selectedDate) => {
          setDate(selectedDate);
          const formattedSelectedDate = formatLocalDate(selectedDate);
          setSelectedCita(prev => ({ ...prev, fechaCita: validateDate(formattedSelectedDate) ? tomorrowDate : formattedSelectedDate }));
          loadDateEvents(selectedDate);
        }} 
        citas={allDates} 
      />
      <FlatList
      data={citas}
      keyExtractor={( item:Cita ) => item.idCita.toString()}
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
              const {idUsuario:idUsuario,title:nombre,start:horaInicio,end:horaFin} = item
              const fechaCita = selectedCita.fechaCita
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
              placeholder={"Selecciona un paciente"}
              patients={userList}
              selectedCita={selectedCita}
              onAccept={async (infoCita) => {
                if(selectedCita.idCita) {
                  await editEvent(infoCita)
                }else {
                  await addEvent(infoCita)
                }
                await cargarCitas()
                resetSelectedCita()
                setShowPopup(false)
                setCreateDate(validateDate(formattedDate))
              }} 
              onClose={() => {
                resetSelectedCita()
                setShowPopup(false)
                setCreateDate(validateDate(formattedDate))
              }} 
              />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CalendarioScreen