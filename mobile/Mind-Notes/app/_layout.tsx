//archivo central de todo el proyecto, diria no modificar a menos que ocupemos hacer algo que modifique todas las vistas
import { Colors } from "@/constants/theme";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{backgroundColor:Colors.background, flex: 1}}> 
      <Slot />
    </View>
  )
}
