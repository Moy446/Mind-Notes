import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CalendarComponent from '@/components/calendar/calendario'
import AddNewDateComponent from '@/components/calendar/AddNewDate'
import { calendarioStyle } from '@/styles/calendario/calendarioStyle'
import { useCalendar } from '@/hooks/useCalendar'
import ViewDatesComponent from '@/components/calendar/ViewDates'
import CalendarPopUp from '@/components/popup/CalendarPopUp'

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

    const { citas, cargarCitas, addEvent } = useCalendar()
    
    const [date, setDate] = useState(new Date())
    const formattedDate = date.toISOString().split('T')[0] // Formato YYYY-MM-DD

    useEffect(() => {
        cargarCitas()
    }, [])

  return (
    <View style={calendarioStyle.container}>
        <CalendarComponent/>
        <FlatList
        data={citas}
        keyExtractor={( item:Cita ) => item.id.toString()}
        contentContainerStyle={{
          ...calendarioStyle.EventsContainer
        }}
        ListHeaderComponent={
          <>
            <Text style={calendarioStyle.txtDate}>{formattedDate }</Text>
            <AddNewDateComponent onPress={addEvent} />
          </>
        }
        renderItem={({item}) => (
          <ViewDatesComponent
            name={item.title}
            hour={item.start.toLocaleTimeString()}
            onPress={addEvent}
          />
        )}
      />
    </View>
  )
}

export default CalendarioScreen