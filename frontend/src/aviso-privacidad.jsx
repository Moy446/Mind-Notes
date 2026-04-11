import React from 'react';
import { useNavigate } from 'react-router-dom';
import './aviso-privacidad.css';
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'

export default function AvisoPrivacidad() {

    return (
        <div className="aviso-container">
            <header className="aviso-page-header">
                <HeaderMenu />
            </header>
            <main className="aviso-card">
                <h1>Aviso de Privacidad de Mindnotes</h1>
                <p className="aviso-fecha">Última actualización: 25 de Marzo del 2026</p>

                <h2>Marco Normativo y Justificación Legal del Sistema MindNotes</h2>
                <p>
                    Para garantizar la viabilidad legal y operativa de la plataforma MindNotes S.A de C.V, el diseño de
                    la arquitectura de datos y las políticas de privacidad se fundamentan en dos normativas
                    mexicanas clave. A continuación, se desglosa su propósito y su aplicación directa en el
                    sistema:
                </p>

                <section>
                    <h2>1. NOM-004-SSA3-2012, Del Expediente Clínico</h2>
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
                </section>

                <section>
                    <h2>
                        2. Ley Federal de Protección de Datos Personales en Posesión de los Particulares
                        (LFPDPPP)
                    </h2>
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
                </section>

                <h2>Aviso de Privacidad Integral de MindNotes (Sistema MindNotes)</h2>
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

                <section>
                    <h2>1. Datos Personales que recabamos</h2>
                    <p>
                        Para llevar a cabo las finalidades descritas en el presente aviso de privacidad,
                        utilizaremos los siguientes datos personales:
                    </p>
                    <ul>
                        <li>
                            <strong>Datos de identificación:</strong> Nombre completo.
                        </li>
                        <li>
                            <strong>Datos de contacto:</strong> correo electrónico.
                        </li>
                        <li>
                            <strong>Datos de autenticación:</strong> contraseña (almacenada de forma segura y cifrada).
                        </li>
                        <li>
                            <strong>Datos Personales Sensibles: </strong>
                            <p>
                                Además de los datos anteriores, para cumplir con las finalidades de nuestra atención
                                médica/psicológica y la integración de su expediente clínico (según lo dicta la
                                NOM-004-SSA3-2012), recabaremos los siguientes datos sensibles:
                            </p>
                            <ul>
                                <li>Estado de salud físico y mental (presente y pasado).</li>
                                <li>Historial clínico, diagnósticos, tratamientos y notas de evolución.</li>
                                <li>
                                    Creencias religiosas, filosóficas o morales (solo si es estrictamente relevante
                                    para el tratamiento terapéutico).
                                </li>
                                <li>Información genética o antecedentes médicos familiares.</li>
                            </ul>
                            <p>
                                <strong>Nota importante:</strong> Por tratarse de datos sensibles, requerimos su
                                consentimiento expreso y por escrito para su tratamiento, a través de su firma
                                autógrafa, firma electrónica o cualquier mecanismo de autenticación establecido.
                            </p>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>2. Finalidades del Tratamiento de sus Datos</h2>
                    <p>
                        Los datos personales que recabamos tienen como finalidades principales (necesarias
                        para el servicio que solicita):
                    </p>
                    <ul>
                        <li>Prestación de servicios de atención psicológica.</li>
                        <li>
                            Apertura, integración, actualización y conservación de su Expediente Clínico a
                            través del sistema MindNotes, en estricto apego a la NOM-004-SSA3-2012.
                        </li>
                        <li>Seguimiento de diagnósticos y tratamientos.</li>
                        <li>Facturación y cobro de los servicios prestados.</li>
                    </ul>

                    <h3>Finalidades Secundarias</h3>
                    <p>
                        No necesarias, pero que nos ayudan a brindarle un mejor servicio:
                    </p>
                    <ul>
                        <li>Envío de recordatorios de citas o información relevante.</li>
                        <li>
                            Fines estadísticos o de investigación clínica (en cuyo caso la información será
                            estrictamente disociada/anonimizada).
                        </li>
                    </ul>
                    <h3>Mecanismo para manifestar su negativa de las finalidades secundarias</h3>
                    <p>
                       En caso de que no desee que sus datos personales sean tratados para estos 
                       fines adicionales, desde este momento usted nos puede comunicar lo anterior marcando las siguientes casillas: 
                    </p>
                    <p> La negativa para el uso de sus datos personales para estas finalidades no podrá ser un motivo para que le neguemos los servicios principales que solicita.
                    </p>
                </section>

                <section>
                    <h2>3. Sobre el Expediente Clínico (NOM-004-SSA3-2012)</h2>
                    <p>
                        Le informamos que los datos recabados en el sistema MindNotes forman parte de su
                        Expediente Clínico. De acuerdo con la normativa vigente:
                    </p>
                    <ul>
                        <li>La titularidad de los datos médicos le pertenece a usted (el paciente).</li>
                        <li>
                            La propiedad física o material (electrónica en este caso) del expediente le
                            pertenece a "El responsable" que lo genera.
                        </li>
                        <li>
                            El expediente clínico será conservado por un periodo mínimo de 5 años, contados a
                            partir de la fecha del último acto médico.
                        </li>
                        <li>
                            La información será manejada con estricta confidencialidad y solo podrá ser
                            revelada a terceros mediante orden de la autoridad competente, o con su
                            autorización expresa y por escrito.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>4. Transferencia de Datos Personales</h2>
                    <p>
                        Le informamos que sus datos personales no serán compartidos con ninguna autoridad,
                        empresa, organización o personas distintas a nosotros sin su previo consentimiento,
                        con excepción de aquellos casos previstos en el <strong>artículo 37</strong> de la <strong>LFPDPPP</strong>, como
                        emergencias médicas o requerimientos de autoridades sanitarias y judiciales
                        competentes.
                    </p>
                </section>

                <section>
                    <h2>5. Opciones para Limitar el Uso o Divulgación de sus Datos </h2>
                    <p>
                       Con el objeto de que usted pueda limitar el uso y divulgación de su información personal, le ofrecemos registrarse en nuestro 
                       "Listado de Exclusión de MindNotes", a fin de que sus datos personales no sean tratados para fines publicitarios o de prospección comercial. 
                       Para solicitar su registro, envíe un correo a: mindnotesceti@gmail.com. 
                    </p>
                </section>

                <section>
                    <h2>6. Uso de tecnologias de rastero (Cookies)</h2>
                    <p>
                        Le informamos que en la plataforma web de MindNotes utilizamos cookies y otras tecnologías a través de las cuales es posible monitorear su comportamiento
                        como usuario de internet, así como brindarle un mejor servicio y experiencia al navegar en nuestra página. Los datos personales que obtenemos de estas 
                        tecnologías de rastreo son: [ej. horario de navegación, tiempo de sesión y dirección IP]. Usted puede deshabilitar estas tecnologías directamente en 
                        las configuraciones de privacidad de su navegado
                        </p>

                </section>

                <section>
                    <h2>7. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
                    <p>
                        Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los
                        utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho
                        solicitar la corrección de su información personal en caso de que esté desactualizada,
                        sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o
                        bases de datos cuando considere que la misma no está siendo utilizada adecuadamente
                        (Cancelación); así como oponerse al uso de sus datos personales para fines específicos
                        (Oposición).
                    </p>
                    <p>
                        Para el ejercicio de cualquiera de los Derechos ARCO o para revocar su consentimiento,
                        usted deberá presentar la solicitud respectiva enviando un correo electrónico a:
                        <strong> mindnotesceti@gmail.com</strong> o acudiendo a nuestro domicilio. Su solicitud deberá contener:
                        nombre completo, documento que acredite su identidad, y la descripción clara de los
                        datos sobre los que busca ejercer algún derecho.
                    </p>
                    <p>
                        Le daremos respuesta en un plazo máximo de 20 días hábiles a través del mismo correo electrónico mediante el cual 
                        realizó su solicitud, y la información solicitada (en caso de Acceso) le será entregada en formato digital (PDF).
                    </p>
                </section>

                <section>
                    <h2>8. Denuncias por vulneración a la protección de datos</h2>
                    <p>
                       Si usted considera que su derecho a la protección de sus datos personales ha sido lesionado por alguna conducta u omisión 
                       de nuestra parte, o presume alguna violación a las disposiciones previstas en la Ley, podrá interponer su inconformidad o 
                       denuncia ante la autoridad federal competente en materia de protección de datos personales y buen gobierno. 
                    </p>
                </section>

                <section>
                    <h2>9. Cambios al Aviso de Privacidad</h2>
                    <p>
                        El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones
                        derivadas de nuevos requerimientos legales, de nuestras propias necesidades, de
                        nuestras prácticas de privacidad o cambios en la plataforma MindNotes. Nos
                        comprometemos a mantenerlo informado sobre los cambios a través de
                        <strong> mindnotesceti@gmail.com</strong> o <strong>mindnotes.com</strong>
                    </p>
                </section>

                <section>
                    <h2>10. Consentimiento</h2>
                    <p>
                        Al firmar este documento o aceptar de manera electrónica en el sistema MindNotes,
                        reconozco que he leído el presente Aviso de Privacidad, entendiendo sus alcances, y
                        otorgo mi consentimiento expreso para el tratamiento de mis datos personales y datos
                        personales sensibles según lo aquí estipulado.
                    </p>
                </section>

            </main>
            <footer className="aviso-page-footer">
                <FooterMenu />
            </footer>
        </div>
    );
}