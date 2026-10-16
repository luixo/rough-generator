import type React from "react";

import type { RoughCanvas, RoughConfig } from "@/contexts/rough-context";
import type { CircleConfig } from "@/elements/circle";
import type { DoubleCircleConfig } from "@/elements/double-circle";
import type { FixedState } from "@/elements/groups/fixed-group";
import type { SpringConfig } from "@/elements/spring";

import type { CanvasSize } from "./canvas";

export type ElementPropsMapping = {
	circle: CircleConfig;
	"double-circle": DoubleCircleConfig;
	spring: SpringConfig;
};
export type ElementType = keyof ElementPropsMapping;

export type ElementsPreset<T extends ElementType> = {
	descriptions: ElementPropsMapping[T][];
};
export type BaseElementDescription<T extends keyof ElementPropsMapping> = {
	type: T;
	title: string;
	fixed: FixedState;
};
export type ElementComponentProps<T extends ElementType> =
	ElementPropsMapping[T] & {
		setState: React.Dispatch<React.SetStateAction<ElementPropsMapping[T]>>;
		onRemoveDialogOpen: () => void;
	};

export type FigureRenderer<T extends ElementType> = (
	canvas: RoughCanvas,
	props: ElementPropsMapping[T],
	canvasSize: CanvasSize,
) => void;

export type GetInitialState<T> = (opts: {
	size: CanvasSize;
	initialState?: T;
}) => T;

export type SubElementComponent<T, E = Record<string, unknown>> = React.FC<
	React.PropsWithChildren<
		T & { setState: React.Dispatch<React.SetStateAction<T>> } & E
	>
> & {
	getInitialState: GetInitialState<T>;
	getRoughConfig: (state: T) => RoughConfig;
};

export type ElementComponent<T extends ElementType> = React.FC<
	ElementComponentProps<T>
> & {
	renderFigure: FigureRenderer<T>;
};
