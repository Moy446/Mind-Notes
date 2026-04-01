import { FlatList, Modal, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CalendarComponent from '@/components/calendar/calendario'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import { useCalendar } from '@/hooks/useCalendar'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import CalendarPopUp from '@/components/popup/CalendarPopUp'
import { calendarPopUpStyle } from '@/styles/popup/calendar.popUpStyle'
import { infoCita } from '@/core/interfaces/Dates'

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

  

  const { allDates, citas, userList, cargarCitas, addEvent, editEvent, loadDateEvents, loadUserList, formatLocalDate } = useCalendar()
    
  const [date, setDate] = useState(new Date())
  const formattedDate = formatLocalDate(date) // Formato YYYY-MM-DD
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCita, setSelectedCita] = useState<infoCita>({
    idCita: '',
    idUsuario: '',
    nombre: '',
    fechaCita: '',
    horaInicio: '',
    horaFin: ''
  });

    useEffect(() => {
        cargarCitas()
        loadUserList('psicologo')
    }, [])

    useEffect(() => {
      if(allDates.length > 0) {
        loadDateEvents(date)
      }
    },[allDates])

    const resetSelectedCita = useCallback(() => {
      setSelectedCita({
        idCita: '',
        idUsuario: '',
        nombre: '',
        fechaCita: '',
        horaInicio: '',
        horaFin: ''
      })
    },[])

  return (
    <View style={calendarioStyle.container}>
      
      <CalendarComponent onDayPress={(date) => {
          setDate(date);
          loadDateEvents(date);
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
            <AddNewDateComponent onPress={() => setShowPopup(true)} />
          </>
        }
        renderItem={({item}) => (
          <ViewDatesComponent
            info={item}
            onPress={() => {
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
              console.log(cita)
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
              }} 
              onClose={() => {
                resetSelectedCita()
                setShowPopup(false)
              }} 
              />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default CalendarioScreen