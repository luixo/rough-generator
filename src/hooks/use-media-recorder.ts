import React from "react";

import { useIsMounted } from "@react-hookz/web";

import type { Recorder } from "@/utils/media-recorder";
import { createRecorder } from "@/utils/media-recorder";

export const useMediaRecorder = (
	canvas: React.RefObject<HTMLCanvasElement | null>,
	fps = 30,
) => {
	const [recording, setRecording] = React.useState(false);
	const recorderRef = React.useRef<Recorder | null>(null);
	React.useEffect(() => {
		if (!canvas.current) {
			return;
		}
		recorderRef.current = createRecorder(canvas.current, fps);
		return () => {
			recorderRef.current = null;
		};
	}, [canvas, fps]);
	const start = React.useCallback(() => {
		const recorder = recorderRef.current;
		if (recorder) {
			recorder.start();
			setRecording(true);
		} else {
			throw new Error("Recorder not yet created!");
		}
	}, []);
	const isMounted = useIsMounted();
	const stop = React.useCallback(async () => {
		const recorder = recorderRef.current;
		if (recorder) {
			const stopPromise = recorder.stop();
			const result = await stopPromise;
			if (isMounted()) {
				setRecording(false);
			}
			return result;
		}
		throw new Error("Recorder not yet stopped!");
	}, [isMounted]);

	return { isRecording: recording, start, stop };
};
