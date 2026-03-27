import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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

    return (
        <View style={{ gap: 10 }}>
            {/* Hora inicio */}
            <Pressable
                onPress={() => setShowStart(true)}
                style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}
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
                            onChange(newStart, end);
                        }
                    }}
                />
            )}

            {/* Hora fin */}
            <Pressable
                onPress={() => setShowEnd(true)}
                style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}
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
                            onChange(start, newEnd);
                        }
                    }}
                />
            )}
        </View>
    );
};

export default TimeRangePicker;