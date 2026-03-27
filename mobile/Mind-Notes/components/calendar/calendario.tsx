import React from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { calendarioStyle } from '@/styles/calendario/calendarioStyle';
import { Colors } from '@/constants/theme';

const CalendarComponent = () => {
    const currentDate = new Date().toISOString().split('T')[0];
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

        // 🔥 eventos + selección
        markedDates={{
          '2026-03-09': {
            marked: true,
            dotColor: '#2F6BFF',
          },
          '2026-03-20': {
            marked: true,
            dotColor: '#2F6BFF',
          },
          '2026-03-24': {
            marked: true,
            dotColor: '#2F6BFF',
          },
        }}
            style={calendarioStyle.selectedDay}
        />
    </View>
  )
}

export default CalendarComponent