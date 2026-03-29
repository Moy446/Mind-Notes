import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import CustomSelector from './CustomSelector'
import DatePicker from './DatePicker'
import TimeRangePicker from './timePicker'
import { calendarPopUpStyle } from '@/styles/popup/calendar.popUpStyle'
import { Colors } from '@/constants/theme'

interface Props {
    onClose: () => void;

}

const CalendarPopUp = ({onClose}: Props) => {

    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    return (
        <View>
            <CustomSelector data={[]}/>
            <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
            />
            <TimeRangePicker
                start={start}
                end={end}
                onChange={(s, e) => {
                    setStart(s);
                    setEnd(e);
                }}
            />
            <View style={calendarPopUpStyle.btnContainer}>
                <Pressable style={{...calendarPopUpStyle.btn, backgroundColor: Colors.secondaryButton}} onPress={onClose}>
                    <Text style={calendarPopUpStyle.btnText}>Cancelar</Text>
                </Pressable>
                <Pressable style={{...calendarPopUpStyle.btn, backgroundColor: Colors.primaryButton}}>
                    <Text style={calendarPopUpStyle.btnText}>Aceptar</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default CalendarPopUp