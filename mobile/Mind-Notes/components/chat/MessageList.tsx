import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Message } from '@/core/actions/chat/chatService';

interface BubbleChatProps {
  text: string;
  type: 'send' | 'receive';
}

const BubbleChat: React.FC<BubbleChatProps> = ({ text, type }) => {
  return (
    <View
      style={[
        styles.bubbleContainer,
        type === 'send' ? styles.sendContainer : styles.receiveContainer,
      ]}
    >
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
          {text}
        </Text>
      </View>
    </View>
  );
};

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
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
            text={msg.mensaje}
            type={msg.remitente === 'psicologo' ? 'send' : 'receive'}
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
    backgroundColor: '#6366f1',
  },
  receiveBubble: {
    backgroundColor: '#f0f0f0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
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
