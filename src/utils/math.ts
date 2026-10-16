import type { CanvasSize } from "@/types/canvas";

export type VariationConfig<T> = Record<"base" | "variation", T>;
export type ValueWithVariationConfig<T> = VariationConfig<T> & { value: T };

export const random = (base: number) => Math.floor(Math.random() * base);

export type Constraint = {
	min: number;
	max: number;
	step: number;
};

export const applyConstraint = (input: number, constraint: Constraint) => {
	if (input > constraint.max) {
		return constraint.max;
	}
	if (input < constraint.min) {
		return constraint.min;
	}
	return input;
};

export const evaluateConfig = (input: VariationConfig<number>) =>
	input.base + input.variation * (Math.random() * 2 - 1);

export const getValueWithVarConfig = (
	bav: VariationConfig<number>,
): ValueWithVariationConfig<number> => ({
	base: bav.base,
	variation: bav.variation,
	value: evaluateConfig(bav),
});

export const applyVariatedConstraint = (
	input: ValueWithVariationConfig<number>,
	constraint: VariationConfig<Constraint>,
): ValueWithVariationConfig<number> => ({
	base: applyConstraint(input.base, constraint.base),
	variation: applyConstraint(input.variation, constraint.variation),
	value: applyConstraint(input.value, constraint.base),
});

export const rotatePoints = (
	points: [number, number][],
	around: [number, number],
	angle: number,
): [number, number][] => {
	const [xOrigin, yOrigin] = around;
	return points.map((point) => {
		const [x, y] = point;
		const xDelta = x - xOrigin;
		const yDelta = y - yOrigin;
		const xRotated = xDelta * Math.cos(angle) - yDelta * Math.sin(angle);
		const yRotated = xDelta * Math.sin(angle) + yDelta * Math.cos(angle);
		return [xRotated + xOrigin, yRotated + yOrigin];
	});
};

type BoundingBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const getBoundingBox = (points: [number, number][]): BoundingBox => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const [firstX, firstY] = points[0]!;
	const maxMins = points.reduce<
		Record<"minX" | "minY" | "maxX" | "maxY", number>
	>(
		(acc, [x, y]) => {
			if (x > acc.maxX) {
				acc.maxX = x;
			}
			if (x < acc.minX) {
				acc.minX = x;
			}
			if (y > acc.maxY) {
				acc.maxY = y;
			}
			if (y > acc.minY) {
				acc.minY = y;
			}
			return acc;
		},
		{
			minX: firstX,
			minY: firstY,
			maxX: firstX,
			maxY: firstY,
		},
	);
	return {
		x: maxMins.minX,
		y: maxMins.minY,
		height: maxMins.maxY - maxMins.minY,
		width: maxMins.maxX - maxMins.minX,
	};
};

export const getBoundingBoxCentralPoint = (
	boundingBox: BoundingBox,
): [number, number] => [
	boundingBox.x + boundingBox.width / 2,
	boundingBox.y + boundingBox.height / 2,
];

export const applySizeToValue = (value: number, size: number): number =>
	value + size / 2;

export const applySizeToValues = (
	[x, y]: [number, number],
	size: CanvasSize,
): [number, number] => [
	applySizeToValue(x, size.width),
	applySizeToValue(y, size.height),
];
