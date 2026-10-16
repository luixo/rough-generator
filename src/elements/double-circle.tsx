import { useStore } from "@tanstack/react-store";

import { Separator } from "@/components/ui/separator";
import type { RoughCanvas } from "@/contexts/rough-context";
import { VariationFixedContext } from "@/contexts/variation-fixed-context";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { canvasSizeStore, easyModeStore } from "@/state/settings";
import type { CanvasSize } from "@/types/canvas";
import type {
	BaseElementDescription,
	ElementComponent,
} from "@/types/element-types";
import type {
	Constraint,
	ValueWithVariationConfig,
	VariationConfig,
} from "@/utils/math";
import {
	applySizeToValues,
	applyVariatedConstraint,
	getValueWithVarConfig,
	random,
} from "@/utils/math";
import { RoughElementWrapper } from "@/views/rough-element-wrapper";

import { CoordinatesGroup } from "./groups/coordinates-group";
import type { CoordinatesState } from "./groups/coordinates-group";
import { CurveGroup } from "./groups/curve-group";
import type { CurveState } from "./groups/curve-group";
import { FixedGroup } from "./groups/fixed-group";
import { NumberWithVariation } from "./groups/number-with-variation";
import { RoughnessGroup } from "./groups/roughness-group";
import type { RoughnessState } from "./groups/roughness-group";
import { StrokeGroup } from "./groups/stroke-group";
import type { StrokeState } from "./groups/stroke-group";

const getInitialTitle = (title?: string) => title ?? "Два обода";

const getConstraints = (
	canvasSize: CanvasSize,
): Record<"radius" | "radiusCoefficient", VariationConfig<Constraint>> => {
	const { width, height } = canvasSize;
	const avgSize = (width + height) / 2;
	return {
		radius: {
			base: {
				max: Math.ceil(avgSize * 0.3),
				min: Math.ceil(avgSize * 0.01),
				step: 10,
			},
			variation: {
				max: Math.floor(avgSize * 0.1),
				min: 0,
				step: 2,
			},
		},
		radiusCoefficient: {
			base: {
				max: 1,
				min: 0.3,
				step: 0.05,
			},
			variation: {
				max: 0.3,
				min: 0,
				step: 0.001,
			},
		},
	};
};

const getInitialRadius = ({
	size,
	initialState,
}: {
	size: CanvasSize;
	initialState?: ValueWithVariationConfig<number>;
}): ValueWithVariationConfig<number> => {
	const constraint = getConstraints(size).radius;
	const { width, height } = size;
	const avgSize = (width + height) / 2;
	const radius =
		initialState ||
		getValueWithVarConfig({
			base: constraint.base.min * 3 + random(avgSize * 0.1),
			variation: 0,
		});
	return applyVariatedConstraint(radius, constraint);
};

const getInitialRadiusCoefficient = ({
	size,
	initialState,
}: {
	size: CanvasSize;
	initialState?: ValueWithVariationConfig<number>;
}): ValueWithVariationConfig<number> => {
	const constraint = getConstraints(size).radiusCoefficient;
	const radius =
		initialState ||
		getValueWithVarConfig({
			base: 0.7 + random(0.3),
			variation: 0,
		});
	return applyVariatedConstraint(radius, constraint);
};

export type DoubleCircleConfig = BaseElementDescription<"double-circle"> & {
	coordinates: CoordinatesState;
	curve: CurveState;
	stroke: StrokeState;
	roughness: RoughnessState;
	radius: ValueWithVariationConfig<number>;
	radiusCoefficient: ValueWithVariationConfig<number>;
};

export const DoubleCircle: ElementComponent<"double-circle"> = ({
	setState,
	fixed,
	title,
	onRemoveDialogOpen,
	coordinates,
	radius,
	radiusCoefficient,
	stroke,
	curve,
	roughness,
}) => {
	const canvasSize = useStore(canvasSizeStore);
	const easyMode = useStore(easyModeStore);
	const constraints = getConstraints(canvasSize);

	const setStroke = usePartialSetState(setState, "stroke");
	const setCurve = usePartialSetState(setState, "curve");
	const setCoordinates = usePartialSetState(setState, "coordinates");
	const setRoughness = usePartialSetState(setState, "roughness");
	const setFixed = usePartialSetState(setState, "fixed");
	const setTitle = usePartialSetState(setState, "title");
	const setRadius = usePartialSetState(setState, "radius");
	const setRadiusCoefficient = usePartialSetState(
		setState,
		"radiusCoefficient",
	);

	return (
		<VariationFixedContext.Provider value={fixed.variation}>
			<RoughElementWrapper
				title={title}
				onChange={setTitle}
				onRemoveDialogOpen={onRemoveDialogOpen}
			>
				<CoordinatesGroup {...coordinates} setState={setCoordinates}>
					<NumberWithVariation
						title="Радиус"
						constraint={constraints.radius}
						{...radius}
						setState={setRadius}
						vertical
					/>
					<NumberWithVariation
						title="Коэффициент"
						constraint={constraints.radiusCoefficient}
						{...radiusCoefficient}
						setState={setRadiusCoefficient}
						vertical
					/>
				</CoordinatesGroup>
				<Separator className="my-4" />
				<StrokeGroup {...stroke} setState={setStroke} />
				{easyMode ? null : <CurveGroup {...curve} setState={setCurve} />}
				<Separator className="my-4" />
				<div>
					<RoughnessGroup {...roughness} setState={setRoughness} />
					<FixedGroup {...fixed} setState={setFixed} />
				</div>
			</RoughElementWrapper>
		</VariationFixedContext.Provider>
	);
};

export const getInitialState = ({
	size,
	initialState,
}: {
	size: CanvasSize;
	initialState?: DoubleCircleConfig;
}): DoubleCircleConfig => ({
	coordinates: CoordinatesGroup.getInitialState({
		initialState: initialState?.coordinates,
		size,
	}),
	curve: CurveGroup.getInitialState({
		initialState: initialState?.curve,
		size,
	}),
	fixed: FixedGroup.getInitialState({
		initialState: initialState?.fixed,
		size,
	}),
	radius: getInitialRadius({
		initialState: initialState?.radius,
		size,
	}),
	radiusCoefficient: getInitialRadiusCoefficient({
		initialState: initialState?.radiusCoefficient,
		size,
	}),
	roughness: RoughnessGroup.getInitialState({
		initialState: initialState?.roughness,
		size,
	}),
	stroke: StrokeGroup.getInitialState({
		initialState: initialState?.stroke,
		size,
	}),
	title: getInitialTitle(initialState?.title),
	type: "double-circle",
});

DoubleCircle.renderFigure = (
	canvas: RoughCanvas,
	props: DoubleCircleConfig,
	canvasSize: CanvasSize,
) => {
	const bigRadius = props.radius.value;
	const smallRadius = props.radiusCoefficient.value * bigRadius;
	const options = {
		...CoordinatesGroup.getRoughConfig(props.coordinates),
		...CurveGroup.getRoughConfig(props.curve),
		...FixedGroup.getRoughConfig(props.fixed),
		...RoughnessGroup.getRoughConfig(props.roughness),
		...StrokeGroup.getRoughConfig(props.stroke),
	};
	const [x, y] = applySizeToValues(
		[props.coordinates.x.value, props.coordinates.y.value],
		canvasSize,
	);
	canvas.circle(x, y, bigRadius * 2, options);
	canvas.circle(x, y, smallRadius * 2, options);
};
