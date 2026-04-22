import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { editStyles } from '@/styles/perfil/editStyle'

const EditModal = ({
  open,
  handleClose,
  title,
  currentValue,
  onSave,
  type = "text",
  maxLength
}) => {

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(currentValue || "");
  }, [currentValue, open]);

  const handleSavePress = () => {
    onSave(value);
    handleClose();
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={editStyles.overlay}>
        <View style={editStyles.modalContainer}>
          
          <Text style={editStyles.title}>{title}</Text>

          <TextInput
            style={editStyles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Escribe aquí..."
            keyboardType={type === "email" ? "email-address" : "default"}
            maxLength={maxLength}
          />

          <View style={editStyles.buttons}>
            <TouchableOpacity style={editStyles.btnCancel} onPress={handleClose}>
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={editStyles.btnSave} onPress={handleSavePress}>
              <Text style={{ color: "#fff" }}>Guardar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default EditModal;