import React from 'react';
import { useNavigate } from 'react-router-dom';
import './terminosYcondiciones.css';
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'

export default function TerminosYCondiciones() {
    return (

        <div className="terminos-container">
            <header className="terminos-page-header">
                <HeaderMenu />
            </header>
            <main className="terminos-card">
                <h1>Términos y Condiciones de Uso de Mindnotes</h1>
                <p className="terminos-fecha">Última actualización: 24 de Marzo del 2026</p>

                <p>
                    Bienvenido a Mindnotes. Al acceder y utilizar este sitio web y nuestro sistema, usted
                    (en adelante "El Usuario" o "El Profesional") acepta cumplir y estar sujeto a los
                    siguientes Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de
                    estos términos, no debe utilizar nuestra plataforma.
                </p>

                <section>
                    <h2>1. Descripción del Servicio</h2>
                    <p>
                        Mindnotes es una plataforma digital (Software as a Service) diseñada
                        específicamente para profesionales de la psicología y la salud mental. Las
                        funcionalidades principales incluyen, de manera enunciativa más no limitativa:
                    </p>
                    <ul>
                        <li>Administración de perfiles y expedientes de pacientes.</li>
                        <li>Gestión y programación de citas.</li>
                        <li>Registro de notas clínicas y de evolución.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Cuentas de Usuario y Seguridad</h2>
                    <p>Para utilizar Mindnotes, el profesional debe registrarse y crear una cuenta.</p>
                    <ul>
                        <li>
                            El usuario es el único responsable de mantener la confidencialidad de sus
                            credenciales de acceso (usuario y contraseña).
                        </li>
                        <li>Toda actividad que ocurra bajo su cuenta es de su exclusiva responsabilidad.</li>
                        <li>
                            El usuario se compromete a notificar inmediatamente a Mindnotes sobre cualquier
                            uso no autorizado de su cuenta o cualquier brecha de seguridad.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>3. Responsabilidad Profesional y Médica (Aviso de Exención)</h2>
                    <p>Mindnotes provee exclusivamente herramientas tecnológicas y administrativas.</p>
                    <ul>
                        <li>
                            En ningún momento Mindnotes, sus desarrolladores o representantes, prestan
                            servicios médicos, psicológicos o psiquiátricos.
                        </li>
                        <li>
                            Toda la información, diagnósticos, tratamientos y notas ingresadas en el sistema
                            son responsabilidad exclusiva del profesional de la salud que las emite.
                        </li>
                        <li>
                            Mindnotes no se hace responsable por negligencia médica, errores de diagnóstico,
                            o cualquier disputa legal entre el psicólogo y el paciente. El profesional asume
                            toda la responsabilidad derivada del cumplimiento de la NOM-004-SSA3-2012 en su
                            práctica diaria.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>4. Uso Aceptable y Restricciones Técnicas</h2>
                    <p>
                        El usuario se compromete a utilizar la plataforma de manera legal y ética. Queda
                        estrictamente prohibido:
                    </p>
                    <ul>
                        <li>
                            Utilizar el sistema para almacenar contenido ilegal, difamatorio o que infrinja
                            derechos de terceros.
                        </li>
                        <li>
                            Intentar vulnerar, eludir o comprometer las medidas de seguridad del sistema y
                            sus bases de datos.
                        </li>
                        <li>
                            Realizar pruebas de penetración no autorizadas, ataques de inyección SQL,
                            inserción de secuencias de comandos en sitios cruzados (XSS), o cualquier otra
                            acción que ponga en riesgo la integridad del backend y la confidencialidad de los
                            datos.
                        </li>
                        <li>
                            Aplicar ingeniería inversa, descompilar o intentar extraer el código fuente de la
                            plataforma.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>5. Disponibilidad del Servicio y Almacenamiento</h2>
                    <p>
                        Nos esforzamos por mantener la plataforma operativa de forma continua. Sin embargo:
                    </p>
                    <ul>
                        <li>
                            Mindnotes no garantiza que el servicio sea ininterrumpido o libre de errores al
                            100%. Las operaciones de mantenimiento en los servidores o actualizaciones en la
                            base de datos pueden requerir ventanas de inactividad temporal.
                        </li>
                        <li>
                            Aunque realizamos respaldos periódicos, es responsabilidad del usuario mantener
                            copias de seguridad de la información de sus pacientes conforme a sus propias
                            obligaciones legales. Mindnotes no será responsable por la pérdida accidental de
                            datos derivada de fallas de fuerza mayor.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>6. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido, diseño, arquitectura de software, bases de datos, interfaces,
                        logotipos y código de Mindnotes son propiedad exclusiva de [ ] y están protegidos
                        por las leyes de propiedad intelectual y derechos de autor de México y tratados
                        internacionales.
                    </p>
                </section>

                <section>
                    <h2>7. Suspensión y Cancelación de la Cuenta</h2>
                    <p>
                        Nos reservamos el derecho de suspender o cancelar permanentemente el acceso a
                        cualquier usuario que viole estos Términos y Condiciones, incumpla con los pagos de
                        suscripción (si aplica), o utilice la plataforma de manera que genere un riesgo
                        legal o tecnológico para Mindnotes.
                    </p>
                </section>

                <section>
                    <h2>8. Modificaciones a los Términos</h2>
                    <p>
                        Mindnotes se reserva el derecho de modificar estos Términos y Condiciones en
                        cualquier momento. Los cambios entrarán en vigor en el momento de su publicación en
                        el sitio web. El uso continuo de la plataforma después de dichas modificaciones
                        constituye la aceptación de estas.
                    </p>
                </section>

                <section>
                    <h2>9. Jurisdicción y Leyes Aplicables</h2>
                    <p>
                        Para la interpretación, cumplimiento y ejecución de los presentes términos, las
                        partes se someten a las leyes federales de los Estados Unidos Mexicanos y a la
                        jurisdicción de los tribunales competentes en Guadalajara Jalisco, renunciando a
                        cualquier otro fuero que pudiera corresponderles por razón de sus domicilios
                        presentes o futuros.
                    </p>
                </section>

            </main>
            <footer className="terminos-page-footer">
                <FooterMenu />
            </footer>
        </div>
    );
}