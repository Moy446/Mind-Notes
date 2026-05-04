import React, { useState } from 'react'
import { View, Text, Pressable, PressableProps, Image, Alert, Linking, ActivityIndicator } from 'react-native'
import * as Haptics from 'expo-haptics'
import { planesStyle } from '@/styles/perfil/planesStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme'
import Svg, { Path } from 'react-native-svg'
import { clienteAxios } from '@/core/API/clienteAxios'
import { UseAuthStore } from '@/store/auth/useAuthStore'


interface Props {
    //Metodos
    onClose: () => void;
}

const PlanesComponent = ({ onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const { user, status } = UseAuthStore();

    const isAuthenticated = status === 'authenticated' && user;

    const handleCheckout = async (plan: string) => {
        if (loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (!isAuthenticated) {
            Alert.alert('No autenticado', 'Debes iniciar sesión para contratar un plan.');
            return;
        }

        try {
            setLoading(true);
            const { data } = await clienteAxios.post('/psicologo/checkout', { plan });
            if (data?.success && data?.url) {
                const url = data.url;
                // Abrir checkout en navegador externo / webview
                await Linking.openURL(url);
                return;
            }

            Alert.alert('Error', data?.error || 'No se pudo iniciar el pago');
        } catch (error: any) {
            console.error('Error crear sesión de pago (mobile):', error?.message || error);
            Alert.alert('Error', 'Ocurrió un error al procesar el pago');
        } finally {
            setLoading(false);
        }
    }

    const handleCancelSubscription = async () => {
        if (loading) return;
        if (!isAuthenticated) {
            Alert.alert('No autenticado', 'Debes iniciar sesión para cancelar tu suscripción.');
            return;
        }

        try {
            setLoading(true);
            const { data: statusResp } = await clienteAxios.post(`/psicologo/suscripcion/${user?.idUsuario}`);
            const hasSubscription = statusResp?.suscripcion === true || statusResp?.suscripcion === 'true';
            if (!hasSubscription) {
                Alert.alert('Información', 'No tienes una suscripción activa para cancelar');
                return;
            }

            Alert.alert('Confirmar', '¿Deseas cancelar tu suscripción?', [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    onPress: async () => {
                        try {
                            const { data } = await clienteAxios.post('/psicologo/cancel-subscription');
                            if (data?.success) {
                                Alert.alert('Éxito', 'Suscripción cancelada exitosamente');
                            } else {
                                Alert.alert('Error', data?.error || 'No se pudo cancelar la suscripción');
                            }
                        } catch (err: any) {
                            console.error('Error cancelar suscripcion (mobile):', err?.message || err);
                            Alert.alert('Error', 'Ocurrió un error al cancelar la suscripción');
                        }
                    }
                }
            ]);
        } catch (err: any) {
            console.error('Error obtener estado suscripcion (mobile):', err?.message || err);
            Alert.alert('Error', 'No se pudo verificar el estado de la suscripción');
        } finally {
            setLoading(false);
        }
    }
    return (
        <View style={planesStyle.container}>
            <View style={planesStyle.header}>
                <Pressable onPress={onClose} >
                    <MaterialIcons name="arrow-back" size={35} color={Colors.principal} />
                </Pressable>
            </View>
            <Pressable style={planesStyle.planSmall} onPress={() => handleCheckout('unMes')} disabled={loading}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPrice}>USD$10</Text>
                    <Text style={planesStyle.txtTime}>1 Mes</Text>
                </View>
            </Pressable>

            <Pressable style={planesStyle.planMedium} onPress={() => handleCheckout('seisMeses')} disabled={loading}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPriceSecondary}>USD$45</Text>
                    <Text style={planesStyle.txtTimeSecondary}>6 Meses</Text>
                </View>
            </Pressable>

            <Pressable style={planesStyle.planBig} onPress={() => handleCheckout('unYear')} disabled={loading}>
                <Image source={require('../../assets/images/logowithe.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPriceSecondary}>USD$80</Text>
                    <Text style={planesStyle.txtTimeSecondary}>1 año</Text>
                </View>
            </Pressable>

            <View style={{ marginTop: 16 }}>
                <Pressable onPress={handleCancelSubscription} style={{ alignItems: 'center' }}>
                    {loading ? <ActivityIndicator color={Colors.principal} /> : <Text style={{ color: 'red', fontFamily: 'SairaBold', fontSize: 18 }}>Cancelar suscripción</Text>}
                </Pressable>
            </View>
        </View>
    )
}

export default PlanesComponent