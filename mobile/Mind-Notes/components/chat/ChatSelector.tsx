import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { chatSelectorStyle } from '@/styles/chat/chatSelectorStyle';
import { Colors } from '@/constants/theme';

export interface ChatContact {
  id: string;
  nombre: string;
  fotoPerfil?: string;
  email?: string;
}

interface ChatSelectorProps {
  contacts: ChatContact[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  loading: boolean;
  title?: string;
  emptyText?: string;
  onPressLink?: () => void;
}

export const ChatSelector: React.FC<ChatSelectorProps> = ({
  contacts,
  selectedChat,
  onSelectChat,
  loading,
  title = 'Contactos',
  emptyText = 'Sin vinculaciones',
  onPressLink,
}) => {
  if (loading) {
    return (
      <View style={chatSelectorStyle.container}>
        <ActivityIndicator size="large" color={Colors.principal} />
      </View>
    );
  }

  return (
    <ScrollView style={chatSelectorStyle.container}>
      <View style={chatSelectorStyle.headerRow}>
        <Text style={chatSelectorStyle.title}>{title}</Text>
        {onPressLink ? (
          <TouchableOpacity
            style={chatSelectorStyle.linkButton}
            onPress={onPressLink}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person-add" size={18} color={Colors.white} />
            <Text style={chatSelectorStyle.linkButtonText}>Vincular</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {contacts.length === 0 ? (
        <Text style={chatSelectorStyle.emptyText}>{emptyText}</Text>
      ) : (
        contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[
              chatSelectorStyle.chatItem,
              selectedChat === contact.id && chatSelectorStyle.selectedItem,
            ]}
            onPress={() => onSelectChat(contact.id)}
          >
            {contact.fotoPerfil && (
              <Image
                source={{
                  uri: contact.fotoPerfil.startsWith('http')
                    ? contact.fotoPerfil
                    : `http://localhost:5000/${contact.fotoPerfil}`,
                }}
                style={chatSelectorStyle.avatar}
              />
            )}
            <View style={chatSelectorStyle.chatInfo}>
              <Text style={chatSelectorStyle.chatName}>{contact.nombre}</Text>
              {contact.email && (
                <Text style={chatSelectorStyle.chatEmail}>{contact.email}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
