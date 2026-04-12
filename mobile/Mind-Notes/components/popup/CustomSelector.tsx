import { resolveMediaUrl } from "@/core/API/mediaUrl";
import { calendarPopUpStyle } from "@/styles/popup/calendar.popUpStyle";
import { useState } from "react";
import { Image, Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";

interface Data {
    id: string
    nombre:string
    img: string
}

interface Props {
    data?: Data[]
    value?: string
    onChange?: (value: Data) => void
    placeholder: string
}

const CustomSelector = ({ data, value, onChange, placeholder }: Props) => {
    return (
        <Dropdown
            style={calendarPopUpStyle.selector}
            data={data || []}
            labelField="nombre"
            valueField="id"
            value={ value }
            placeholder={placeholder}
            onChange={item => {
                onChange && onChange(item)
            }}
            renderItem={(item) => (
                <View style={calendarPopUpStyle.renderItemContainer}>
                    <Image source={item.img?.includes('userDefault')
                        ? require('../../assets/images/userDefault.png')
                        : { uri: resolveMediaUrl(item.img )}} style={{ width: 30, height: 30 }} 
                    />
                    <Text>{item.nombre}</Text>
                </View>
            )}
        />
    )
}

export default CustomSelector