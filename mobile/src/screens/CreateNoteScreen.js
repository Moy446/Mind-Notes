import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { createNote } from '../services/api';

const CreateNoteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert(
        'Campos requeridos',
        'Por favor completa el título y contenido de la nota.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      await createNote(title.trim(), content.trim());
      
      Alert.alert(
        'Éxito',
        'Nota creada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert(
        'Error',
        'No se pudo crear la nota. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>✍️ Nueva Nota</Text>
          <Text style={globalStyles.headerSubtitle}>
            Crea una nueva nota
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={globalStyles.card}>
            <Text style={globalStyles.title}>Título</Text>
            <TextInput
              style={[
                globalStyles.input,
                titleFocused && globalStyles.inputFocused,
              ]}
              placeholder="Escribe el título de tu nota..."
              value={title}
              onChangeText={setTitle}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              maxLength={100}
            />

            <Text style={globalStyles.title}>Contenido</Text>
            <TextInput
              style={[
                globalStyles.input,
                contentFocused && globalStyles.inputFocused,
                { minHeight: 120, textAlignVertical: 'top' },
              ]}
              placeholder="Escribe el contenido de tu nota..."
              value={content}
              onChangeText={setContent}
              onFocus={() => setContentFocused(true)}
              onBlur={() => setContentFocused(false)}
              multiline
              numberOfLines={6}
            />

            <TouchableOpacity
              style={[
                globalStyles.button,
                loading && { opacity: 0.7 },
              ]}
              onPress={handleCreateNote}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={globalStyles.buttonText}>Crear Nota</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateNoteScreen;