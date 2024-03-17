import React from "react";

import { doNothing } from "remeda";
import type roughjs from "roughjs";

export type RoughCanvas = ReturnType<typeof roughjs.canvas>;
export type RoughConfig = NonNullable<
  Parameters<typeof roughjs.generator>[number]
>["options"];
export type CanvasRenderer = (roughCanvas: RoughCanvas) => void;

type RemoveRenderer = () => void;

type RoughContextType = {
  addRenderer: (renderer: CanvasRenderer) => RemoveRenderer;
  forceRefresh: () => void;
  forcedCounter: number;
};

const noop = doNothing();

export const RoughContext = React.createContext<RoughContextType>({
  addRenderer: () => noop,
  forceRefresh: noop,
  forcedCounter: 0,
});
