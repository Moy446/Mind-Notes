import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';
import { getNotes } from '../services/api';
import NotesList from '../components/NotesList';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);
      
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Error al cargar las notas');
      console.error('Error fetching notes:', err);
      
      Alert.alert(
        'Error',
        'No se pudieron cargar las notas. Verifica tu conexión a internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotes(true);
  };

  useEffect(() => {
    fetchNotes();
    
    // Actualizar notas cuando se regrese de la pantalla de crear nota
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotes();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>🧠 Mind-Notes</Text>
          <Text style={globalStyles.headerSubtitle}>
            Tu aplicación personal de notas
          </Text>
        </View>
        <View style={globalStyles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={globalStyles.loadingText}>Cargando notas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>🧠 Mind-Notes</Text>
        <Text style={globalStyles.headerSubtitle}>
          Tu aplicación personal de notas
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <NotesList 
          notes={notes} 
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;