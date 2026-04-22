import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MessageFieldProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onUploadPress?: () => void;
  uploadDisabled?: boolean;
  uploadingFile?: boolean;
}

export const MessageField: React.FC<MessageFieldProps> = ({
  onSendMessage,
  disabled = false,
  onUploadPress,
  uploadDisabled = false,
  uploadingFile = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {onUploadPress ? (
          <TouchableOpacity
            style={[styles.attachButton, (disabled || uploadDisabled) && styles.disabledButton]}
            onPress={onUploadPress}
            disabled={disabled || uploadDisabled}
          >
            <MaterialIcons name={uploadingFile ? 'hourglass-empty' : 'attach-file'} size={20} color="#fff" />
          </TouchableOpacity>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          value={message}
          onChangeText={setMessage}
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.sendButton, disabled && styles.disabledButton]}
          onPress={handleSend}
          disabled={disabled || !message.trim()}
        >
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2973B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#48A6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
