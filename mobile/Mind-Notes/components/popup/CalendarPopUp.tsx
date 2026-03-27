import React, { useState } from 'react'
import { View } from 'react-native'
import CustomSelector from './CustomSelector'
import DatePicker from './DatePicker'
import TimeRangePicker from './timePicker'

const CalendarPopUp = () => {

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
        </View>
    )
}

export default CalendarPopUp