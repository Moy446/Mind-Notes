import React from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { calendarioStyle } from '@/styles/calendario/calendarioStyle';
import { Colors } from '@/constants/theme';

  type CitaCalendar = {
    id: string;
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

const getDate = (citas?: CitaCalendar[]) => {
  const markedDates: { [key: string]: any } = {};
  citas?.forEach((cita) => {
    const fecha = cita.start;
    const formattedDate = fecha.toISOString().split('T')[0];
    markedDates[formattedDate] = {
      marked: true,
      dotColor: Colors.principal,
    };
  })
  return markedDates;
}

const CalendarComponent = ({ citas, onDayPress }: Props) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const markedDates = getDate(citas);
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
          }}
          onDayPress={(day)=>{
            const selected = new Date(day.dateString);
            onDayPress && onDayPress(selected);
          }}    
          markedDates={markedDates}
          style={calendarioStyle.selectedDay}
        />
    </View>
  )
}

export default CalendarComponent