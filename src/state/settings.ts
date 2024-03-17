import { Store } from "@tanstack/react-store";

export const canvasSizeStore = new Store({
  width: 1080,
  height: 540,
});
export const autoRenderStore = new Store(true);
export const easyModeStore = new Store(true);
