import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { RoughContext } from "@/contexts/rough-context";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import type { SubElementComponent } from "@/types/element-types";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

const getRandomSeed = (): number => Math.floor(Math.random() * 2 ** 31);

export type FixedState = {
	seed: number;
	isSeedFixed: boolean;
	variation: boolean;
};

export const FixedGroup: SubElementComponent<FixedState> = ({
	setState,
	isSeedFixed,
	variation,
}) => {
	const roughContext = React.useContext(RoughContext);

	const setSeed = usePartialSetState(setState, "seed");
	const setSeedFixed = usePartialSetState(setState, "isSeedFixed");
	const setVariation = usePartialSetState(setState, "variation");

	React.useEffect(() => {
		if (!isSeedFixed) {
			setSeed(getRandomSeed());
		}
	}, [isSeedFixed, setSeed, roughContext.forcedCounter]);

	return (
		<RoughElementControlGroup title="Фиксация">
			<div className="flex items-center gap-1">
				<Checkbox
					checked={isSeedFixed}
					onCheckedChange={(nextChecked) =>
						setSeedFixed(nextChecked === "indeterminate" ? false : nextChecked)
					}
				/>
				Рандом
			</div>
			<div className="flex items-center gap-1">
				<Checkbox
					checked={variation}
					onCheckedChange={(nextChecked) =>
						setVariation(nextChecked === "indeterminate" ? false : nextChecked)
					}
				/>
				Вариации
			</div>
		</RoughElementControlGroup>
	);
};

FixedGroup.getInitialState = ({ initialState }) => {
	const seed = initialState?.seed || getRandomSeed();
	const variation = initialState?.variation || false;
	const isSeedFixed =
		typeof initialState?.isSeedFixed === "boolean"
			? initialState.isSeedFixed
			: false;
	return {
		seed,
		variation,
		isSeedFixed,
	};
};

FixedGroup.getRoughConfig = (state) => ({
	seed: state.seed,
});
