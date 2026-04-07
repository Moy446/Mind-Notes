import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { nameBarStyle } from '@/styles/chat/nameBarStyle';
import { resolveMediaUrl } from '@/core/API/mediaUrl';

interface NameBarProps {
  img?: string;
  name: string;
  onBack?: () => void;
  onPressName?: () => void;
}

export const NameBar: React.FC<NameBarProps> = ({
  img,
  name,
  onBack,
  onPressName,
}) => {
  return (
    <SafeAreaView style={nameBarStyle.container}>
      <View style={nameBarStyle.content}>
        {onBack && (
          <TouchableOpacity style={nameBarStyle.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
        )}

        {img && (
          <Image
            source={{
              uri: resolveMediaUrl(img),
            }}
            style={nameBarStyle.avatar}
          />
        )}

        <TouchableOpacity
          style={nameBarStyle.nameContainer}
          onPress={onPressName}
          disabled={!onPressName}
          activeOpacity={0.7}
        >
          <Text style={nameBarStyle.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={nameBarStyle.status}>En línea</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

