import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { calendarPopUpStyle } from "@/styles/popup/calendar.popUpStyle";

interface Props {
    start: string;
    end: string;
    onChange: (start: string, end: string) => void;
}

const TimeRangePicker = ({ start, end, onChange }: Props) => {
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const formatTime = (date: Date) => {
        return date.toTimeString().slice(0, 5); // HH:mm
    };

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const isAfter = (t1: string, t2: string) => {
        return timeToMinutes(t1) > timeToMinutes(t2);
    };

    return (
        <View style={calendarPopUpStyle.timePickerContainer}>
            {/* Hora inicio */}
            <Pressable
                onPress={() => setShowStart(true)}
                style={calendarPopUpStyle.timePicker}
            >
                <Text>{start || "Hora inicio"}</Text>
            </Pressable>

            {showStart && (
                <DateTimePicker
                    mode="time"
                    value={new Date()}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                        setShowStart(Platform.OS === "ios");
                        if (date) {
                            const newStart = formatTime(date);
                            if (isAfter(newStart, end)) {
                                alert("La hora inicio debe ser antes de la hora fin");
                                return;
                            }
                            onChange(newStart, end);
                        }
                    }}
                />
            )}

            {/* Hora fin */}
            <Pressable
                onPress={() => setShowEnd(true)}
                style={calendarPopUpStyle.timePicker}
            >
                <Text>{end || "Hora fin"}</Text>
            </Pressable>

            {showEnd && (
                <DateTimePicker
                    mode="time"
                    value={new Date()}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                        setShowEnd(Platform.OS === "ios");
                        if (date) {
                            const newEnd = formatTime(date);
                            if (isAfter(start, newEnd)) {
                                alert("La hora fin debe ser después de la hora inicio");
                                return;
                            }
                            onChange(start, newEnd);
                        }
                    }}
                />
            )}
        </View>
    );
};

export default TimeRangePicker;