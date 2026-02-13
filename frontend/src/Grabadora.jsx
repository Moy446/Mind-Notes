import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Grabadora.css";
import AudioMenu from "./components/AudioMenu";
import clienteAxios from "./services/axios";
import Swal from "sweetalert2";

export default function Grabadora(props) {
    const [record, setRecord] = useState(false);
    const [openAudio, setOpen] = useState(false);

    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);
    //variables for recording audio
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [pacientData, setPatientData] = useState({
        idPaciente: '',
        nombrePaciente: '',
        resume: true,
        grabacion: false,
        audio: null
    });
    
    const handleClick = useCallback(async (pacientData) => {
        setPatientData(pacientData);
        if (!record) {
            await startVisualizer();
            setRecord(true);
            setOpen(false);
        } else {
            stopVisualizer();
            setRecord(false);
        }
    }, [record]);

    const handleOpenMenu = useCallback(() => {
        if (record) {
            stopVisualizer();
            setRecord(false);
            return;
        }

        setOpen(prev => !prev);
    }, [record]);

    const drawTopRoundedBar = (ctx, x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
    };

    const drawBottomRoundedBar = (ctx, x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width,
            y + height - radius
        );
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.fill();
    };

    const startVisualizer = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        //set up mediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };


        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = canvas.width / bufferLength;
            const centerY = canvas.height / 2;
            const centerX = canvas.width / 2;

            for (let i = 0; i < bufferLength; i++) {
                const value = dataArray[i] / 255;
                const barHeight = value * centerY;
                const barXOffset = i * barWidth;

                ctx.fillStyle = "#1e90ff";
                const radius = barWidth / 2;

                // Derecha - Arriba
                drawTopRoundedBar(
                    ctx,
                    centerX + barXOffset,
                    centerY - barHeight,
                    barWidth - 1,
                    barHeight,
                    radius
                );

                // Derecha - Abajo
                drawBottomRoundedBar(
                    ctx,
                    centerX + barXOffset,
                    centerY,
                    barWidth - 1,
                    barHeight,
                    radius
                );

                // Izquierda - Arriba
                drawTopRoundedBar(
                    ctx,
                    centerX - barXOffset - barWidth,
                    centerY - barHeight,
                    barWidth - 1,
                    barHeight,
                    radius
                );

                // Izquierda - Abajo
                drawBottomRoundedBar(
                    ctx,
                    centerX - barXOffset - barWidth,
                    centerY,
                    barWidth - 1,
                    barHeight,
                    radius
                );

            }
        };
        draw();
        mediaRecorder.start();
    };

    const stopVisualizer = () => {
        cancelAnimationFrame(animationRef.current);

        if (mediaRecorderRef.current){
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'grabacion.wav');
                formData.append('idPaciente', pacientData.idPaciente);
                formData.append('nombrePaciente', pacientData.nombrePaciente);
                formData.append('resume', pacientData.resume);
                formData.append('grabacion', pacientData.grabacion);
                clienteAxios.post('/psicologo/grabacion', formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    Swal.fire({
                        icon: 'warning',
                        title: 'La grabacion se esta procesando',
                        text: 'Se le enviará un mensaje por correo cuando el documento este listo',
                    });
                }).catch(e =>{
                    Swal.fire({
                        title: 'Hubo un problema para guardar el audio',
                        text: 'Disculpe las molestias, intenta de nuevo mas tarde',
                        icon: 'error'
                    });
                })
            }
        }

        streamRef.current?.getTracks().forEach(track => track.stop());
        audioCtxRef.current?.close();

        mediaRecorderRef.current = null;
        streamRef.current = null;
        audioCtxRef.current = null;
        analyserRef.current = null;
    };

    useEffect(() => {
        return () => stopVisualizer();
    }, []);

    return (
        <div className="grabadora">
            <canvas ref={canvasRef} width={1000} height={200} className="audio" />
            <div onClick={handleOpenMenu} className={`notRecord ${record ? "recording" : ""}`}>

            </div>

            <div className={openAudio ? "showPatients" : "hideMenuAudio"}>
                <AudioMenu handleClick={handleClick}/>
            </div>
        </div>
    );
}
