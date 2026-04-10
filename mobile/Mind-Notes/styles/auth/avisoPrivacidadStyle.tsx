import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const APstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'SairaBold',
    fontSize: 22,
    marginBottom: 10,
  },
  fecha: {
    fontFamily: 'SairaRegular',
    fontSize: 12,
    color: 'gray',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'SairaConMedium',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  parrafo: {
    fontFamily: 'SairaRegular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  listItem: {
    fontFamily: 'SairaRegular',
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'SairaBold',
    fontWeight: 'bold',
  },
});