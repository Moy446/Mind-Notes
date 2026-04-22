import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

interface UserQrModalProps {
  visible: boolean;
  onClose: () => void;
  uid?: string;
  title: string;
  subtitle: string;
}

export const UserQrModal: React.FC<UserQrModalProps> = ({
  visible,
  onClose,
  uid,
  title,
  subtitle,
}) => {
  const qrUrl = useMemo(() => {
    if (!uid) return null;
    const data = encodeURIComponent(uid);
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${data}`;
  }, [uid]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom']}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.black }}>{title}</Text>
          <Text style={{ marginTop: 6, color: Colors.principal }}>{subtitle}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          {qrUrl ? (
            <Image
              source={{ uri: qrUrl }}
              style={{ width: 280, height: 280, borderRadius: 12, backgroundColor: Colors.white }}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ color: Colors.black }}>No se pudo generar el QR</Text>
          )}

          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: Colors.white,
            }}
          >
            <Text style={{ color: Colors.black, fontWeight: '600' }}>{uid || 'UID no disponible'}</Text>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: Colors.principal,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: Colors.white, fontWeight: '700' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};