import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  obtenerPsicologosVinculados,
  PsicologoVinculado,
  vincularPsicologo,
} from '@/core/actions/chat/vinculacionService';
import { obtenerMensajes, Message, enviarMensaje } from '@/core/actions/chat/chatService';
import { initializeSocket, getSocket, disconnectSocket } from '@/core/API/socketService';
import { ChatSelector, ChatContact } from '@/components/chat/ChatSelector';
import { MessageList } from '@/components/chat/MessageList';
import { MessageField } from '@/components/chat/MessageField';
import { NameBar } from '@/components/chat/NameBar';
import { QrScannerModal } from '@/components/chat/QrScannerModal';
import { chatPsicologoStyle } from '@/styles/chat/chatPsicologoStyle';
import { Colors } from '@/constants/theme';

export default function ChatPacienteScreen() {
  const router = useRouter();
  const { user, status } = UseAuthStore();

  const [psicologos, setPsicologos] = useState<PsicologoVinculado[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showSelector, setShowSelector] = useState(true);

  const [nombreMostrado, setNombreMostrado] = useState('Usuario no seleccionado');
  const [imagenMostrada, setImagenMostrada] = useState('/src/images/pimg2.png');

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [uid, setUid] = useState('');
  const [uidLoading, setUidLoading] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !user) {
      router.replace('/auth/login');
    }
  }, [status, user, router]);

  const loadPsicologos = useCallback(async () => {
    if (!user?.idUsuario) return;
    try {
      setLoading(true);
      const data = await obtenerPsicologosVinculados(user.idUsuario);
      setPsicologos(data);

      if (UseAuthStore.getState().token) {
        initializeSocket(UseAuthStore.getState().token!);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los psicologos vinculados');
    } finally {
      setLoading(false);
    }
  }, [user?.idUsuario]);

  useEffect(() => {
    loadPsicologos();
    return () => {
      disconnectSocket();
    };
  }, [loadPsicologos]);

  const contacts: ChatContact[] = useMemo(
    () =>
      psicologos.map((psi) => ({
        id: psi.idPsicologo,
        nombre: psi.nombrePsicologo || psi.nombre || 'Psicologo',
        fotoPerfil: psi.fotoPerfilPsicologo,
        email: psi.email,
      })),
    [psicologos]
  );

  const handleSelectChat = useCallback(
    async (chatId: string) => {
      if (!user?.idUsuario || chatId === selectedChat) return;

      setSelectedChat(chatId);
      setShowSelector(false);
      setLoadingMessages(true);

      try {
        const mensajes = await obtenerMensajes(chatId, user.idUsuario);
        setMessages(mensajes);

        const psicologo = psicologos.find((p) => p.idPsicologo === chatId);
        if (psicologo) {
          setNombreMostrado(psicologo.nombrePsicologo || psicologo.nombre || 'Psicologo');
          setImagenMostrada(psicologo.fotoPerfilPsicologo || '/src/images/pimg2.png');
        }

        const socket = getSocket();
        if (socket) {
          socket.emit('joinChat', {
            idPsicologo: chatId,
            idPaciente: user.idUsuario,
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
    [selectedChat, user?.idUsuario, psicologos]
  );

  const handleSendMessage = useCallback(
    (message: string) => {
      if (selectedChat && user?.idUsuario) {
        const socket = getSocket();
        if (socket) {
          enviarMensaje(socket, selectedChat, user.idUsuario, message, 'paciente');
        }
      }
    },
    [selectedChat, user?.idUsuario]
  );

  const handleGoBack = useCallback(() => {
    setSelectedChat(null);
    setMessages([]);
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
      const result = await vincularPsicologo(user.idUsuario, normalizedUid);
      Alert.alert('Vinculacion', result?.message || 'Psicologo vinculado exitosamente');
      setUid('');
      setShowLinkModal(false);
      await loadPsicologos();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'No se pudo vincular. Verifica el UID e intenta de nuevo.';
      Alert.alert('Error al vincular', message);
    } finally {
      setUidLoading(false);
    }
  }, [user?.idUsuario, loadPsicologos]);

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
        <ChatSelector
          contacts={contacts}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          loading={false}
          title="Psicologos"
          emptyText="Sin psicologos vinculados"
          onPressLink={() => setShowLinkModal(true)}
        />
      ) : (
        <View style={chatPsicologoStyle.chatContainer}>
          <NameBar img={imagenMostrada} name={nombreMostrado} onBack={handleGoBack} />

          <MessageList
            messages={messages}
            loading={loadingMessages}
            currentUserRole="paciente"
          />

          <MessageField onSendMessage={handleSendMessage} disabled={!selectedChat} />
        </View>
      )}

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
              Ingresa el UID del psicologo (24 caracteres)
            </Text>

            <TextInput
              value={uid}
              onChangeText={setUid}
              maxLength={24}
              autoCapitalize="none"
              placeholder="UID del psicologo"
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
        title="Escanear QR del psicologo"
        subtitle="Escanea el codigo para vincularte automaticamente"
      />
    </SafeAreaView>
  );
}