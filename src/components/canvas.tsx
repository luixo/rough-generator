import React from "react";

import { useMountEffect, useWindowSize } from "@react-hookz/web";
import { useStore } from "@tanstack/react-store";

import { Slider } from "@/components/ui/slider";
import { canvasSizeStore } from "@/state/settings";

type Props = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export const Canvas: React.FC<Props> = ({ canvasRef }) => {
	const canvasSize = useStore(canvasSizeStore);
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const [maxWidth, setMaxWidth] = React.useState(canvasSize.width);
	const { width: windowWidth } = useWindowSize();
	useMountEffect(() => {
		canvasSizeStore.setState({ height: canvasSize.height, width: maxWidth });
	});
	React.useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) {
			return;
		}
		const nextMaxWidth = wrapper.offsetWidth;
		setMaxWidth(nextMaxWidth);
		canvasSizeStore.setState((state) => ({
			...state,
			width: nextMaxWidth,
		}));
		// oxlint-disable-next-line react/exhaustive-effect-dependencies
	}, [windowWidth]);
	return (
		<div ref={wrapperRef} className="flex flex-col gap-4">
			<Slider
				className="w-full"
				value={[canvasSize.width / maxWidth]}
				min={0.1}
				max={1}
				step={0.01}
				onValueChange={(values) =>
					canvasSizeStore.setState((state) => ({
						...state,
						width: values[0] * maxWidth,
					}))
				}
			/>
			<div
				className="self-center"
				style={{ height: canvasSize.height, width: canvasSize.width }}
			>
				<div className="pointer-events-none z-10 mt-1 box-content origin-top-left overflow-auto border border-black bg-white">
					{/* Если убрать className - внешние элементы будут считать его высоту важной для расчета своей */}
					<canvas className="block" ref={canvasRef} />
				</div>
			</div>
		</div>
	);
};
