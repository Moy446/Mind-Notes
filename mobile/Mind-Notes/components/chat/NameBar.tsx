import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { nameBarStyle } from '@/styles/chat/nameBarStyle';
import { resolveMediaUrl } from '@/core/API/mediaUrl';
import * as Haptics from 'expo-haptics'

interface NameBarProps {
  img?: string;
  name: string;
  onBack?: () => void;
  onPressName?: () => void;
  onMoreOptions: () => void;
}

export const NameBar: React.FC<NameBarProps> = ({
  img,
  name,
  onBack,
  onPressName,
  onMoreOptions,
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
        <Pressable style={({pressed}) =>({
          opacity: pressed ? 0.6 : 1,})}
          onPress={() => {
            Haptics.selectionAsync()
            onMoreOptions()
          }}
        >
          <Ionicons name='ellipsis-vertical-outline' size={24} color="gray" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

