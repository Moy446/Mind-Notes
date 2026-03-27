import { useState } from "react";
import { Image, Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";

interface Data {
    id: string
    name:string
    image: string
}

interface Props {
    data: Data[]
}


const CustomSelector = ({ data }: Props) => {
    const [value, setValue] = useState(null);

    return (
        <Dropdown
            style={{ height: 50, borderRadius: 10, paddingHorizontal: 10 }}
            data={data || []}
            labelField="name"
            valueField="id"
            value={value}
            onChange={item => setValue(item.id)}
            renderItem={(item) => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Image source={{ uri: item.image }} style={{ width: 24, height: 24 }} />
                    <Text>{item.name}</Text>
                </View>
            )}
        />
    )
}

export default CustomSelector