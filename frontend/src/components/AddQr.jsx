import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import QrScanner from 'qr-scanner'
import './AddQr.css'
import { vincularPaciente, vincularPsicologo } from '../services/vinculacionService'

export default function AddQr(props){

    const ref = useRef(null);
    const videoRef = useRef(null);
    const qrCanvasRef = useRef(null);
    const qrScannerRef = useRef(null);
    
    const [mode, setMode] = useState('menu'); // 'menu', 'generar', 'escanear'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [scanning, setScanning] = useState(false);

    console.log('Id:', props.userId);

    useEffect(() => {
        function handleClickOutside(event) {
            if (props.open && ref.current && !ref.current.contains(event.target)) {
                handleCerrar();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
            }
        };
    }, [props.handleOpen]);

    // Iniciar escaneo cuando cambia a modo escanear
    useEffect(() => {
        if (mode === 'escanear' && videoRef.current && !qrScannerRef.current) {
            iniciarEscaneo();
        }
        
        return () => {
            if (qrScannerRef.current && mode === 'escanear') {
                qrScannerRef.current.stop();
            }
        };
    }, [mode]);

    // Generar QR cuando entra en modo generar
    useEffect(() => {
        if (mode === 'generar' && props.userId) {
            // Pequeño delay para asegurar que el canvas está renderizado
            const timer = setTimeout(() => {
                generarQR();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [mode, props.userId]);

    const iniciarEscaneo = async () => {
        try {
            setScanning(true);
            setError('');
            
            QrScanner.hasCamera().then(hasCamera => {
                if (!hasCamera) {
                    setError('No se detectó cámara en este dispositivo');
                    setScanning(false);
                    return;
                }
            });

            qrScannerRef.current = new QrScanner(
                videoRef.current,
                result => handleQRDetectado(result.data),
                {
                    onDecodeError: () => {
                        // Error silencioso mientras escanea
                    },
                    preferredCamera: 'environment',
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            await qrScannerRef.current.start();
        } catch (err) {
            console.error('Error al iniciar escaneo:', err);
            setError('Error al acceder a la cámara. Verifica los permisos.');
            setScanning(false);
        }
    };

    const generarQR = async () => {
        try {
            if (!qrCanvasRef.current) {
                console.error('Canvas no está disponible');
                setError('Error: Canvas no disponible');
                return;
            }

            if (!props.userId) {
                console.error('userId no disponible:', props.userId);
                setError('Error: ID de usuario no disponible');
                return;
            }

            console.log('Generando QR para:', props.userId);

            // Generar QR y dibujarlo en el canvas
            await QRCode.toCanvas(qrCanvasRef.current, String(props.userId), {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                width: 256,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                }
            });

            console.log('QR generado exitosamente');
        } catch (err) {
            console.error('Error generando QR:', err);
            setError('Error al generar el código QR: ' + err.message);
        }
    };

    const handleQRDetectado = async (data) => {
        // Detener escaneo cuando detecta un QR
        if (qrScannerRef.current) {
            await qrScannerRef.current.stop();
        }
        setScanning(false);

        // Procesar el UID escaneado
        await procesarUIDEscaneado(data);
    };

    const procesarUIDEscaneado = async (uid) => {
        if (!uid || uid.trim().length !== 24) {
            setError('Código QR inválido. El UID debe tener 24 caracteres.');
            // Reanudar escaneo
            if (qrScannerRef.current && mode === 'escanear') {
                setScanning(true);
                qrScannerRef.current.start();
            }
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const userRole = props.userRole || 'psicologo';
            const userId = props.userId;

            let result;
            if (userRole === 'psicologo') {
                result = await vincularPaciente(userId, uid.trim());
            } else {
                result = await vincularPsicologo(userId, uid.trim());
            }

            if (result.success) {
                setSuccess(result.message);
                
                if (props.onVinculacionExitosa) {
                    props.onVinculacionExitosa();
                }

                setTimeout(() => {
                    handleCerrar();
                }, 2000);
            }
        } catch (err) {
            console.error('Error al vincular:', err);
            setError(
                err.response?.data?.message || 
                'Error al vincular. Verifique que el QR sea válido.'
            );
            
            // Reanudar escaneo en caso de error
            if (qrScannerRef.current && mode === 'escanear') {
                setScanning(true);
                qrScannerRef.current.start();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCerrar = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
        }
        setMode('menu');
        setError('');
        setSuccess('');
        setScanning(false);
        props.handleOpen();
    };

    const handleVolver = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
        }
        setMode('menu');
        setError('');
        setSuccess('');
        setScanning(false);
    };

    if (!props.open) return null;

    return (
        <div ref={ref} className='addqr'>
            {/* MENÚ PRINCIPAL */}
            {mode === 'menu' && (
                <>
                    <span className='title-addqr'>Código QR</span>
                    <div className='qr-menu'>
                        <button 
                            className='btn-qr-option btnefect'
                            onClick={() => setMode('generar')}
                        >
                            📱 Ver mi QR
                        </button>
                        <button 
                            className='btn-qr-option btnefect'
                            onClick={() => setMode('escanear')}
                        >
                            📸 Escanear QR
                        </button>
                    </div>
                    <button className='cancel-addqr' onClick={handleCerrar}>Cancelar</button>
                </>
            )}

            {/* GENERAR QR */}
            {mode === 'generar' && (
                <>
                    <span className='title-addqr'>Tu código QR</span>
                    <div className='qr-container'>
                        <p className='qr-info'>Comparte este código para que se vinculen contigo</p>
                        <div className='qr-code-box'>
                            <canvas ref={qrCanvasRef} width={256} height={256}></canvas>
                        </div>
                        <p className='qr-userid'>ID: {props.userId}</p>
                    </div>
                    <button className='btn-volver btnefect' onClick={handleVolver}>Atrás</button>
                    <button className='cancel-addqr' onClick={handleCerrar}>Cerrar</button>
                </>
            )}

            {/* ESCANEAR QR */}
            {mode === 'escanear' && (
                <>
                    <span className='title-addqr'>Escanear QR</span>
                    <div className='scanner-container'>
                        <video ref={videoRef} className='video-scanner'></video>
                        {!scanning && (
                            <div className='scanner-overlay'>
                                <p>Buscando cámara...</p>
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className='error-message'>
                            ❌ {error}
                        </div>
                    )}
                    {success && (
                        <div className='success-message'>
                            ✓ {success}
                        </div>
                    )}
                    {loading && (
                        <div className='loading-message'>
                            ⏳ Vinculando...
                        </div>
                    )}

                    <button className='btn-volver btnefect' onClick={handleVolver} disabled={loading}>Atrás</button>
                    <button className='cancel-addqr' onClick={handleCerrar} disabled={loading}>Cerrar</button>
                </>
            )}
        </div>
    );
}