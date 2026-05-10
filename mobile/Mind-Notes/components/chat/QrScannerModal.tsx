import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onCodeScanned: (code: string) => void;
  title?: string;
  subtitle?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  onCodeScanned,
  title = 'Escanear QR',
  subtitle = 'Apunta la camara al codigo QR para vincular',
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!visible) setScanned(false);
  }, [visible]);

  const handleCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      onCodeScanned(data);
    },
    [scanned, onCodeScanned]
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }} edges={['top', 'bottom']}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, backgroundColor: Colors.white }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.black }}>{title}</Text>
          <Text style={{ marginTop: 6, color: Colors.principal }}>{subtitle}</Text>
        </View>

        {!permission ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        ) : !permission.granted ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: Colors.white, textAlign: 'center', marginBottom: 16 }}>
              Se requiere permiso de camara para escanear el QR.
            </Text>
            <TouchableOpacity
              onPress={requestPermission}
              style={{
                backgroundColor: Colors.principal,
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: Colors.white, fontWeight: '700' }}>Dar permiso</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleCodeScanned}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: 14,
            backgroundColor: Colors.white,
          }}
        >
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={{
              borderWidth: 1,
              borderColor: Colors.principal,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <Text style={{ color: Colors.principal, fontWeight: '700' }}>Reescanear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              onClose();
            }}
            style={{
              backgroundColor: Colors.principal,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 18,
            }}
          >
            <Text style={{ color: Colors.white, fontWeight: '700' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
