import { Slider } from "@/components/ui/slider";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import type { SubElementComponent } from "@/types/element-types";
import type { Constraint } from "@/utils/math";
import { applyConstraint, random } from "@/utils/math";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

const getConstraint = (): Constraint => ({
	min: 0,
	step: 0.2,
	max: 8,
});

export type RoughnessState = {
	amount: number;
};

export const RoughnessGroup: SubElementComponent<RoughnessState> = ({
	setState,
	amount,
}) => {
	const constraint = getConstraint();
	const setAmount = usePartialSetState(setState, "amount");
	return (
		<RoughElementControlGroup title="Тревожность">
			<Slider
				{...constraint}
				className="w-full"
				value={[amount]}
				onValueChange={([nextValue]) => setAmount(Number(nextValue))}
			/>
		</RoughElementControlGroup>
	);
};

RoughnessGroup.getInitialState = ({ initialState }) => {
	const amount = initialState ? initialState?.amount : 1 + random(2);
	const constraint = getConstraint();
	return {
		amount: applyConstraint(amount, constraint),
	};
};

RoughnessGroup.getRoughConfig = (state) => ({
	roughness: state.amount,
});
