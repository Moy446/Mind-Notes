import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UseAuthStore } from '@/store/auth/useAuthStore';
import {
  obtenerPacientesVinculados,
  PacienteVinculado,
} from '@/core/actions/chat/vinculacionService';
import {
  obtenerMensajes,
  obtenerInformacionChat,
  Message,
  enviarMensaje,
} from '@/core/actions/chat/chatService';
import { initializeSocket, getSocket, disconnectSocket } from '@/core/API/socketService';
import { ChatSelector } from '@/components/chat/ChatSelector';
import { MessageList } from '@/components/chat/MessageList';
import { MessageField } from '@/components/chat/MessageField';
import { NameBar } from '@/components/chat/NameBar';

export default function ChatScreen() {
  const router = useRouter();
  const { user, status } = UseAuthStore();

  // Verificar autenticación
  useEffect(() => {
    if (status !== 'authenticated' || !user) {
      router.replace('/auth/login');
    }
  }, [status, user, router]);
  const [pacientes, setPacientes] = useState<PacienteVinculado[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [patientData, setPatientData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [nombreMostrado, setNombreMostrado] = useState('Usuario no seleccionado');
  const [imagenMostrada, setImagenMostrada] = useState('/src/images/pimg2.png');
  const [showSelector, setShowSelector] = useState(true);

  // Inicializar socket y cargar pacientes
  useEffect(() => {
    if (!user?.idUsuario) return;

    const loadPacientes = async () => {
      try {
        setLoading(true);
        const data = await obtenerPacientesVinculados(user.idUsuario);
        setPacientes(data);

        if (UseAuthStore.getState().token) {
          initializeSocket(UseAuthStore.getState().token!);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los pacientes');
      } finally {
        setLoading(false);
      }
    };

    loadPacientes();

    return () => {
      disconnectSocket();
    };
  }, [user?.idUsuario]);

  // Manejar selección de chat
  const handleSelectChat = useCallback(
    async (chatId: string) => {
      if (chatId === selectedChat) return;

      setSelectedChat(chatId);
      setShowSelector(false);
      setLoadingMessages(true);

      try {
        const mensajes = await obtenerMensajes(user!.idUsuario, chatId);
        setMessages(mensajes);

        const info = await obtenerInformacionChat(user!.idUsuario, chatId);
        setPatientData(info.patientData);

        const paciente = pacientes.find((p) => p.idPaciente === chatId);
        if (paciente) {
          setNombreMostrado(paciente.nombrePaciente || paciente.nombre || 'Usuario');
          let foto = paciente.fotoPerfilPaciente || '/src/images/pimg2.png';
          if (
            foto &&
            foto !== '/src/images/pimg2.png' &&
            !foto.startsWith('http') &&
            !foto.startsWith('/')
          ) {
            foto = `http://localhost:5000/${foto}`;
          }
          setImagenMostrada(foto);
        }

        const socket = getSocket();
        if (socket) {
          socket.emit('joinChat', {
            idPsicologo: user!.idUsuario,
            idPaciente: chatId,
          });

          socket.off('receiveMessage');
          socket.on('receiveMessage', (newMessage: Message) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el chat');
      } finally {
        setLoadingMessages(false);
      }
    },
    [selectedChat, user, pacientes]
  );

  // Manejar envío de mensajes
  const handleSendMessage = useCallback(
    (message: string) => {
      if (selectedChat && user) {
        const socket = getSocket();
        if (socket) {
          enviarMensaje(socket, user.idUsuario, selectedChat, message);
        }
      }
    },
    [selectedChat, user]
  );

  // Ir atrás
  const handleGoBack = useCallback(() => {
    setSelectedChat(null);
    setMessages([]);
    setShowSelector(true);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!selectedChat || showSelector ? (
        // Vista de selector de pacientes
        <ChatSelector
          pacientes={pacientes}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          loading={false}
        />
      ) : (
        // Vista de chat
        <View style={styles.chatContainer}>
          <NameBar
            img={imagenMostrada}
            name={nombreMostrado}
            onBack={handleGoBack}
          />

          <MessageList messages={messages} loading={loadingMessages} />

          <MessageField
            onSendMessage={handleSendMessage}
            disabled={!selectedChat}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});