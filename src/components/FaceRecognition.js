import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [faceMatcher, setFaceMatcher] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      ]);
      const labeledDescriptors = await loadLabeledImages();
      setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.6));
      startVideo();
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => videoRef.current.srcObject = stream)
      .catch(err => console.error('Erro ao acessar webcam', err));
  };

  const loadLabeledImages = async () => {
    const response = await fetch('http://localhost:5000/api/pessoas');
    const labels = await response.json();

    return Promise.all(labels.map(async (label) => {
      const imgUrl = `${process.env.PUBLIC_URL}/pessoas/${label}.jpg`;
      const img = await faceapi.fetchImage(imgUrl);
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        console.warn(`Não foi possível detectar o rosto de ${label}`);
        return null;
      }
      return new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]);
    })).then(res => res.filter(Boolean));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const resized = faceapi.resizeResults(detections, displaySize);

      canvasRef.current.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);

      resized.forEach(detection => {
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: 'Desconhecido' });

        if (faceMatcher) {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          drawBox.options.label = bestMatch.toString();
        }

        drawBox.draw(canvasRef.current);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, [detection]);
      });
    }, 100);
  };

  return (
    <div style={{ position: 'center', width: 720, height: 560 }}>
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
