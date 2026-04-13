import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Message } from '@/core/actions/chat/chatService';
import { MaterialIcons } from '@expo/vector-icons';

interface BubbleChatProps {
  message: Message;
  type: 'send' | 'receive';
}

const backendBaseUrl =
  (process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL_ANDROID || '')
    .replace(/\/api$/, '') || 'http://localhost:5000';

const buildFileUrl = (filePath?: string): string | null => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${backendBaseUrl}/${filePath.replace(/^\/+/, '')}`;
};

const BubbleChat: React.FC<BubbleChatProps> = ({ message, type }) => {
  const isFile = message.tipo === 'archivo' && !!message.archivo?.path;

  const handleOpenFile = async () => {
    const url = buildFileUrl(message.archivo?.path);
    if (!url) {
      Alert.alert('Archivo no disponible', 'No se encontro la ruta del archivo.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('No disponible', 'No se puede abrir este archivo en el dispositivo.');
        return;
      }
      await Linking.openURL(url);
    } catch (_error) {
      Alert.alert('Error', 'No se pudo abrir el archivo.');
    }
  };

  return (
    <View
      style={[
        styles.bubbleContainer,
        type === 'send' ? styles.sendContainer : styles.receiveContainer,
      ]}
    >
      {isFile ? (
        <TouchableOpacity
          onPress={handleOpenFile}
          style={[
            styles.bubble,
            styles.fileBubble,
            type === 'send' ? styles.sendBubble : styles.receiveBubble,
          ]}
        >
          <View style={styles.fileRow}>
            <MaterialIcons
              name="attach-file"
              size={18}
              color={type === 'send' ? '#fff' : '#1D4D4F'}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.fileName,
                type === 'send' ? styles.sendText : styles.receiveText,
              ]}
            >
              {message.archivo?.nombre || message.mensaje || 'Archivo'}
            </Text>
          </View>
          <Text
            style={[
              styles.fileHint,
              type === 'send' ? styles.sendText : styles.receiveText,
            ]}
          >
            Toca para abrir
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.bubble,
            type === 'send' ? styles.sendBubble : styles.receiveBubble,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              type === 'send' ? styles.sendText : styles.receiveText,
            ]}
          >
            {message.mensaje}
          </Text>
        </View>
      )}
    </View>
  );
};

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  currentUserRole?: 'psicologo' | 'paciente';
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
  currentUserRole = 'psicologo',
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={true}
    >
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {loading ? 'Cargando mensajes...' : 'No hay mensajes aún'}
          </Text>
        </View>
      ) : (
        messages.map((msg, index) => (
          <BubbleChat
            key={index}
            message={msg}
            type={msg.remitente === currentUserRole ? 'send' : 'receive'}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  sendContainer: {
    justifyContent: 'flex-end',
  },
  receiveContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sendBubble: {
    backgroundColor: '#2973B2',
  },
  receiveBubble: {
    backgroundColor: '#9ACBD0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  fileBubble: {
    minWidth: 180,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  fileHint: {
    marginTop: 6,
    fontSize: 11,
    opacity: 0.9,
  },
  sendText: {
    color: '#fff',
  },
  receiveText: {
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
