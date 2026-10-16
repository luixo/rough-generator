import React from "react";

import { useFirstMountState } from "@react-hookz/web";
import { useStore } from "@tanstack/react-store";

import { Slider } from "@/components/ui/slider";
import { RoughContext } from "@/contexts/rough-context";
import { VariationFixedContext } from "@/contexts/variation-fixed-context";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { easyModeStore } from "@/state/settings";
import { evaluateConfig } from "@/utils/math";
import type {
	Constraint,
	ValueWithVariationConfig,
	VariationConfig,
} from "@/utils/math";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

type Props = ValueWithVariationConfig<number> & {
	title?: string;
	vertical?: boolean;
	disabled?: boolean;
	constraint: VariationConfig<Constraint>;
	setState: React.Dispatch<
		React.SetStateAction<ValueWithVariationConfig<number>>
	>;
};

export const NumberWithVariation: React.FC<Props> = ({
	setState,
	title,
	vertical,
	disabled,
	constraint,
	variation,
	base,
}) => {
	const roughContext = React.useContext(RoughContext);
	const isVariationFixed = React.useContext(VariationFixedContext);
	const easyMode = useStore(easyModeStore);

	const isFirstMountState = useFirstMountState();
	React.useEffect(() => {
		if (isFirstMountState || isVariationFixed) {
			return;
		}
		setState((state) => ({
			...state,
			value: evaluateConfig(state),
		}));
	}, [
		isFirstMountState,
		setState,
		isVariationFixed,
		// This is expected, we rerender value because of the forced counter
		// oxlint-disable-next-line react/exhaustive-effect-dependencies
		roughContext.forcedCounter,
	]);

	const setValue = usePartialSetState(
		setState,
		"base",
		React.useCallback(
			(state: ValueWithVariationConfig<number>, nextValue: number) => ({
				value: evaluateConfig({ ...state, base: nextValue }),
			}),
			[],
		),
	);
	const setVariation = usePartialSetState(
		setState,
		"variation",
		React.useCallback(
			(state: ValueWithVariationConfig<number>, nextVariation: number) => ({
				value: evaluateConfig({ ...state, variation: nextVariation }),
			}),
			[],
		),
	);

	return (
		<RoughElementControlGroup title={title} vertical={vertical}>
			<Slider
				{...constraint.base}
				value={[base]}
				disabled={disabled}
				onValueChange={([nextValue]) => setValue(nextValue)}
			/>
			{easyMode ? null : (
				<Slider
					{...constraint.variation}
					value={[variation]}
					disabled={disabled}
					onValueChange={([nextValue]) => setVariation(nextValue)}
					// formatter={(v) => `±${v}`}
				/>
			)}
		</RoughElementControlGroup>
	);
};
