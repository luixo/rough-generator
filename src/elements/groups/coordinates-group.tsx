import { useStore } from "@tanstack/react-store";

import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { canvasSizeStore } from "@/state/settings";
import type { CanvasSize } from "@/types/canvas";
import type { SubElementComponent } from "@/types/element-types";
import {
	applyVariatedConstraint,
	getValueWithVarConfig,
	random,
} from "@/utils/math";
import type {
	Constraint,
	ValueWithVariationConfig,
	VariationConfig,
} from "@/utils/math";

import { NumberWithVariation } from "./number-with-variation";

const getConstraint = (size: number): VariationConfig<Constraint> => ({
	base: {
		min: -size / 2,
		max: size / 2,
		step: 10,
	},
	variation: {
		min: 0,
		max: size * 0.5,
		step: 2,
	},
});

const getConstraints = (
	canvasSize: CanvasSize,
): CoordinatesPrevariation<Constraint> => {
	const { width, height } = canvasSize;
	return {
		x: getConstraint(width),
		y: getConstraint(height),
	};
};

const getCoordinateInitialState = (
	size: number,
	input: ValueWithVariationConfig<number> | undefined,
	constraint: VariationConfig<Constraint>,
) => {
	const coordinate =
		input ||
		getValueWithVarConfig({
			base: random(size) - size / 2,
			variation: 0,
		});
	return applyVariatedConstraint(coordinate, constraint);
};

type CoordinatesVariation<T> = Record<"x" | "y", ValueWithVariationConfig<T>>;
type CoordinatesPrevariation<T> = Record<"x" | "y", VariationConfig<T>>;
export type CoordinatesState = CoordinatesVariation<number>;

export const CoordinatesGroup: SubElementComponent<CoordinatesState> = ({
	setState,
	x,
	y,
	children,
}) => {
	const canvasSize = useStore(canvasSizeStore);
	const constraints = getConstraints(canvasSize);

	const setX = usePartialSetState(setState, "x");
	const setY = usePartialSetState(setState, "y");

	return (
		<div>
			<NumberWithVariation
				title="Координата X"
				constraint={constraints.x}
				{...x}
				setState={setX}
				vertical
			/>
			<NumberWithVariation
				title="Координата Y"
				constraint={constraints.y}
				{...y}
				setState={setY}
				vertical
			/>
			{children}
		</div>
	);
};

CoordinatesGroup.getInitialState = ({ size: canvasSize, initialState }) => {
	const { width, height } = canvasSize;
	const constraints = getConstraints(canvasSize);
	return {
		x: getCoordinateInitialState(width, initialState?.x, constraints.x),
		y: getCoordinateInitialState(height, initialState?.y, constraints.y),
	};
};

CoordinatesGroup.getRoughConfig = () => ({});
