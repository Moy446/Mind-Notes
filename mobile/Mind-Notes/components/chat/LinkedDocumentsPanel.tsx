import React, { useMemo, useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { linkedDocumentsStyle } from '@/styles/chat/linkedDocumentsStyle';

type LinkedFile = {
  _id?: string;
  nombre?: string;
  path?: string;
  type?: string;
};

interface LinkedDocumentsPanelProps {
  materialAdjunto?: LinkedFile[];
  expedientes?: LinkedFile[];
  grabaciones?: LinkedFile[];
  onClose?: () => void;
}

const backendBaseUrl =
  (process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL_ANDROID || '')
    .replace(/\/api$/, '') || 'http://localhost:5000';

const buildFileUrl = (file?: LinkedFile): string | null => {
  if (!file?.path) return null;
  if (file.path.startsWith('http')) return file.path;
  return `${backendBaseUrl}/${file.path.replace(/^\/+/, '')}`;
};

export const LinkedDocumentsPanel = ({
  materialAdjunto,
  expedientes,
  grabaciones,
  onClose,
}: LinkedDocumentsPanelProps) => {
  const [showSupport, setShowSupport] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const currentData = useMemo(() => {
    if (showSupport) return materialAdjunto || [];
    return [...(expedientes || []), ...(grabaciones || [])];
  }, [showSupport, materialAdjunto, expedientes, grabaciones]);

  const maxPage = Math.max(1, Math.ceil(currentData.length / itemsPerPage));
  const currentItems = currentData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const openFile = async (file: LinkedFile) => {
    const url = buildFileUrl(file);
    if (!url) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('No disponible', 'No se puede abrir este archivo en el dispositivo');
        return;
      }
      await Linking.openURL(url);
    } catch (_error) {
      Alert.alert('Error', 'No se pudo abrir el archivo');
    }
  };

  const switchTab = (toSupport: boolean) => {
    if (showSupport === toSupport) return;
    setShowSupport(toSupport);
    setPage(1);
  };

  return (
    <View style={linkedDocumentsStyle.container}>
      <View style={linkedDocumentsStyle.header}>
        <TouchableOpacity onPress={onClose} style={linkedDocumentsStyle.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={linkedDocumentsStyle.tabs}>
          <TouchableOpacity onPress={() => switchTab(false)}>
            <Text style={!showSupport ? linkedDocumentsStyle.activeTab : linkedDocumentsStyle.inactiveTab}>
              Resumenes y grabaciones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchTab(true)}>
            <Text style={showSupport ? linkedDocumentsStyle.activeTab : linkedDocumentsStyle.inactiveTab}>
              Material de apoyo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={showSupport ? linkedDocumentsStyle.lineDown2 : linkedDocumentsStyle.lineDown} />

      <View style={linkedDocumentsStyle.filesContainer}>
        {currentItems.length === 0 ? (
          <Text style={linkedDocumentsStyle.emptyText}>Sin archivos vinculados</Text>
        ) : (
          currentItems.map((item, index) => (
            <TouchableOpacity
              key={item._id || `${item.nombre || 'file'}-${index}`}
              style={linkedDocumentsStyle.fileItem}
              onPress={() => openFile(item)}
            >
              <Text style={linkedDocumentsStyle.fileName} numberOfLines={1}>
                {item.nombre || 'Archivo sin nombre'}
              </Text>
              <Text style={linkedDocumentsStyle.fileType}>{item.type || 'archivo'}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={linkedDocumentsStyle.paginatorContainer}>
        {page > 1 ? (
          <TouchableOpacity style={linkedDocumentsStyle.paginatorButton} onPress={() => setPage((prev) => Math.max(1, prev - 1))}>
            <Text style={linkedDocumentsStyle.paginatorButtonText}>anterior</Text>
          </TouchableOpacity>
        ) : (
          <View style={linkedDocumentsStyle.paginatorPlaceholder} />
        )}

        <Text style={linkedDocumentsStyle.paginatorText}>{page} / {maxPage}</Text>

        {page < maxPage ? (
          <TouchableOpacity style={linkedDocumentsStyle.paginatorButton} onPress={() => setPage((prev) => Math.min(maxPage, prev + 1))}>
            <Text style={linkedDocumentsStyle.paginatorButtonText}>siguiente</Text>
          </TouchableOpacity>
        ) : (
          <View style={linkedDocumentsStyle.paginatorPlaceholder} />
        )}
      </View>
    </View>
  );
};
