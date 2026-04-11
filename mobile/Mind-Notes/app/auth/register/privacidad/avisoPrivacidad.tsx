import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { APstyle } from '@/styles/auth/avisoPrivacidadStyle'

const avisoPrivacidadScreen = () => {
  return (
        <View style={APstyle.container}>

      {/* Contenido */}
      <ScrollView contentContainerStyle={APstyle.content}>

        <Text style={APstyle.title}>Aviso de Privacidad de Mindnotes</Text>
        <Text style={APstyle.fecha}>Última actualización: 25 de Marzo del 2026</Text>

        <Text style={APstyle.subtitle}>
          Marco Normativo y Justificación Legal del Sistema MindNotes
        </Text>

        <Text style={APstyle.parrafo}>
          Para garantizar la viabilidad legal y operativa de la plataforma MindNotes S.A de C.V...
        </Text>

        {/* Sección 1 */}
        <Text style={APstyle.subtitle}>1. NOM-004-SSA3-2012, Del Expediente Clínico</Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>¿Qué es? </Text>
          Es la Norma Oficial Mexicana que establece criterios para el expediente clínico.
        </Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>¿Por qué aplica a MindNotes? </Text>
          La información almacenada constituye un Expediente Clínico Electrónico.
        </Text>

        <Text style={APstyle.listItem}>• Confidencialidad mediante controles de acceso.</Text>
        <Text style={APstyle.listItem}>• Titularidad del paciente.</Text>
        <Text style={APstyle.listItem}>• Retención mínima de 5 años.</Text>

        {/* Sección 2 */}
        <Text style={APstyle.subtitle}>
          2. Ley Federal de Protección de Datos Personales (LFPDPPP)
        </Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>¿Qué es? </Text>
          Regula el tratamiento de datos personales por entidades privadas.
        </Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>¿Por qué aplica? </Text>
          Se procesan datos sensibles como salud mental y diagnósticos.
        </Text>

        <Text style={APstyle.listItem}>• Aviso de privacidad obligatorio.</Text>
        <Text style={APstyle.listItem}>• Consentimiento expreso del paciente.</Text>
        <Text style={APstyle.listItem}>• Derechos ARCO.</Text>

        {/* Aviso Integral */}
        <Text style={APstyle.subtitle}>
          Aviso de Privacidad Integral de MindNotes
        </Text>

        <Text style={APstyle.parrafo}>
          MindNotes S.A de C.V, con domicilio en Guadalajara, es responsable del uso de sus datos.
        </Text>

        {/* Datos personales */}
        <Text style={APstyle.subtitle}>1. Datos Personales que recabamos</Text>

        <Text style={APstyle.listItem}>• Nombre completo.</Text>
        <Text style={APstyle.listItem}>• Correo electrónico.</Text>
        <Text style={APstyle.listItem}>• Contraseña cifrada.</Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>Datos sensibles:</Text>
        </Text>

        <Text style={APstyle.listItem}>• Estado de salud físico y mental.</Text>
        <Text style={APstyle.listItem}>• Historial clínico.</Text>
        <Text style={APstyle.listItem}>• Creencias relevantes.</Text>
        <Text style={APstyle.listItem}>• Información genética.</Text>

        <Text style={APstyle.parrafo}>
          Se requiere consentimiento expreso para su tratamiento.
        </Text>

        {/* Finalidades */}
        <Text style={APstyle.subtitle}>2. Finalidades</Text>

        <Text style={APstyle.listItem}>• Atención psicológica.</Text>
        <Text style={APstyle.listItem}>• Expediente clínico.</Text>
        <Text style={APstyle.listItem}>• Seguimiento de tratamiento.</Text>
        <Text style={APstyle.listItem}>• Facturación.</Text>

        <Text style={APstyle.parrafo}>
          <Text style={APstyle.bold}>Finalidades secundarias:</Text>
        </Text>

        <Text style={APstyle.listItem}>• Recordatorios.</Text>
        <Text style={APstyle.listItem}>• Estadística anonimizada.</Text>

        {/* Expediente */}
        <Text style={APstyle.subtitle}>3. Expediente Clínico</Text>

        <Text style={APstyle.listItem}>• Datos pertenecen al paciente.</Text>
        <Text style={APstyle.listItem}>• Expediente al responsable.</Text>
        <Text style={APstyle.listItem}>• Conservación 5 años.</Text>

        {/* Transferencia */}
        <Text style={APstyle.subtitle}>4. Transferencia de Datos</Text>

        <Text style={APstyle.parrafo}>
          No se comparten datos sin consentimiento salvo excepciones legales.
        </Text>

        {/* Opciones */}
        <Text style={APstyle.subtitle}>5. Limitar uso</Text>

        <Text style={APstyle.parrafo}>
          Puede solicitar exclusión enviando correo a mindnotesceti@gmail.com
        </Text>

        {/* Cookies */}
        <Text style={APstyle.subtitle}>6. Cookies</Text>

        <Text style={APstyle.parrafo}>
          Se usan tecnologías de rastreo para mejorar la experiencia.
        </Text>

        {/* ARCO */}
        <Text style={APstyle.subtitle}>7. Derechos ARCO</Text>

        <Text style={APstyle.parrafo}>
          Puede acceder, rectificar, cancelar u oponerse al uso de sus datos.
        </Text>

        {/* Denuncias */}
        <Text style={APstyle.subtitle}>8. Denuncias</Text>

        <Text style={APstyle.parrafo}>
          Puede acudir a la autoridad competente en protección de datos.
        </Text>

        {/* Cambios */}
        <Text style={APstyle.subtitle}>9. Cambios</Text>

        <Text style={APstyle.parrafo}>
          Nos reservamos el derecho de modificar este aviso.
        </Text>

        {/* Consentimiento */}
        <Text style={APstyle.subtitle}>10. Consentimiento</Text>

        <Text style={APstyle.parrafo}>
          Al aceptar, otorga consentimiento para el tratamiento de sus datos.
        </Text>

      </ScrollView>
    </View>
  )
}

export default avisoPrivacidadScreen