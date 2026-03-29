import { calendarPopUpStyle } from "@/styles/popup/calendar.popUpStyle";
import React, { useState } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";

interface Props {
    value?: string;
    onChange: (date: string) => void;
}

const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const DatePicker = ({ value, onChange }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <View>
            <Pressable
                onPress={() => setVisible(true)}
                style={calendarPopUpStyle.datePicker}
            >
                <Text>
                    {value ? value : "Seleccionar fecha"}
                </Text>
            </Pressable>

            <Modal visible={visible} transparent animationType="slide">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 10,
                        }}
                    >
                        <Calendar
                            minDate={getTomorrowDate()}
                            onDayPress={(day) => {
                                onChange(day.dateString);
                                setVisible(false);
                            }}
                            markedDates={{
                                [value || ""]: {
                                    selected: true,
                                    selectedColor: "#00adf5",
                                },
                            }}
                        />

                        <Pressable
                            onPress={() => setVisible(false)}
                            style={{ marginTop: 10 }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePicker;