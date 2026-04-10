import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { PacienteVinculado } from '@/core/actions/chat/vinculacionService';

interface ChatSelectorProps {
  pacientes: PacienteVinculado[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  loading: boolean;
}

export const ChatSelector: React.FC<ChatSelectorProps> = ({
  pacientes,
  selectedChat,
  onSelectChat,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>
      {pacientes.length === 0 ? (
        <Text style={styles.emptyText}>Sin pacientes vinculados</Text>
      ) : (
        pacientes.map((paciente) => (
          <TouchableOpacity
            key={paciente.idPaciente}
            style={[
              styles.chatItem,
              selectedChat === paciente.idPaciente && styles.selectedItem,
            ]}
            onPress={() => onSelectChat(paciente.idPaciente)}
          >
            {paciente.fotoPerfilPaciente && (
              <Image
                source={{
                  uri: paciente.fotoPerfilPaciente.startsWith('http')
                    ? paciente.fotoPerfilPaciente
                    : `http://localhost:5000/${paciente.fotoPerfilPaciente}`,
                }}
                style={styles.avatar}
              />
            )}
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>
                {paciente.nombrePaciente || paciente.nombre}
              </Text>
              {paciente.email && (
                <Text style={styles.chatEmail}>{paciente.email}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#e0e7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  chatEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 32,
  },
});
