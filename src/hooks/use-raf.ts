import React from "react";

export const useRaf = (
	callback: (timeElapsed: number) => void,
	isActive: boolean,
	limitFps = 0,
): void => {
	const savedCallback = React.useRef<(timeElapsed: number) => void>(null);
	React.useLayoutEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useLayoutEffect(() => {
		let lastTime = performance.now();
		let rafHandler = 0;

		const loop = () => {
			// oxlint-disable-next-line no-use-before-define
			rafHandler = requestAnimationFrame(tick);
		};

		const tick = (now: number) => {
			const timeElapsed = now - lastTime;
			if (limitFps) {
				const minimumElapsed = 1000 / limitFps;
				if (timeElapsed < minimumElapsed) {
					loop();
					return;
				}
			}
			lastTime = now;
			savedCallback.current?.(timeElapsed);
			loop();
		};

		if (isActive) {
			loop();
			return () => cancelAnimationFrame(rafHandler);
		}
	}, [isActive, limitFps]);
};
