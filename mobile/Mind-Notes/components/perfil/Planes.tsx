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
                <Svg
                    viewBox="0 0 24 24"
                    width={30}
                    height={30}
                    fill="red"
                >
                    <Path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </Svg>
            </View>
            <Pressable style={planesStyle.planGratis} onPress={() => handleCheckout('gratis')} disabled={loading}>
                <Image source={require('../../assets/images/logocolor.png')} style={planesStyle.imgPlan} />
                <View style={planesStyle.txtPlan}>
                    <Text style={planesStyle.txtPrice}>Gratis</Text>
                    <Text style={planesStyle.txtTime}>30 Días</Text>
                </View>
            </Pressable>

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
                    {loading ? <ActivityIndicator color={Colors.principal} /> : <Text style={{ color: Colors.black }}>Cancelar suscripción</Text>}
                </Pressable>
            </View>
        </View>
    )
}

export default PlanesComponent