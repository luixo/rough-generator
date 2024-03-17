import React from "react";

import { useIsMounted } from "@react-hookz/web";
import { useStore } from "@tanstack/react-store";
import {
  AiOutlineArrowsAlt as ExpandIcon,
  AiOutlinePauseCircle as PauseIcon,
  AiOutlinePlayCircle as PlayIcon,
  AiOutlineTrademarkCircle as RecordIcon,
  AiOutlineRedo as RedoIcon,
  AiOutlineSave as SaveIcon,
  AiOutlineShrink as ShrinkIcon,
} from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RoughContext } from "@/contexts/rough-context";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useRaf } from "@/hooks/use-raf";
import { autoRenderStore, easyModeStore } from "@/state/settings";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export const AppControls: React.FC<Props> = ({ canvasRef }) => {
  const autoRender = useStore(autoRenderStore);
  const easyMode = useStore(easyModeStore);
  const { forceRefresh } = React.useContext(RoughContext);
  const [limitFps, setLimitFps] = React.useState(6);

  const saveData = React.useCallback(
    (prefix: string, extension: string, data: string) => {
      const link = document.createElement("a");
      link.setAttribute(
        "download",
        `${prefix}-${new Date().toLocaleTimeString("ru-RU")}.${extension}`,
      );
      link.setAttribute("href", data);
      link.click();
    },
    [],
  );

  const saveImage = React.useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
    saveData(
      "bg",
      "png",
      canvasRef.current
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream"),
    );
  }, [canvasRef, saveData]);

  const [isAnimating, setAnimating] = React.useState(false);
  useRaf(forceRefresh, isAnimating, limitFps);

  const { start, stop, isRecording } = useMediaRecorder(canvasRef);
  const isMounted = useIsMounted();
  const onVideoClick = React.useCallback(async () => {
    if (isRecording) {
      const result = await stop();
      if (isMounted()) {
        saveData("video", "webm", result);
      }
    } else {
      start();
    }
  }, [start, stop, isRecording, saveData, isMounted]);
  return (
    <div className="fixed top-3 right-3 z-10 flex flex-col gap-2">
      <Button onClick={forceRefresh} title="Обновить холст">
        <RedoIcon />
      </Button>
      <Button
        onClick={() => easyModeStore.setState((easyMode) => !easyMode)}
        title={easyMode ? "Сделать сложнее" : "Сделать проще"}
      >
        {easyMode ? <ExpandIcon /> : <ShrinkIcon />}
      </Button>
      <Button
        variant={autoRender ? "default" : "secondary"}
        onClick={() => autoRenderStore.setState((autoRender) => autoRender)}
        title={`${
          autoRender ? "Выключить" : "Включить"
        } перерисовку при изменении чего угодно`}
      >
        A
      </Button>
      <Button onClick={saveImage} title="Сохранить скриншот">
        <SaveIcon />
      </Button>
      <Button
        onClick={() => setAnimating((x) => !x)}
        title={isAnimating ? "Выключить анимацию" : "Включить анимацию"}
      >
        {isAnimating ? <PauseIcon /> : <PlayIcon />}
      </Button>
      {isAnimating ? (
        <Button
          onClick={onVideoClick}
          className={isRecording ? "animate-pulse border shadow-sm" : undefined}
          title={isRecording ? "Идет запись.." : "Начать запись!"}
        >
          <RecordIcon />
        </Button>
      ) : null}
      {isAnimating ? (
        <div className="fixed top-3 left-3 flex w-60 rounded-md bg-slate-300 p-3">
          <span className="mr-2 text-black">FPS</span>
          <Slider
            value={[limitFps]}
            min={1}
            max={15}
            step={1}
            onValueChange={(inputs) => setLimitFps(inputs[0])}
          />
        </div>
      ) : null}
    </div>
  );
};
