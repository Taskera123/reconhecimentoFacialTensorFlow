import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [faceMatcher, setFaceMatcher] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        const modelUrl = `${process.env.PUBLIC_URL}/models`;

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl)
        ]);

        const labeledDescriptors = await loadLabeledImages();

        if (isMounted && labeledDescriptors.length > 0) {
          setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
        }

        await startVideo();
      } catch (error) {
        console.error('Erro ao inicializar reconhecimento facial:', error);
      }
    };

    loadModels();

    return () => {
      isMounted = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar webcam:', error);
    }
  };

  const loadLabeledImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pessoas');

      if (!response.ok) {
        throw new Error(`Falha ao buscar pessoas: ${response.status}`);
      }

      const labels = await response.json();

      const descriptors = await Promise.all(labels.map(async (label) => {
        const imgUrl = `${process.env.PUBLIC_URL}/pessoas/${label}.jpg`;
        const img = await faceapi.fetchImage(imgUrl);
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          console.warn(`Não foi possível detectar o rosto de ${label}`);
          return null;
        }

        return new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]);
      }));

      return descriptors.filter(Boolean);
    } catch (error) {
      console.error('Erro ao carregar imagens rotuladas:', error);
      return [];
    }
  };

  const handleVideoOnPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      return;
    }

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');

      context.clearRect(0, 0, displaySize.width, displaySize.height);

      resizedDetections.forEach((detection) => {
        const box = detection.detection.box;
        let label = 'Desconhecido';

        if (faceMatcher) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          label = bestMatch.toString();
        }

        const drawBox = new faceapi.draw.DrawBox(box, { label });
        drawBox.draw(canvas);
        faceapi.draw.drawFaceLandmarks(canvas, [detection]);
      });
    }, 100);
  };

  return (
    <div style={{ position: 'relative', width: 720, height: 560, margin: '0 auto' }}>
      <h1>TESTE RECONHECIMENTO FACIAL SIGPAS</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        onPlay={handleVideoOnPlay}
        style={{ position: 'absolute' }}
      />
      <canvas
        ref={canvasRef}
        width="720"
        height="560"
        style={{ position: 'absolute' }}
      />
    </div>
  );
};

export default FaceRecognition;
