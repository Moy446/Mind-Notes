import React, { useState } from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { calendarioStyle } from '@/styles/calendario/calendarioStyle';
import { Colors } from '@/constants/theme';

  type CitaCalendar = {
    idCita: string;
    idUsuario: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      estado: string;
      img: string;
    };
  };

interface Props {
  citas?: CitaCalendar[];
  onDayPress?: (date: Date) => void;
}
const formatLocaleDate = (date:Date) => {
    
    return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');

  }


const getMarkedDates = (
  citas?: CitaCalendar[],
  selectedDate?: string
) => {
  const markedDates: { [key: string]: any } = {};

  citas?.forEach((cita) => {
    const formattedDate = formatLocaleDate(cita.start);

    markedDates[formattedDate] = {
      marked: true,
      dotColor: Colors.principal,
    };
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}), // mantiene el dot si existe
      selected: true,
      selectedColor: Colors.primaryButton,
      selectedTextColor: '#fff',
    };
  }

  return markedDates;
};

const CalendarComponent = ({ citas, onDayPress }: Props) => {

  const currentDate = formatLocaleDate(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);
  const markedDates = getMarkedDates(citas, selectedDate);
  return (
    <View >
        <Calendar
            current={currentDate}
            theme={{
              backgroundColor: Colors.background,
              calendarBackground: Colors.background,
              textSectionTitleColor: Colors.principal,
              dayTextColor: Colors.principal,
              todayTextColor: Colors.principal,

              monthTextColor: Colors.principal,
              textDayHeaderFontFamily: 'Saria-Light',
              textMonthFontWeight: 'bold',
              textMonthFontSize: 16,
              arrowColor: Colors.principal,
              textDayFontSize: 14,

              dotStyle: calendarioStyle.dotStyle,          
              todayBackgroundColor: Colors.secondaryButton,
              
              selectedDayBackgroundColor: Colors.principal,
              selectedDayTextColor: '#fff',
          }}
          onDayPress={(day)=>{
            const [year, month, dayNum] = day.dateString.split('-').map(Number);
            const selected = new Date(year, month - 1, dayNum);
            setSelectedDate(formatLocaleDate(selected));
            onDayPress && onDayPress(selected);
          }}    
          markedDates={markedDates}
          style={calendarioStyle.selectedDay}
        />
    </View>
  )
}

export default CalendarComponent