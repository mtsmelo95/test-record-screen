// ScreenRecorder.tsx
import { useState, useRef } from "react";

const ScreenRecorder = () => {
	const [recording, setRecording] =
		useState(false);
	const [videoUrl, setVideoUrl] = useState<
		string | null
	>(null);
	const mediaRecorderRef =
		useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream =
				await navigator.mediaDevices.getDisplayMedia(
					{
						video: true,
					},
				);

			const mediaRecorder = new MediaRecorder(
				stream,
			);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				chunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(
					chunksRef.current,
					{ type: "video/webm" },
				);
				const videoUrl =
					URL.createObjectURL(blob);
				setVideoUrl(videoUrl);
			};

			mediaRecorder.start();
			setRecording(true);
		} catch (error) {
			console.error(
				"Erro ao iniciar gravação da tela: ",
				error,
			);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}
		setRecording(false);
	};

	const downloadVideo = () => {
		if (videoUrl) {
			const a = document.createElement("a");
			a.href = videoUrl;
			a.download = "recording.webm";
			a.click();
		}
	};

	return (
		<div>
			<h1>Gravador de Tela</h1>
			{recording ? (
				<button onClick={stopRecording}>
					Parar Gravação
				</button>
			) : (
				<button onClick={startRecording}>
					Iniciar Gravação
				</button>
			)}

			{videoUrl && (
				<button onClick={downloadVideo}>
					Download Video
				</button>
			)}
		</div>
	);
};

export default ScreenRecorder;
