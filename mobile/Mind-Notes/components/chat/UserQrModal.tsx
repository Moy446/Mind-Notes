import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  QRCode  from 'react-native-qrcode-svg';
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
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom']}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.black }}>{title}</Text>
          <Text style={{ marginTop: 6, color: Colors.principal }}>{subtitle}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          {uid ? (
            <View style={{ borderRadius: 12, backgroundColor: Colors.white, padding: 12 }}>
              <QRCode value={uid} size={280} color="#000000" backgroundColor="#FFFFFF" />
            </View>
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