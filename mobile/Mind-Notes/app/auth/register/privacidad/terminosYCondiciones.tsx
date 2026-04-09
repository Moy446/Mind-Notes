import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { TYCstyles } from '@/styles/auth/terminosYCondicionesStyle'

const terminosYCondicionesScreen = () => {
  return (
    <View style={TYCstyles.container}>

      {/* Contenido */}
      <ScrollView contentContainerStyle={TYCstyles.content}>
        
        <Text style={TYCstyles.title}>
          Términos y Condiciones de Uso de Mindnotes
        </Text>

        <Text style={TYCstyles.fecha}>
          Última actualización: 24 de Marzo del 2026
        </Text>

        <Text style={TYCstyles.parrafo}>
          Bienvenido a Mindnotes. Al acceder y utilizar este sitio web y nuestro sistema, usted
          (en adelante "El Usuario" o "El Profesional") acepta cumplir y estar sujeto a los
          siguientes Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de
          estos términos, no debe utilizar nuestra plataforma.
        </Text>

        {/* Sección 1 */}
        <Text style={TYCstyles.subtitle}>1. Descripción del Servicio</Text>
        <Text style={TYCstyles.parrafo}>
          Mindnotes es una plataforma digital (Software as a Service) diseñada
          específicamente para profesionales de la psicología y la salud mental.
        </Text>

        <Text style={TYCstyles.listItem}>• Administración de perfiles y expedientes de pacientes.</Text>
        <Text style={TYCstyles.listItem}>• Gestión y programación de citas.</Text>
        <Text style={TYCstyles.listItem}>• Registro de notas clínicas y de evolución.</Text>

        {/* Sección 2 */}
        <Text style={TYCstyles.subtitle}>2. Cuentas de Usuario y Seguridad</Text>
        <Text style={TYCstyles.parrafo}>
          Para utilizar Mindnotes, el profesional debe registrarse y crear una cuenta.
        </Text>

        <Text style={TYCstyles.listItem}>• El usuario es responsable de sus credenciales.</Text>
        <Text style={TYCstyles.listItem}>• Toda actividad bajo su cuenta es su responsabilidad.</Text>
        <Text style={TYCstyles.listItem}>• Debe notificar cualquier uso no autorizado.</Text>

        {/* Sección 3 */}
        <Text style={TYCstyles.subtitle}>
          3. Responsabilidad Profesional y Médica (Aviso de Exención)
        </Text>
        <Text style={TYCstyles.parrafo}>
          Mindnotes provee exclusivamente herramientas tecnológicas y administrativas.
        </Text>

        <Text style={TYCstyles.listItem}>• No se prestan servicios médicos o psicológicos.</Text>
        <Text style={TYCstyles.listItem}>• La información es responsabilidad del profesional.</Text>
        <Text style={TYCstyles.listItem}>• No hay responsabilidad por negligencia médica.</Text>

        {/* Sección 4 */}
        <Text style={TYCstyles.subtitle}>4. Uso Aceptable y Restricciones Técnicas</Text>
        <Text style={TYCstyles.parrafo}>
          El usuario se compromete a utilizar la plataforma de manera legal y ética.
        </Text>

        <Text style={TYCstyles.listItem}>• No almacenar contenido ilegal.</Text>
        <Text style={TYCstyles.listItem}>• No vulnerar la seguridad.</Text>
        <Text style={TYCstyles.listItem}>• No realizar ataques (SQL, XSS, etc.).</Text>
        <Text style={TYCstyles.listItem}>• No hacer ingeniería inversa.</Text>

        {/* Sección 5 */}
        <Text style={TYCstyles.subtitle}>5. Disponibilidad del Servicio</Text>
        <Text style={TYCstyles.parrafo}>
          Nos esforzamos por mantener la plataforma operativa continuamente.
        </Text>

        <Text style={TYCstyles.listItem}>• No se garantiza servicio ininterrumpido.</Text>
        <Text style={TYCstyles.listItem}>• El usuario debe tener respaldos propios.</Text>

        {/* Sección 6 */}
        <Text style={TYCstyles.subtitle}>6. Propiedad Intelectual</Text>
        <Text style={TYCstyles.parrafo}>
          Todo el contenido de Mindnotes está protegido por leyes de propiedad intelectual.
        </Text>

        {/* Sección 7 */}
        <Text style={TYCstyles.subtitle}>7. Suspensión de Cuenta</Text>
        <Text style={TYCstyles.parrafo}>
          Podemos suspender cuentas que violen los términos o generen riesgos.
        </Text>

        {/* Sección 8 */}
        <Text style={TYCstyles.subtitle}>8. Modificaciones</Text>
        <Text style={TYCstyles.parrafo}>
          Los términos pueden cambiar en cualquier momento.
        </Text>

        {/* Sección 9 */}
        <Text style={TYCstyles.subtitle}>9. Jurisdicción</Text>
        <Text style={TYCstyles.parrafo}>
          Aplican las leyes de México y tribunales de Guadalajara, Jalisco.
        </Text>

      </ScrollView>
    </View>
  )
}

export default terminosYCondicionesScreen