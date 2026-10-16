import { Store } from "@tanstack/react-store";

export const canvasSizeStore = new Store({
	height: 540,
	width: 1080,
});
export const autoRenderStore = new Store(true);
export const easyModeStore = new Store(true);
