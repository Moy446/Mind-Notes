import { Redirect } from "expo-router";

export default function Index() {
  return < Redirect href={"/(user)/(paciente)/(tabs)/calendario"} />;
}
