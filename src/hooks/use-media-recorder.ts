import React from "react";

import { useIsMounted } from "@react-hookz/web";

import type { Recorder } from "@/utils/media-recorder";
import { createRecorder } from "@/utils/media-recorder";

export const useMediaRecorder = (
	canvas: React.RefObject<HTMLCanvasElement | null>,
	fps = 30,
) => {
	const [isRecording, setRecording] = React.useState(false);
	const [recorder, setRecorder] = React.useState<Recorder | null>();
	React.useEffect(() => {
		if (!canvas.current) {
			return;
		}
		setRecorder(createRecorder(canvas.current, fps));
	}, [canvas, fps]);
	const start = React.useCallback(() => {
		if (recorder) {
			recorder.start();
			setRecording(true);
		} else {
			throw new Error("Recorder not yet created!");
		}
	}, [recorder]);
	const isMounted = useIsMounted();
	const stop = React.useCallback(async () => {
		if (recorder) {
			const stopPromise = recorder.stop();
			const result = await stopPromise;
			if (isMounted()) {
				setRecording(false);
			}
			return result;
		}
		throw new Error("Recorder not yet stopped!");
	}, [isMounted, recorder]);

	return { start, isRecording, stop };
};
