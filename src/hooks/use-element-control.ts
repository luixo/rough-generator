import React from "react";

import { useFirstMountState, useLocalStorageValue } from "@react-hookz/web";
import { useStore } from "@tanstack/react-store";
import { isDeepEqual } from "remeda";
import { v4 } from "uuid";

import { canvasSizeStore } from "@/state/settings";
import type { CanvasSize } from "@/types/canvas";
import type {
	ElementPropsMapping,
	ElementType,
	ElementsPreset,
	GetInitialState,
} from "@/types/element-types";
import { updateSetStateAction } from "@/utils/react";

type Element<T extends ElementType> = {
	id: string;
	data: ElementPropsMapping[T];
};

const getElementWithContext = <T extends ElementType>(
	getInitialState: GetInitialState<ElementPropsMapping[T]>,
	size: CanvasSize,
	initialState?: ElementPropsMapping[T],
): Element<T> => ({
	id: v4(),
	data: getInitialState({ size, initialState }),
});

export const useElementControl = (
	getInitialStateByType: <T extends ElementType>(
		type: T,
	) => GetInitialState<ElementPropsMapping[ElementType]>,
) => {
	const canvasSize = useStore(canvasSizeStore);
	const { value: preset, set: setPreset } =
		useLocalStorageValue<ElementsPreset<ElementType> | null>("last_used", {
			defaultValue: null,
		});
	const [elements, setElements] = React.useState<Element<ElementType>[]>([]);

	const overwriteElementDescriptions = React.useCallback(
		(descriptions: ElementPropsMapping[ElementType][]) => {
			setElements(
				descriptions.map((description) =>
					getElementWithContext(
						getInitialStateByType(description.type),
						canvasSize,
						description,
					),
				),
			);
		},
		[canvasSize, getInitialStateByType],
	);

	const isFirstMountState = useFirstMountState();
	React.useEffect(() => {
		if (isFirstMountState) {
			if (preset) {
				// Если это эффект на маунте и есть сохраненный в localStorage пресет - загружаем его.
				overwriteElementDescriptions(preset.descriptions);
			}
		} else {
			const nextPreset = {
				descriptions: elements.map((element) => element.data),
			};
			if (isDeepEqual(nextPreset, preset)) {
				return;
			}
			// Если это эффект не на маунте то сохраняем в localStorage текущий пресет.
			setPreset(nextPreset);
		}
	}, [
		elements,
		isFirstMountState,
		overwriteElementDescriptions,
		preset,
		setPreset,
	]);

	const modifyElementById = React.useCallback(
		<T extends ElementType>(
			id: string,
			setStateAction: React.SetStateAction<ElementPropsMapping[T]>,
		) => {
			setElements((prevElements) => {
				const elementIndex = prevElements.findIndex(
					(element) => element.id === id,
				);
				if (elementIndex === -1) {
					throw new Error(`Element ${id} not found!`);
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const currElement = prevElements[elementIndex]!;
				const nextData = updateSetStateAction(
					setStateAction,
					currElement.data as ElementPropsMapping[T],
				);
				return [
					...prevElements.slice(0, elementIndex),
					{
						...currElement,
						data: nextData,
					},
					...prevElements.slice(elementIndex + 1),
				];
			});
		},
		[setElements],
	);

	const deleteElementById = React.useCallback(
		(id: string) => {
			setElements((prevElements) =>
				prevElements.filter((element) => element.id !== id),
			);
		},
		[setElements],
	);

	const createElement = React.useCallback(
		(type: ElementType) => {
			setElements((prevElements) => [
				...prevElements,
				getElementWithContext(getInitialStateByType(type), canvasSize),
			]);
		},
		[canvasSize, getInitialStateByType],
	);

	const overwriteAll = React.useCallback(
		(overwritePreset: ElementsPreset<ElementType>) =>
			overwriteElementDescriptions(overwritePreset.descriptions),
		[overwriteElementDescriptions],
	);

	const resetAll = React.useCallback(() => {
		setElements([]);
	}, [setElements]);

	return {
		elements,
		preset,

		createElement,
		modifyElementById,
		deleteElementById,

		overwrite: overwriteAll,
		reset: resetAll,
	};
};
