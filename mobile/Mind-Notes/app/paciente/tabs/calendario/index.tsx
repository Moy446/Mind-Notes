import { View, Text, Modal, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import CalendarComponent from '@/components/calendar/calendario'
import { useCalendarPsicologo } from '@/hooks/calendar/useCalendarPsicologo'
import { infoCita } from '@/core/interfaces/Dates'
import CustomSelector from '@/components/popup/CustomSelector'
import { useCalendarPaciente } from '@/hooks/calendar/UseCalendarPaciente'
import CalendarPopUp from '@/components/popup/CalendarPopUp'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { cargarCitasPsicologo } from '@/core/actions/calendario/pacientes/calendarioPaciente.actions'

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

  const { allDates, userList, citas, loadDates , loadUserList, formatLocalDate, loadDateEvents, addEvent, editEvent } = useCalendarPaciente()
  const [date, setDate] = useState(new Date())
  const formattedDate = formatLocalDate(date) // Formato YYYY-MM-DD
  const [showPopup, setShowPopup] = useState(false);
  const [createDate, setCreateDate] = useState(false)
  const currentDate = formatLocalDate(new Date())
  const [selectedCita, setSelectedCita] = useState<infoCita>({
    idCita: '',
    idUsuario: '',
    nombre: '',
    fechaCita: '',
    horaInicio: '',
    horaFin: ''
  });

  const [selectedPsicologist, setSelectedPsicologist] = useState({
    idUsuario: '',
    nombre: ''
  })

  useEffect(() => {
    loadUserList()
  }, [])
  
  useEffect(() => {
    if(selectedPsicologist.idUsuario) {
      loadDates(selectedPsicologist.idUsuario)
    }
  },[selectedPsicologist])

  const psicologistList = userList

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

  useEffect(() => {
        const currentDateSplit = currentDate.split('-').map(Number);
        const selectedDateSplit = selectedCita.fechaCita.split('-').map(Number);
        if(currentDateSplit[0] > selectedDateSplit[0]){
          setCreateDate(true)
          return
        }
        if(currentDateSplit[0] >= selectedDateSplit[0] && currentDateSplit[1] > selectedDateSplit[1]){
          setCreateDate(true)
          return
        }
        if(currentDateSplit[0] >= selectedDateSplit[0] && currentDateSplit[1] >= selectedDateSplit[1] && currentDateSplit[2] + 1  > selectedDateSplit[2]){
          setCreateDate(true)
          return
        }
        setCreateDate(false)
      }, [date])

  return (
    <View style={calendarioStyle.container}>
      <CustomSelector 
          data={ psicologistList || [] }
          value={selectedCita?.idUsuario}
          placeholder='Selecciona tu psicólogo'
          onChange={(user) => setSelectedPsicologist({...selectedPsicologist, idUsuario: user.id, nombre: user.nombre})}
        />
      <CalendarComponent onDayPress={(date) => {
          setDate(date);
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
            <AddNewDateComponent disabled={createDate} onPress={() => setShowPopup(true)} />
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
                await loadDates(selectedPsicologist.idUsuario)
                await cargarCitasPsicologo(selectedPsicologist.idUsuario)
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

export default calendarioPaciente