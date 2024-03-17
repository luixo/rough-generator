export type Recorder = {
  start: () => void;
  stop: () => Promise<string>;
};

export const createRecorder = (
  canvas: HTMLCanvasElement,
  fps = 30,
): Recorder => {
  let recordedChunks: Blob[] = [];
  const mediaRecorder = new MediaRecorder(canvas.captureStream(fps), {
    mimeType: "video/webm; codecs=vp9",
  });
  return {
    start: () => {
      if (mediaRecorder.state === "recording") {
        throw new Error("Media recorder is already started!");
      }
      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };
      mediaRecorder.start(1000);
    },
    stop: () => {
      if (mediaRecorder.state !== "recording") {
        throw new Error("Media recorder is not yet started!");
      }
      mediaRecorder.stop();
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, {
            type: "video/webm",
          });
          recordedChunks = [];
          resolve(URL.createObjectURL(blob));
        };
      });
    },
  };
};
