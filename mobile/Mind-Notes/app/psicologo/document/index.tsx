import { View, Text, Pressable, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'
import { router, useLocalSearchParams  } from 'expo-router'

import { documentStyle } from '@/styles/document/documentStyle'

const DocumentScreen = () => {

    const { path } = useLocalSearchParams();

    return (
        <View style={documentStyle.container}>
            <View style={documentStyle.header}>
                <Pressable onPress={() => router.push('/psicologo/tabs/perfil')} >
                    <MaterialIcons name="arrow-back" size={40} color={Colors.white} />
                </Pressable>
                <Text style={documentStyle.textTitle}>Document Blabla</Text>
            </View>
            <ScrollView>
                <Text style={documentStyle.documentText}>Path: {path}</Text>
            </ScrollView>
        </View>
    )
}

export default DocumentScreen