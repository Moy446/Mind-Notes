import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { router, useLocalSearchParams } from 'expo-router'
import { UseAuthStore } from '@/store/auth/useAuthStore'
import { obtenerDocumento, guardarDocumento } from '@/core/actions/documento/documento.actions'
import { documentStyle } from '@/styles/document/documentStyle'

const DocumentScreen = () => {

  const { idDoc, idPat } = useLocalSearchParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = UseAuthStore();
  const [doc, setDoc] = useState("");

  useEffect(() => {
    const getArchivo = async () => {
      if (!idDoc || !idPat || !user?.idUsuario) return;

      try {
        setLoading(true);
        const data = await obtenerDocumento(user.idUsuario, idPat, idDoc);

        if (data) {
          setContent(data.content);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        console.log(content)
      }
    };

    getArchivo();
  }, [idDoc, idPat, user]);

  const handleGuardar = async () => {
    try {
      const response = await guardarDocumento(
        user?.idUsuario,
        idPat,
        idDoc,
        content
      );

      if (response?.success) {
        Alert.alert("Éxito", "Documento guardado");
      } else {
        Alert.alert("Error", response?.message || "No se pudo guardar");
      }

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el documento");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={documentStyle.container}>

        <View style={documentStyle.header}>
          <Pressable onPress={() => router.push('/psicologo/tabs/perfil')}>
            <MaterialIcons name="arrow-back" size={40} color={Colors.white} />
          </Pressable>
          <Text style={documentStyle.textTitle}>Editor</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TextInput
            style={documentStyle.documentText}
            placeholder="Empieza a escribir..."
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </ScrollView>

        <Pressable style={documentStyle.fab} onPress={handleGuardar}>
          <MaterialIcons name="save" size={28} color="#fff" />
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
};

export default DocumentScreen;