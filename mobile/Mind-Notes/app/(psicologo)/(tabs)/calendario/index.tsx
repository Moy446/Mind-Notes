import { FlatList, Modal, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CalendarComponent from '@/components/calendar/calendario'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import { useCalendar } from '@/hooks/useCalendar'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import CalendarPopUp from '@/components/popup/CalendarPopUp'
import { calendarPopUpStyle } from '@/styles/popup/calendar.popUpStyle'
import { infoCita } from '@/core/interfaces/Dates'

interface Cita {
  id: string,
  title:string,
  start: Date,
  end: Date,
  extendedProps: {
    estado: string,
    img: string
  }
}

const CalendarioScreen = () => {

    const { allDates, citas, userList, cargarCitas, addEvent, loadDateEvents, loadUserList } = useCalendar()
    
    const [date, setDate] = useState(new Date())
    const formattedDate = date.toISOString().split('T')[0] // Formato YYYY-MM-DD
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCita, setSelectedCita] = useState<infoCita>({
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
      keyExtractor={( item:Cita ) => item.id.toString()}
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
              const {id:idUsuario,title:nombre,start:horaInicio,end:horaFin} = item
              const fechaCita = date.toISOString().split('T')[0]
              const cita: infoCita = {
                idUsuario,
                nombre,
                fechaCita,
                horaInicio: horaInicio.toISOString().split('T')[1].substring(0,5),
                horaFin: horaFin.toISOString().split('T')[1].substring(0,5)
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
              patients={userList}
              selectedCita={selectedCita}
              onAccept={async (infoCita) => {
                await addEvent(infoCita)
                await cargarCitas()
                setShowPopup(false)
              }} 
              onClose={() => {
                setSelectedCita({
                  idUsuario: '',
                  nombre: '',
                  fechaCita: '',
                  horaInicio: '',
                  horaFin: ''
                })
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