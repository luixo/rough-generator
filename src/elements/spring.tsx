import { useStore } from "@tanstack/react-store";

import { Separator } from "@/components/ui/separator";
import type { RoughCanvas } from "@/contexts/rough-context";
import { VariationFixedContext } from "@/contexts/variation-fixed-context";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { easyModeStore } from "@/state/settings";
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
	getBoundingBox,
	getBoundingBoxCentralPoint,
	getValueWithVarConfig,
	rotatePoints,
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

const getConstraints = (): Record<
	"scale" | "turns" | "angle",
	VariationConfig<Constraint>
> => ({
	scale: {
		base: {
			min: 1,
			step: 1,
			max: 100,
		},
		variation: {
			min: 0,
			step: 0.2,
			max: 3,
		},
	},
	turns: {
		base: {
			min: 3,
			step: 1,
			max: 8,
		},
		variation: {
			min: 0,
			step: 0.2,
			max: 4,
		},
	},
	angle: {
		base: {
			min: 0,
			step: 3,
			max: 365,
		},
		variation: {
			min: 0,
			step: 1,
			max: 180,
		},
	},
});

const getInitialTitle = (title?: string): string => title || "Пружинка";

const getInitialScale = (
	state?: ValueWithVariationConfig<number>,
): ValueWithVariationConfig<number> => {
	const constraint = getConstraints().scale;
	const scale =
		state ||
		getValueWithVarConfig({
			base: 4,
			variation: 0,
		});
	return applyVariatedConstraint(scale, constraint);
};

const getInitialTurns = (
	state?: ValueWithVariationConfig<number>,
): ValueWithVariationConfig<number> => {
	const constraint = getConstraints().turns;
	const turns =
		state ||
		getValueWithVarConfig({
			base: 4,
			variation: 0,
		});
	return applyVariatedConstraint(turns, constraint);
};

const getInitialAngle = (
	state?: ValueWithVariationConfig<number>,
): ValueWithVariationConfig<number> => {
	const constraint = getConstraints().angle;
	const angle =
		state ||
		getValueWithVarConfig({
			base: 45,
			variation: 10,
		});
	return applyVariatedConstraint(angle, constraint);
};

const SPRING_SIZE = 1;
const SPRING_COEFFICIENT = 3;

export type SpringConfig = BaseElementDescription<"spring"> & {
	coordinates: CoordinatesState;
	curve: CurveState;
	stroke: StrokeState;
	roughness: RoughnessState;
	scale: ValueWithVariationConfig<number>;
	turns: ValueWithVariationConfig<number>;
	angle: ValueWithVariationConfig<number>;
};

export const Spring: ElementComponent<"spring"> = ({
	setState,
	fixed,
	title,
	onRemoveDialogOpen,
	coordinates,
	scale,
	turns,
	angle,
	stroke,
	curve,
	roughness,
}) => {
	const easyMode = useStore(easyModeStore);
	const constraints = getConstraints();

	const setStroke = usePartialSetState(setState, "stroke");
	const setCurve = usePartialSetState(setState, "curve");
	const setCoordinates = usePartialSetState(setState, "coordinates");
	const setRoughness = usePartialSetState(setState, "roughness");
	const setFixed = usePartialSetState(setState, "fixed");
	const setTitle = usePartialSetState(setState, "title");
	const setScale = usePartialSetState(setState, "scale");
	const setTurns = usePartialSetState(setState, "turns");
	const setAngle = usePartialSetState(setState, "angle");

	return (
		<VariationFixedContext.Provider value={fixed.variation}>
			<RoughElementWrapper
				title={title}
				onChange={setTitle}
				onRemoveDialogOpen={onRemoveDialogOpen}
			>
				<CoordinatesGroup {...coordinates} setState={setCoordinates}>
					<NumberWithVariation
						title="Масштаб"
						constraint={constraints.scale}
						{...scale}
						setState={setScale}
						vertical
					/>
					<NumberWithVariation
						title="Изгибов"
						constraint={constraints.turns}
						{...turns}
						setState={setTurns}
						vertical
					/>
					<NumberWithVariation
						title="Поворот"
						constraint={constraints.angle}
						{...angle}
						setState={setAngle}
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
	initialState?: SpringConfig;
}): SpringConfig => ({
	type: "spring",
	coordinates: CoordinatesGroup.getInitialState({
		size,
		initialState: initialState?.coordinates,
	}),
	stroke: StrokeGroup.getInitialState({
		size,
		initialState: initialState?.stroke,
	}),
	roughness: RoughnessGroup.getInitialState({
		size,
		initialState: initialState?.roughness,
	}),
	title: getInitialTitle(initialState?.title),
	fixed: FixedGroup.getInitialState({
		size,
		initialState: initialState?.fixed,
	}),
	curve: CurveGroup.getInitialState({
		size,
		initialState: initialState?.curve,
	}),
	scale: getInitialScale(initialState?.scale),
	turns: getInitialTurns(initialState?.turns),
	angle: getInitialAngle(initialState?.angle),
});

Spring.renderFigure = (
	canvas: RoughCanvas,
	{
		scale,
		coordinates,
		angle,
		curve,
		fixed,
		roughness,
		stroke,
		turns,
	}: SpringConfig,
	canvasSize: CanvasSize,
) => {
	const scaleVariated = scale.value;
	const startPoint: [number, number] = [
		coordinates.x.value,
		coordinates.y.value,
	];
	const points = Array.from({ length: Math.floor(turns.value) }).reduce<
		[number, number][]
	>(
		(acc, _, index) => {
			const xSize = scaleVariated * SPRING_SIZE;
			const offset = index * xSize * 4;
			const ySize = xSize * SPRING_COEFFICIENT;
			return [
				...acc,
				[startPoint[0] + offset + xSize, startPoint[1] + ySize],
				[startPoint[0] + offset + xSize * 2, startPoint[1]],
				[startPoint[0] + offset + xSize * 3, startPoint[1] + -ySize],
				[startPoint[0] + offset + xSize * 4, startPoint[1]],
			];
		},
		[startPoint],
	);
	const angleVariated = angle.value;
	const boundingBox = getBoundingBox(points);
	const centralPoint = getBoundingBoxCentralPoint(boundingBox);
	const rotatedPoints = rotatePoints(
		points,
		centralPoint,
		((Math.PI * 2) / 365) * angleVariated,
	);
	const shiftedPoints = rotatedPoints.map((point) =>
		applySizeToValues(point, canvasSize),
	);
	canvas.curve(shiftedPoints, {
		...CoordinatesGroup.getRoughConfig(coordinates),
		...CurveGroup.getRoughConfig(curve),
		...FixedGroup.getRoughConfig(fixed),
		...RoughnessGroup.getRoughConfig(roughness),
		...StrokeGroup.getRoughConfig(stroke),
	});
};
