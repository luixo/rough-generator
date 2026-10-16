import React from "react";

import { useStore } from "@tanstack/react-store";
import { keys } from "remeda";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RoughContext } from "@/contexts/rough-context";
import type { CanvasRenderer } from "@/contexts/rough-context";
import {
	Circle,
	getInitialState as getInitialCircleState,
} from "@/elements/circle";
import {
	DoubleCircle,
	getInitialState as getInitialDoubleCircleState,
} from "@/elements/double-circle";
import {
	Spring,
	getInitialState as getInitialSpringState,
} from "@/elements/spring";
import { useBooleanState } from "@/hooks/use-boolean-state";
import { useElementControl } from "@/hooks/use-element-control";
import { canvasSizeStore } from "@/state/settings";
import type {
	ElementPropsMapping,
	ElementType,
	GetInitialState,
} from "@/types/element-types";
import { PresetProviderPanel } from "@/views/preset-provider-panel";

const elementsRecord: Record<ElementType, true> = {
	circle: true,
	"double-circle": true,
	spring: true,
};
const elementTypes = keys(elementsRecord);

const getNameByType = (type: ElementType): string => {
	switch (type) {
		case "circle": {
			return "круг";
		}
		case "double-circle": {
			return "обода";
		}
		case "spring": {
			return "пружинка";
		}
	}
};
const getInitialStateByType = <T extends ElementType>(type: T) => {
	switch (type) {
		case "circle": {
			return getInitialCircleState;
		}
		case "double-circle": {
			return getInitialDoubleCircleState as GetInitialState<
				ElementPropsMapping["double-circle"]
			>;
		}
		case "spring": {
			return getInitialSpringState as GetInitialState<
				ElementPropsMapping["spring"]
			>;
		}
	}
};

const getRenderedByType = (type: ElementType) => {
	switch (type) {
		case "circle": {
			return Circle.renderFigure;
		}
		case "double-circle": {
			return DoubleCircle.renderFigure;
		}
		case "spring": {
			return Spring.renderFigure;
		}
	}
};

const componentsByType = {
	circle: Circle,
	"double-circle": DoubleCircle,
	spring: Spring,
};

type RenderedElementProps<T extends ElementType> = {
	id: string;
	data: ElementPropsMapping[T];
	modifyElementById: (
		id: string,
		action: React.SetStateAction<ElementPropsMapping[T]>,
	) => void;
	deleteElementById: (id: string) => void;
};

const RenderedElement = <T extends ElementType>({
	data,
	id,
	modifyElementById,
	deleteElementById,
}: RenderedElementProps<T>) => {
	const [
		removeDialogOpen,
		{
			switchValue: setRemoveDialogOpen,
			setTrue: openRemoveDialog,
			setFalse: closeRemoveDialog,
		},
	] = useBooleanState();
	const Component = componentsByType[data.type];
	const setState = React.useCallback(
		(setStateAction: React.SetStateAction<ElementPropsMapping[T]>) => {
			modifyElementById(id, setStateAction);
		},
		[id, modifyElementById],
	) as React.Dispatch<React.SetStateAction<ElementPropsMapping[T]>>;
	const deleteElement = React.useCallback(
		() => deleteElementById(id),
		[id, deleteElementById],
	);
	const props = {
		...data,
		onRemoveDialogOpen: openRemoveDialog,
		setState,
	} as unknown as React.ComponentProps<typeof Component>;
	return (
		<>
			{/* @ts-expect-error This is weird */}
			<Component key={id} {...props} />
			<AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Вы точно хотите удалить {getNameByType(data.type)} {data.title}?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={closeRemoveDialog}>
							Нет
						</AlertDialogCancel>
						<AlertDialogAction onClick={deleteElement}>Да</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export const ControlPanel: React.FC = () => {
	const roughContext = React.useContext(RoughContext);
	const [selectedElementType, setSelectedElementType] =
		// oxlint-disable-next-line typescript/no-non-null-assertion
		React.useState<ElementType>(elementTypes[0]!);
	const {
		elements,
		preset,
		createElement,
		deleteElementById,
		modifyElementById,
		overwrite,
		reset,
	} = useElementControl(
		getInitialStateByType as unknown as <T extends ElementType>(
			type: T,
		) => GetInitialState<ElementPropsMapping[ElementType]>,
	);
	const canvasSize = useStore(canvasSizeStore);

	const renderers: CanvasRenderer[] = React.useMemo(
		() =>
			elements.map(
				(element) => (canvas) =>
					getRenderedByType(element.data.type)(
						canvas,
						element.data as never,
						canvasSize,
					),
			),
		[elements, canvasSize],
	);

	React.useEffect(() => {
		const rendererCancelHandle = renderers.map(roughContext.addRenderer);
		return () => {
			rendererCancelHandle.map((cancelHandle) => cancelHandle());
		};
	}, [renderers, roughContext.addRenderer]);

	return (
		<div className="flex w-full flex-col gap-2 p-4">
			{preset ? (
				<div>
					<PresetProviderPanel
						currentPreset={preset}
						onLoad={overwrite}
						onReset={reset}
					/>
				</div>
			) : null}
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Select
						onValueChange={(type) =>
							setSelectedElementType(type as ElementType)
						}
						value={selectedElementType}
					>
						<SelectTrigger>
							<SelectValue placeholder="Выбери элемент" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{elementTypes.map((elementType) => (
									<SelectItem key={elementType} value={elementType}>
										{getNameByType(elementType)}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						// False positive: createElement is not from react here
						// oxlint-disable-next-line react/no-unstable-nested-components
						onClick={() => createElement(selectedElementType)}
						title="Добавить"
					>
						Добавить
					</Button>
				</div>
				<div className="flex flex-col flex-wrap justify-center gap-2">
					{elements.map((element) => (
						<RenderedElement
							key={element.id}
							id={element.id}
							data={element.data}
							modifyElementById={modifyElementById}
							deleteElementById={deleteElementById}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
