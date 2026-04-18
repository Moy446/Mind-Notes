import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const editStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.principal,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancel: {
    padding: 10,
  },
  btnSave: {
    backgroundColor: Colors.principal,
    padding: 10,
    borderRadius: 5,
  },
});