import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NameBarProps {
  img?: string;
  name: string;
  onBack?: () => void;
}

export const NameBar: React.FC<NameBarProps> = ({
  img,
  name,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
        )}

        {img && (
          <Image
            source={{
              uri: img.startsWith('http')
                ? img
                : img === '/src/images/pimg2.png'
                ? 'https://via.placeholder.com/48'
                : `http://localhost:5000/${img}`,
            }}
            style={styles.avatar}
          />
        )}

        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.status}>En línea</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  status: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 2,
  },
});

