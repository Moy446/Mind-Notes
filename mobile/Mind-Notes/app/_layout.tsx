//archivo central de todo el proyecto, diria no modificar a menos que ocupemos hacer algo que modifique todas las vistas
import { Slot } from "expo-router";

export default function RootLayout() {
  return <Slot />;
}
