import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UseAuthStore } from '@/store/auth/useAuthStore';
import {
  obtenerPacientesVinculados,
  PacienteVinculado,
  vincularPaciente,
} from '@/core/actions/chat/vinculacionService';
import {
  obtenerMensajes,
  obtenerInformacionChat,
  ChatInfo,
  Message,
  enviarMensaje,
} from '@/core/actions/chat/chatService';
import { initializeSocket, getSocket, disconnectSocket } from '@/core/API/socketService';
import { ChatSelector } from '@/components/chat/ChatSelector';
import { MessageList } from '@/components/chat/MessageList';
import { MessageField } from '@/components/chat/MessageField';
import { NameBar } from '@/components/chat/NameBar';
import { LinkedDocumentsPanel } from '@/components/chat/LinkedDocumentsPanel';
import { QrScannerModal } from '@/components/chat/QrScannerModal';
import { chatPsicologoStyle } from '@/styles/chat/chatPsicologoStyle';
import { Colors } from '@/constants/theme';

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
  const [patientData, setPatientData] = useState<ChatInfo['patientData']>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showLinkedDocuments, setShowLinkedDocuments] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [uid, setUid] = useState('');
  const [uidLoading, setUidLoading] = useState(false);
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
      setShowLinkedDocuments(false);
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
    setShowLinkedDocuments(false);
    setShowSelector(true);
  }, []);

  const ejecutarVinculacion = useCallback(async (uidValue: string) => {
    if (!user?.idUsuario) return;

    const normalizedUid = uidValue.trim();
    if (normalizedUid.length !== 24) {
      Alert.alert('UID invalido', 'El UID debe tener exactamente 24 caracteres.');
      return;
    }

    try {
      setUidLoading(true);
      const result = await vincularPaciente(user.idUsuario, normalizedUid);
      Alert.alert('Vinculacion', result?.message || 'Paciente vinculado exitosamente');
      setUid('');
      setShowLinkModal(false);

      const data = await obtenerPacientesVinculados(user.idUsuario);
      setPacientes(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'No se pudo vincular. Verifica el UID e intenta de nuevo.';
      Alert.alert('Error al vincular', message);
    } finally {
      setUidLoading(false);
    }
  }, [user?.idUsuario]);

  const handleVincular = useCallback(() => {
    ejecutarVinculacion(uid);
  }, [uid, ejecutarVinculacion]);

  const handleScanCode = useCallback(
    (code: string) => {
      const normalizedUid = code.trim();
      setUid(normalizedUid);
      setShowQrScanner(false);
      ejecutarVinculacion(normalizedUid);
    },
    [ejecutarVinculacion]
  );

  if (loading) {
    return (
      <SafeAreaView style={chatPsicologoStyle.container}>
        <View style={chatPsicologoStyle.centerContent}>
          <ActivityIndicator size="large" color={Colors.principal} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={chatPsicologoStyle.container}>
      {!selectedChat || showSelector ? (
        // Vista de selector de pacientes
        <ChatSelector
          contacts={pacientes.map((p) => ({
            id: p.idPaciente,
            nombre: p.nombrePaciente || p.nombre || 'Paciente',
            fotoPerfil: p.fotoPerfilPaciente,
            email: p.email,
          }))}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          loading={false}
          title="Pacientes"
          emptyText="Sin pacientes vinculados"
          onPressLink={() => setShowLinkModal(true)}
        />
      ) : (
        // Vista de chat
        <View style={chatPsicologoStyle.chatContainer}>
          <NameBar
            img={imagenMostrada}
            name={nombreMostrado}
            onBack={handleGoBack}
            onPressName={() => setShowLinkedDocuments((prev) => !prev)}
          />

          <MessageList messages={messages} loading={loadingMessages} />

          <MessageField
            onSendMessage={handleSendMessage}
            disabled={!selectedChat}
          />
        </View>
      )}

      <Modal
        visible={showLinkedDocuments}
        animationType="slide"
        onRequestClose={() => setShowLinkedDocuments(false)}
      >
        <SafeAreaView style={chatPsicologoStyle.container}>
          <LinkedDocumentsPanel
            materialAdjunto={patientData.materialAdjunto}
            expedientes={patientData.expedientes}
            grabaciones={patientData.grabaciones}
            onClose={() => setShowLinkedDocuments(false)}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showLinkModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLinkModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.black }}>Vincular</Text>
            <Text style={{ marginTop: 6, color: Colors.principal }}>
              Ingresa el UID del paciente (24 caracteres)
            </Text>

            <TextInput
              value={uid}
              onChangeText={setUid}
              maxLength={24}
              autoCapitalize="none"
              placeholder="UID del paciente"
              placeholderTextColor="#888"
              style={{
                borderWidth: 1,
                borderColor: '#d8d8d8',
                borderRadius: 10,
                marginTop: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: Colors.black,
              }}
            />

            <TouchableOpacity
              onPress={() => setShowQrScanner(true)}
              disabled={uidLoading}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: Colors.principal,
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: Colors.principal, fontWeight: '700' }}>Escanear con camara</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowLinkModal(false)}
                disabled={uidLoading}
                style={{ paddingVertical: 10, paddingHorizontal: 14 }}
              >
                <Text style={{ color: Colors.principal, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleVincular}
                disabled={uidLoading}
                style={{
                  backgroundColor: Colors.principal,
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  opacity: uidLoading ? 0.7 : 1,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: '700' }}>
                  {uidLoading ? 'Vinculando...' : 'Vincular'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <QrScannerModal
        visible={showQrScanner}
        onClose={() => setShowQrScanner(false)}
        onCodeScanned={handleScanCode}
        title="Escanear QR del paciente"
        subtitle="Escanea el codigo para vincular automaticamente"
      />
    </SafeAreaView>
  );
}