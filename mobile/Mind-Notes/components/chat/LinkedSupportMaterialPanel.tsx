import { linkedDocumentsStyle } from '@/styles/chat/linkedDocumentsStyle';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react'
import { View, Text, Linking, Alert, Pressable } from 'react-native'

type LinkedFile = {
    _id?: string;
    nombre?: string;
    path?: string;
    type?: string;
};

interface LinkedSupportMaterialPanelProps {
    materialAdjunto?: LinkedFile[];
    onClose?: () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL 

const buildFileUrl = (file?: LinkedFile): string | null => {
    if (!file?.path) return null;
    if (file.path.startsWith('http')) return file.path;
    return `${BASE_URL}/${file.path.replace(/^\/+/, '')}`;
};

const openFile = async (item:LinkedFile) => {
    try {
        const fileUrl = item.path ? buildFileUrl(item) : null;
        if (!fileUrl) {
            Alert.alert('Error', 'No hay archivo disponible');
            return;
        }
        const extension = item.nombre?.split('.').pop()?.toLowerCase();

        if (!extension){
            Alert.alert('Error', 'No se pudo determinar la extensión del archivo');
            return;
        }

        if (extension === 'pdf') {
            await Linking.openURL(fileUrl);
            return;
        }

        if (['mp3', 'wav', 'aac', 'm4a'].includes(extension)) {
            await Linking.openURL(fileUrl);
            return;
        }

        if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
            await Linking.openURL(fileUrl);
            return;
        }

        await Linking.openURL(fileUrl);

    } catch (error) {
        console.log(error);
        Alert.alert('Error', 'No se pudo abrir el archivo');
    }
}

const LinkedSupportMaterialPanel = ({ materialAdjunto, onClose }: LinkedSupportMaterialPanelProps) => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const currentData = useMemo(() => {
        return materialAdjunto || [];
    }, [materialAdjunto]);
    
    const maxPage = Math.max(1, currentData ? Math.ceil(currentData.length / itemsPerPage) : 0);
    const currentItems = currentData?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <View style={linkedDocumentsStyle.container}>
            <View style={linkedDocumentsStyle.header}>
                <Pressable onPress={onClose} style={linkedDocumentsStyle.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </Pressable>
                <View style={{...linkedDocumentsStyle.tabs, justifyContent: 'center', paddingEnd: 30}}>
                    <Text style={linkedDocumentsStyle.activeTab}>
                        Material de apoyo
                    </Text>
                </View>
            </View>
            
            <View style={linkedDocumentsStyle.lineComplete} />

            <View style={linkedDocumentsStyle.filesContainer}>
                {currentItems.length === 0 ? (
                    <Text style={linkedDocumentsStyle.emptyText}>Sin archivos vinculados</Text>
                ) : (
                    currentItems.map((item, index) => (
                        <Pressable
                            key={item._id || `${item.nombre || 'file'}-${index}`}
                            style={linkedDocumentsStyle.fileItem}
                            onPress={() => { openFile(item) }}
                        >
                        <Text style={linkedDocumentsStyle.fileName} numberOfLines={1}>
                            {item.nombre || 'Archivo sin nombre'}
                        </Text>
                        <Text style={linkedDocumentsStyle.fileType}>{item.type || 'archivo'}</Text>
                        </Pressable>
                    ))
                )}
            </View>

            <View style={linkedDocumentsStyle.paginatorContainer}>
                {page > 1 ? (
                    <Pressable style={linkedDocumentsStyle.paginatorButton} onPress={() => setPage((prev) => Math.max(1, prev - 1))}>
                        <Text style={linkedDocumentsStyle.paginatorButtonText}>anterior</Text>
                    </Pressable>
                    ) : (
                    <View style={linkedDocumentsStyle.paginatorPlaceholder} />
                    )}
            
                    <Text style={linkedDocumentsStyle.paginatorText}>{page} / {maxPage}</Text>
            
                    {page < maxPage ? (
                        <Pressable style={linkedDocumentsStyle.paginatorButton} onPress={() => setPage((prev) => Math.min(maxPage, prev + 1))}>
                            <Text style={linkedDocumentsStyle.paginatorButtonText}>siguiente</Text>
                        </Pressable>
                    ) : (
                        <View style={linkedDocumentsStyle.paginatorPlaceholder} />
                    )}
            </View>
        </View>
    )
}

export default LinkedSupportMaterialPanel