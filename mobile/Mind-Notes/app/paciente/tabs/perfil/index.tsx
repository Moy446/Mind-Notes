import { View, Text, Image, Alert, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Svg, { Path } from 'react-native-svg'
import { UseAuthStore } from '@/store/auth/useAuthStore'
import { router } from 'expo-router'
import * as ImagePicker from "expo-image-picker";
import { cambiarFotoPerfil, actualizarPerfil, eliminarCuenta } from '@/core/actions/perfil/perfil.actions'
import EditModal from '@/components/perfil/Edit'
import DeliteAcountPopUp from '@/components/popup/DeleteAcountPopUp'
import { resolveMediaUrl } from "@/core/API/mediaUrl";
import { perfilStyle } from '@/styles/perfil/perfilStyle'

const perfilPaciente = () => {

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const { user, token } = UseAuthStore();
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    fotoPerfil: '/src/images/testimg.png'
  });
  const [editModal, setEditModal] = useState({ open: false, field: '', title: '', value: '' });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {

    if (user) {
      setUserData({
        nombre: user.nombre || 'Usuario',
        email: user.email || 'correo@ejemplo.com',
        fotoPerfil: user.fotoPerfil || '/src/images/testimg.png'
      });
    }
  }, [user]);


  const salir = () => {
    UseAuthStore.getState().logout()
    router.push('/auth/login')
  }

  const handleCambiarFoto = async () => {
    try {
      console.log("Click cambiar foto");
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Error", "Se necesitan permisos para acceder a las imágenes");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
        Alert.alert("Error", "La imagen es demasiado grande (máx 5MB)");
        return;
      }

      const formData = new FormData();

      formData.append("foto", {
        uri: file.uri,
        name: file.fileName || "foto.jpg",
        type: file.mimeType || "image/jpeg",
      });

      const resultApi = await cambiarFotoPerfil(formData);

      if (resultApi.success) {
        setUserData((prev) => ({
          ...prev,
          fotoPerfil: resultApi.fotoPerfil,
        }));

        Alert.alert("Éxito", "Foto actualizada correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar la foto");
    }
  };

  const handleOpenEdit = (field, title, value) => {
    setEditModal({ open: true, field, title, value });
  };

  const handleCloseEdit = () => { setEditModal({ open: false, field: '', title: '', value: '' }); };

  const handleSaveEdit = async (newValue) => {
    try {
      const updateData = { [editModal.field]: newValue };
      const result = await actualizarPerfil(user?.idUsuario, updateData);

      if (result.success) {
        setUserData(prev => ({ ...prev, [editModal.field]: newValue }));
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  };

  const handleEliminarCuenta = async () => {
    try {
      setShowPopup(false);
      Alert.alert(
        "¿Estás seguro?",
        "Esta acción no se puede deshacer",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Sí, eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                const deleteResult = await eliminarCuenta(user?.idUsuario);

                if (deleteResult.success) {
                  Alert.alert(
                    "Cuenta eliminada",
                    "Tu cuenta ha sido eliminada exitosamente.",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          router.replace('/auth/login');
                        }
                      }
                    ]
                  );
                } else {
                  Alert.alert(
                    "Error",
                    deleteResult?.message || "No se pudo eliminar la cuenta."
                  );
                }

              } catch (error) {
                Alert.alert(
                  "Error",
                  "No se pudo eliminar la cuenta."
                );
              }
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo eliminar la cuenta."
      );
    }
  };

  return (
    <View style={perfilStyle.container}>
      <View style={perfilStyle.title}>
        <Text style={perfilStyle.titleText}>Perfil</Text>
        <Svg
          viewBox="0 0 24 24"
          width={40}
          height={40}
          fill="red"
          onPress={salir}
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
          />
        </Svg>
      </View>
      <View style={perfilStyle.imgContainer}>
        <Image source={{
          uri: `${BASE_URL}/${userData?.fotoPerfil}`
        }} style={perfilStyle.imgPerfil} />
        <Svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          fill="black"
          style={perfilStyle.imgSvg}
          onPress={handleCambiarFoto}
        >
          <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </Svg>
      </View>

      <View style={perfilStyle.campoContainer}>
        <Text style={perfilStyle.infoDescription}>Nombre</Text>
        <View style={perfilStyle.infoContainer}>
          <Text>{userData.nombre}</Text>
          <Svg
            viewBox="0 0 24 24"
            width={30}
            height={30}
            fill="black"
            style={perfilStyle.imgSvg}
            onPress={() => handleOpenEdit('nombre', 'Nombre', userData?.nombre)}
          >
            <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </Svg>
        </View>
      </View>

      <View style={perfilStyle.campoContainer}>
        <Text style={perfilStyle.infoDescription}>Correo</Text>
        <View style={perfilStyle.infoContainer}>
          <Text>{userData.email}</Text>
          <Svg
            viewBox="0 0 24 24"
            width={30}
            height={30}
            fill="black"
            style={perfilStyle.imgSvg}
            onPress={() => handleOpenEdit('email', 'Correo', userData?.email)}
          >
            <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </Svg>
        </View>
      </View>


      <Svg
        viewBox="0 0 24 24"
        width={40}
        height={40}
        fill="red"
        style={perfilStyle.btnDelete}
        onPress={() => setShowPopup(true)}
      >
        <Path fillRule="evenodd"
          clipRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
      </Svg>
      <EditModal
        open={editModal.open}
        handleClose={handleCloseEdit}
        title={editModal.title}
        currentValue={editModal.value}
        onSave={(value) => {
          console.log("Nuevo valor:", value);

          setUserData(prev => ({
            ...prev,
            [editModal.field]: value
          }));

          handleSaveEdit(value);
        }}
        type={editModal.field === 'email' ? 'email' : 'text'}
        maxLength={editModal.field === 'nombre' ? 45 : undefined}
      />
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={perfilStyle.darkThemeModal}>
          <View style={perfilStyle.modalContainer}>
            <DeliteAcountPopUp
              onAccept={handleEliminarCuenta}
              onClose={() => {
                setShowPopup(false)
              }}
            />
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default perfilPaciente