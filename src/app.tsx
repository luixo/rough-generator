import React from "react";

import { useStore } from "@tanstack/react-store";
import roughjs from "roughjs";

import { AppControls } from "@/components/app-controls";
import { Canvas } from "@/components/canvas";
import { ControlPanel } from "@/components/control-panel";
import type { CanvasRenderer, RoughCanvas } from "@/contexts/rough-context";
import { RoughContext } from "@/contexts/rough-context";
import { autoRenderStore, canvasSizeStore } from "@/state/settings";

type RemoveRenderer = () => void;

type CanvasResult = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	forceRefresh: () => void;
	forcedCounter: number;
	addRenderer: (renderer: CanvasRenderer) => RemoveRenderer;
};

const useCanvas = (): CanvasResult => {
	const canvasSize = useStore(canvasSizeStore);
	const autoRender = useStore(autoRenderStore);

	const [counter, setCounter] = React.useState(0);
	const [forcedCounter, setForcedUpdateCounter] = React.useState(0);
	const refresh = React.useCallback(
		() => setCounter((c) => c + 1),
		[setCounter],
	);
	const forceRefresh = React.useCallback(
		() => setForcedUpdateCounter((c) => c + 1),
		[setForcedUpdateCounter],
	);

	const { width, height } = canvasSize;

	const [renderers, setRenderers] = React.useState<CanvasRenderer[]>([]);
	const addRenderer = React.useCallback(
		(renderer: CanvasRenderer) => {
			setRenderers((prevRenderers) => [...prevRenderers, renderer]);
			if (autoRender) {
				refresh();
			}
			return () => {
				setRenderers((prevRenderers) =>
					prevRenderers.filter((lookup) => lookup !== renderer),
				);
				if (autoRender) {
					refresh();
				}
			};
		},
		[setRenderers, autoRender, refresh],
	);

	const [roughCanvas, setRoughCanvas] = React.useState<RoughCanvas>();
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			setRoughCanvas(roughjs.canvas(canvas));
		}
	}, []);
	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.width = width;
			canvas.height = height;
		}
	}, [width, height]);
	React.useEffect(() => {
		if (!roughCanvas) {
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const canvasContext = canvasRef.current!.getContext("2d")!;
		canvasContext.fillStyle = "white";
		canvasContext.fillRect(0, 0, width, height);
		renderers.forEach((renderer) => renderer(roughCanvas));
		return () => {
			canvasContext.clearRect(0, 0, width, height);
		};
	}, [counter, forcedCounter, height, renderers, roughCanvas, width]);

	return {
		canvasRef,
		forceRefresh,
		forcedCounter,
		addRenderer,
	};
};

export const App: React.FC = () => {
	const { canvasRef, forceRefresh, forcedCounter, addRenderer } = useCanvas();

	const roughContext = React.useMemo(
		() => ({ addRenderer, forceRefresh, forcedCounter }),
		[addRenderer, forceRefresh, forcedCounter],
	);

	return (
		<main className="h-full">
			<RoughContext.Provider value={roughContext}>
				<div className="size-full p-4">
					<h1 className="text-3xl">Генерация фона</h1>
					<div className="flex flex-col pr-12 md:flex-row">
						<Canvas canvasRef={canvasRef} />
						<div className="grow overflow-auto">
							<ControlPanel />
						</div>
					</div>
				</div>
				<AppControls canvasRef={canvasRef} />
			</RoughContext.Provider>
		</main>
	);
};
