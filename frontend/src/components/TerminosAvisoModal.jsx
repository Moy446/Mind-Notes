import React, { useState } from 'react';
import './TerminosAvisoModal.css';

export default function TerminosAvisoModal({ onAceptar, onRechazar }) {
    const [tab, setTab] = useState('terminos');
    const [aceptoTerminos, setAceptoTerminos] = useState(false);
    const [aceptoPrivacidad, setAceptoPrivacidad] = useState(false);

    const handleAceptar = () => {
        if (aceptoTerminos && aceptoPrivacidad) {
            onAceptar();
        } else {
            alert('Debes aceptar tanto los términos como el aviso de privacidad para continuar');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Términos y Condiciones - Aviso de Privacidad</h2>
                    <p className="modal-subtitle">Debes aceptar ambos documentos para continuar con tu registro</p>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`tab-button ${tab === 'terminos' ? 'active' : ''}`}
                        onClick={() => setTab('terminos')}
                    >
                        Términos y Condiciones
                    </button>
                    <button
                        className={`tab-button ${tab === 'privacidad' ? 'active' : ''}`}
                        onClick={() => setTab('privacidad')}
                    >
                        Aviso de Privacidad
                    </button>
                </div>

                <div className="modal-body">
                    {tab === 'terminos' && (
                        <div className="tab-content">
                            <div className="documento expanded">
                                <div className="documento-preview">
                                    <h3>Términos y Condiciones de Uso de Mindnotes</h3>
                                    <p><strong>Última actualización: 24 de Marzo del 2026</strong></p>

                                    <p>
                                        Bienvenido a Mindnotes. Al acceder y utilizar este sitio web y nuestro sistema, usted
                                        (en adelante "El Usuario" o "El Profesional") acepta cumplir y estar sujeto a los
                                        siguientes Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de
                                        estos términos, no debe utilizar nuestra plataforma.
                                    </p>

                                    <h4>1. Descripción del Servicio</h4>
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

                                    <h4>2. Cuentas de Usuario y Seguridad</h4>
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

                                    <h4>3. Responsabilidad Profesional y Médica (Aviso de Exención)</h4>
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

                                    <h4>4. Uso Aceptable y Restricciones Técnicas</h4>
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

                                    <h4>5. Disponibilidad del Servicio y Almacenamiento</h4>
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

                                    <h4>6. Propiedad Intelectual</h4>
                                    <p>
                                        Todo el contenido, diseño, arquitectura de software, bases de datos, interfaces,
                                        logotipos y código de Mindnotes son propiedad exclusiva de MindNotes S.A de C.V y están protegidos
                                        por las leyes de propiedad intelectual y derechos de autor de México y tratados
                                        internacionales.
                                    </p>

                                    <h4>7. Suspensión y Cancelación de la Cuenta</h4>
                                    <p>
                                        Nos reservamos el derecho de suspender o cancelar permanentemente el acceso a
                                        cualquier usuario que viole estos Términos y Condiciones, incumpla con los pagos de
                                        suscripción (si aplica), o utilice la plataforma de manera que genere un riesgo
                                        legal o tecnológico para Mindnotes.
                                    </p>

                                    <h4>8. Modificaciones a los Términos</h4>
                                    <p>
                                        Mindnotes se reserva el derecho de modificar estos Términos y Condiciones en
                                        cualquier momento. Los cambios entrarán en vigor en el momento de su publicación en
                                        el sitio web. El uso continuo de la plataforma después de dichas modificaciones
                                        constituye la aceptación de estas.
                                    </p>

                                    <h4>9. Jurisdicción y Leyes Aplicables</h4>
                                    <p>
                                        Para la interpretación, cumplimiento y ejecución de los presentes términos, las
                                        partes se someten a las leyes federales de los Estados Unidos Mexicanos y a la
                                        jurisdicción de los tribunales competentes en Guadalajara Jalisco, renunciando a
                                        cualquier otro fuero que pudiera corresponderles por razón de sus domicilios
                                        presentes o futuros.
                                    </p>
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={aceptoTerminos}
                                        onChange={(e) => setAceptoTerminos(e.target.checked)}
                                    />
                                    <span>Acepto los Términos y Condiciones</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {tab === 'privacidad' && (
                        <div className="tab-content">
                            <div className="documento expanded">
                                <div className="documento-preview">
                                    <h3>Aviso de Privacidad de Mindnotes</h3>
                                    <p><strong>Última actualización: 25 de Marzo del 2026</strong></p>

                                    <h4>Marco Normativo y Justificación Legal del Sistema MindNotes</h4>
                                    <p>
                                        Para garantizar la viabilidad legal y operativa de la plataforma MindNotes S.A de C.V, el diseño de
                                        la arquitectura de datos y las políticas de privacidad se fundamentan en dos normativas
                                        mexicanas clave. A continuación, se desglosa su propósito y su aplicación directa en el
                                        sistema:
                                    </p>

                                    <h4>1. NOM-004-SSA3-2012, Del Expediente Clínico</h4>
                                    <p>
                                        <strong>¿Qué es?</strong> Es la Norma Oficial Mexicana de observancia obligatoria
                                        que establece los criterios científicos, éticos, tecnológicos y administrativos para
                                        la elaboración, integración, uso, manejo, archivo, conservación, propiedad,
                                        titularidad y confidencialidad del expediente clínico.
                                    </p>
                                    <p>
                                        <strong>¿Por qué aplica a MindNotes?</strong> Dado que MindNotes es una herramienta
                                        tecnológica para psicólogos, la información que se almacena en sus bases de datos
                                        constituye un Expediente Clínico Electrónico (ECE). Para cumplir con esta norma, el
                                        sistema está diseñado contemplando que:
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Confidencialidad:</strong> La plataforma debe contar con controles de
                                            acceso estrictos para asegurar el secreto profesional.
                                        </li>
                                        <li>
                                            <strong>Titularidad y Propiedad:</strong> El sistema reconoce tecnológicamente
                                            que los datos de salud le pertenecen al paciente, pero el expediente (el
                                            contenedor de los datos) es resguardado por el profesional de la salud.
                                        </li>
                                        <li>
                                            <strong>Retención de datos:</strong> La base de datos debe ser capaz de almacenar
                                            la información de los expedientes por un periodo legal mínimo de 5 años a partir
                                            de la última consulta.
                                        </li>
                                    </ul>

                                    <h4>2. Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</h4>
                                    <p>
                                        <strong>¿Qué es?</strong> Es la ley federal que regula el tratamiento legítimo,
                                        controlado e informado de los datos personales por parte de entidades privadas
                                        (empresas, clínicas o profesionales independientes), garantizando la privacidad y el
                                        derecho a la autodeterminación informativa de las personas.
                                    </p>
                                    <p>
                                        <strong>¿Por qué aplica a MindNotes?</strong> La plataforma recopila información de
                                        contacto, pero de manera crítica, procesa datos personales sensibles (estado de salud
                                        mental, diagnósticos psicológicos y notas de evolución). Por mandato de esta ley
                                        (Artículos 8 y 9), MindNotes está obligado a:
                                    </p>
                                    <ul>
                                        <li>Contar con un Aviso de Privacidad explícito.</li>
                                        <li>
                                            Implementar un mecanismo tecnológico para recabar el consentimiento expreso y por
                                            escrito (o su equivalente electrónico) del paciente para poder guardar sus datos
                                            sensibles.
                                        </li>
                                        <li>
                                            Proporcionar un canal para que los usuarios puedan ejercer sus Derechos ARCO
                                            (Acceso, Rectificación, Cancelación y Oposición) sobre la información almacenada
                                            en los servidores.
                                        </li>
                                    </ul>

                                    <h4>Aviso de Privacidad Integral de MindNotes</h4>
                                    <p>
                                        En apego a la Norma Oficial Mexicana NOM-004-SSA3-2012, Del expediente clínico, y en
                                        cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los
                                        Particulares (en adelante "la Ley"), <strong>MindNotes S.A de C.V</strong> (en adelante "El responsable"), con
                                        domicilio en <strong>C. Nueva Escocia 1885, Providencia 5a Secc., 44638 Guadalajara, Jal</strong>, es el
                                        responsable del uso y protección de sus datos personales.
                                    </p>
                                    <p>
                                        A través de nuestra plataforma MindNotes, nos comprometemos a garantizar la privacidad y
                                        confidencialidad de su información.
                                    </p>

                                    <h4>1. Datos Personales que recabamos</h4>
                                    <p>
                                        Para llevar a cabo las finalidades descritas en el presente aviso de privacidad,
                                        utilizaremos los siguientes datos personales:
                                    </p>
                                    <ul>
                                        <li><strong>Datos de identificación:</strong> Nombre completo.</li>
                                        <li><strong>Datos de contacto:</strong> correo electrónico.</li>
                                        <li><strong>Datos de autenticación:</strong> contraseña (almacenada de forma segura y cifrada).</li>
                                        <li>
                                            <strong>Datos Personales Sensibles:</strong>
                                            <ul>
                                                <li>Estado de salud físico y mental (presente y pasado).</li>
                                                <li>Historial clínico, diagnósticos, tratamientos y notas de evolución.</li>
                                                <li>Creencias religiosas, filosóficas o morales (solo si es estrictamente relevante para el tratamiento terapéutico).</li>
                                                <li>Información genética o antecedentes médicos familiares.</li>
                                            </ul>
                                            <p><strong>Nota importante:</strong> Por tratarse de datos sensibles, requerimos su consentimiento expreso y por escrito para su tratamiento.</p>
                                        </li>
                                    </ul>

                                    <h4>2. Finalidades del Tratamiento de sus Datos</h4>
                                    <p>
                                        Los datos personales que recabamos tienen como finalidades principales (necesarias
                                        para el servicio que solicita):
                                    </p>
                                    <ul>
                                        <li>Prestación de servicios de atención psicológica.</li>
                                        <li>Apertura, integración, actualización y conservación de su Expediente Clínico a través del sistema MindNotes.</li>
                                        <li>Seguimiento de diagnósticos y tratamientos.</li>
                                        <li>Facturación y cobro de los servicios prestados.</li>
                                    </ul>

                                    <h4>3. Sobre el Expediente Clínico (NOM-004-SSA3-2012)</h4>
                                    <p>
                                        Le informamos que los datos recabados en el sistema MindNotes forman parte de su Expediente Clínico. De acuerdo con la normativa vigente:
                                    </p>
                                    <ul>
                                        <li>La titularidad de los datos médicos le pertenece a usted (el paciente).</li>
                                        <li>La propiedad física o material (electrónica en este caso) del expediente le pertenece a "El responsable" que lo genera.</li>
                                        <li>El expediente clínico será conservado por un periodo mínimo de 5 años, contados a partir de la fecha del último acto médico.</li>
                                        <li>La información será manejada con estricta confidencialidad y solo podrá ser revelada a terceros mediante orden de la autoridad competente, o con su autorización expresa y por escrito.</li>
                                    </ul>

                                    <h4>4. Transferencia de Datos Personales</h4>
                                    <p>
                                        Le informamos que sus datos personales no serán compartidos con ninguna autoridad,
                                        empresa, organización o personas distintas a nosotros sin su previo consentimiento,
                                        con excepción de aquellos casos previstos en el <strong>artículo 37</strong> de la <strong>LFPDPPP</strong>, como
                                        emergencias médicas o requerimientos de autoridades sanitarias y judiciales competentes.
                                    </p>

                                    <h4>5. Opciones para Limitar el Uso o Divulgación de sus Datos</h4>
                                    <p>
                                       Con el objeto de que usted pueda limitar el uso y divulgación de su información personal, le ofrecemos registrarse en nuestro 
                                       "Listado de Exclusión de MindNotes". Para solicitar su registro, envíe un correo a: mindnotesceti@gmail.com.
                                    </p>

                                    <h4>6. Uso de tecnologías de rastreo (Cookies)</h4>
                                    <p>
                                        Le informamos que en la plataforma web de MindNotes utilizamos cookies y otras tecnologías a través de las cuales es posible monitorear su comportamiento
                                        como usuario de internet. Usted puede deshabilitar estas tecnologías directamente en las configuraciones de privacidad de su navegador.
                                    </p>

                                    <h4>7. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h4>
                                    <p>
                                        Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). 
                                        Asimismo, es su derecho solicitar la corrección de su información personal (Rectificación); que la eliminemos de nuestros registros (Cancelación); 
                                        así como oponerse al uso de sus datos personales para fines específicos (Oposición).
                                    </p>
                                    <p>
                                        Para el ejercicio de cualquiera de los Derechos ARCO, usted deberá enviar un correo electrónico a:
                                        <strong> mindnotesceti@gmail.com</strong>. Su solicitud deberá contener: nombre completo, documento que acredite su identidad, y la descripción clara de los
                                        datos sobre los que busca ejercer algún derecho.
                                    </p>
                                    <p>
                                        Le daremos respuesta en un plazo máximo de 20 días hábiles a través del mismo correo electrónico mediante el cual 
                                        realizó su solicitud.
                                    </p>

                                    <h4>8. Denuncias por vulneración a la protección de datos</h4>
                                    <p>
                                       Si usted considera que su derecho a la protección de sus datos personales ha sido lesionado, podrá interponer su inconformidad o 
                                       denuncia ante la autoridad federal competente en materia de protección de datos personales y buen gobierno.
                                    </p>

                                    <h4>9. Cambios al Aviso de Privacidad</h4>
                                    <p>
                                        El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones
                                        derivadas de nuevos requerimientos legales. Nos
                                        comprometemos a mantenerlo informado sobre los cambios a través de
                                        <strong> mindnotesceti@gmail.com</strong> o <strong>mindnotes.com</strong>
                                    </p>

                                    <h4>10. Consentimiento</h4>
                                    <p>
                                        Al firmar este documento o aceptar de manera electrónica en el sistema MindNotes,
                                        reconozco que he leído el presente Aviso de Privacidad, entendiendo sus alcances, y
                                        otorgo mi consentimiento expreso para el tratamiento de mis datos personales y datos
                                        personales sensibles según lo aquí estipulado.
                                    </p>
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={aceptoPrivacidad}
                                        onChange={(e) => setAceptoPrivacidad(e.target.checked)}
                                    />
                                    <span>Acepto el Aviso de Privacidad</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <div className="aceptacion-status">
                        <p className={aceptoTerminos ? 'aceptado' : 'no-aceptado'}>
                            {aceptoTerminos ? '✓ Términos aceptados' : '✗ Términos no aceptados'}
                        </p>
                        <p className={aceptoPrivacidad ? 'aceptado' : 'no-aceptado'}>
                            {aceptoPrivacidad ? '✓ Privacidad aceptada' : '✗ Privacidad no aceptada'}
                        </p>
                    </div>

                    <div className="modal-buttons">
                        <button 
                            className="btn-rechazar"
                            onClick={onRechazar}
                        >
                            Rechazar
                        </button>
                        <button 
                            className={`btn-aceptar ${(aceptoTerminos && aceptoPrivacidad) ? 'habilitado' : 'deshabilitado'}`}
                            onClick={handleAceptar}
                            disabled={!(aceptoTerminos && aceptoPrivacidad)}
                        >
                            Aceptar y Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
