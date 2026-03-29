//archivo central de todo el proyecto, diria no modificar a menos que ocupemos hacer algo que modifique todas las vistas
import { Colors } from "@/constants/theme";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useFonts } from 'expo-font';


export default function RootLayout() {

  const [loaded] = useFonts({
    SairaConMedium: require('../assets/fonts/Saira_Condensed-Medium.ttf'),
    SairaBold: require('../assets/fonts/Saira-Bold.ttf'),
    SairaMedium: require('../assets/fonts/Saira-Medium.ttf'),
    SairaLight: require('../assets/fonts/Saira-Light.ttf'),
    SairaRegular: require('../assets/fonts/Saira-Regular.ttf'),
  })

  useEffect(() => {
    if(loaded){
      SplashScreen.hideAsync()
    }
  }, [loaded])
  
  if(!loaded) {
    return null
  }

  return (
    <View style={{backgroundColor:Colors.background, flex: 1}}> 
      <Slot />
    </View>
  )
}
