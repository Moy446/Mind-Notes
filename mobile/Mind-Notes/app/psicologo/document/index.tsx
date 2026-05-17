import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { use, useEffect, useState} from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { router, useLocalSearchParams } from 'expo-router'
import { UseAuthStore } from '@/store/auth/useAuthStore'
import { obtenerDocumento, guardarDocumento } from '@/core/actions/documento/documento.actions'
import { documentStyle } from '@/styles/document/documentStyle'
import * as FileSystem from 'expo-file-system/legacy';
import mammoth from 'mammoth';

type DocumentScreenParams = {
  idDoc: string;
  idPat: string;
};

const DocumentScreen = () => {

  const { idDoc, idPat  } = useLocalSearchParams<DocumentScreenParams>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = UseAuthStore();

  const loadDocument = async () => {
    console.log("Cargando documento con idDoc:",idDoc,"idPat:",idPat,"userId:",user?.idUsuario);
    if (!idDoc || !idPat || !user?.idUsuario) {
      Alert.alert("Error", "Faltan datos para cargar el documento");
      return;
    }
    try {
      const data = await obtenerDocumento(user.idUsuario,idPat,idDoc);

      if (data?.success) {
        setContent(data.content);
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo cargar el documento");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    try {
      if (!idDoc || !idPat || !user?.idUsuario) {
        Alert.alert("Error", "Faltan datos para guardar el documento");
        return;
      }
      const response = await guardarDocumento(user?.idUsuario,idPat,idDoc,content);

      if (response?.success) {
        Alert.alert("Éxito", "Documento guardado");
      } else {
        Alert.alert("Error", response?.message || "No se pudo guardar");
      }

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el documento");
    }
  };

  useEffect(() => {
    loadDocument();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={documentStyle.container}>

        <View style={documentStyle.header}>
          <Pressable onPress={() => router.back()}>
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

        <Pressable style={documentStyle.fab} disabled={loading} onPress={handleGuardar}>
          <MaterialIcons name="save" size={28} color="#fff" />
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
};

export default DocumentScreen;