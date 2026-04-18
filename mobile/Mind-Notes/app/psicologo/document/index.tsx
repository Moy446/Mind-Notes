import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { router, useLocalSearchParams } from 'expo-router'
import { UseAuthStore } from '@/store/auth/useAuthStore'
import { obtenerDocumento } from '@/core/actions/documento/documento.actions'
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

      </View>
    </KeyboardAvoidingView>
  );
};

export default DocumentScreen;