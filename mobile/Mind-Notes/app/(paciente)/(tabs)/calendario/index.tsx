import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import CalendarComponent from '@/components/calendar/calendario'
import { useCalendar } from '@/hooks/useCalendar'
import { infoCita } from '@/core/interfaces/Dates'
import CustomSelector from '@/components/popup/CustomSelector'

const calendarioPaciente = () => {

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
    const [selectedPsicologist, setSelectedPsicologist] = useState({
      idUsuario: '',
      nombre: ''
    })



  return (
    <View style={calendarioStyle.container}>
      <CustomSelector 
          data={ [] }
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
    </View>
  )
}

export default calendarioPaciente