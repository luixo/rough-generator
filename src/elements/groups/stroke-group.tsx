import { useStore } from "@tanstack/react-store";

import { Checkbox } from "@/components/ui/checkbox";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { easyModeStore } from "@/state/settings";
import type { SubElementComponent } from "@/types/element-types";
import { getRandomColor } from "@/utils/colors";
import type {
  Constraint,
  ValueWithVariationConfig,
  VariationConfig,
} from "@/utils/math";
import { applyVariatedConstraint, getValueWithVarConfig } from "@/utils/math";
import { ColorControl } from "@/views/color-control";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

import { NumberWithVariation } from "./number-with-variation";

const getConstraint = (): VariationConfig<Constraint> => ({
  base: {
    min: 0.5,
    step: 1,
    max: 5,
  },
  variation: {
    min: 0.1,
    step: 0.2,
    max: 2,
  },
});

export type StrokeState = {
  color: string;
  width: ValueWithVariationConfig<number>;
  multiline: boolean;
};

export const StrokeGroup: SubElementComponent<StrokeState> = ({
  setState,
  multiline,
  color,
  width,
}) => {
  const easyMode = useStore(easyModeStore);
  const constraint = getConstraint();

  const setMultiline = usePartialSetState(setState, "multiline");
  const setColor = usePartialSetState(setState, "color");
  const setWidth = usePartialSetState(setState, "width");

  return (
    <RoughElementControlGroup title="Обод" size="m" vertical>
      {easyMode ? null : (
        <div className="flex items-center gap-1">
          <Checkbox
            checked={multiline}
            onCheckedChange={(nextChecked) =>
              setMultiline(
                nextChecked === "indeterminate" ? false : nextChecked,
              )
            }
          />
          Многослойность
        </div>
      )}
      <div className="w-full">
        <RoughElementControlGroup title={easyMode ? undefined : "Основное"}>
          <ColorControl color={color} onChange={setColor} />
        </RoughElementControlGroup>
        <NumberWithVariation
          title={easyMode ? undefined : "Ширина"}
          constraint={constraint}
          {...width}
          setState={setWidth}
        />
      </div>
    </RoughElementControlGroup>
  );
};

StrokeGroup.getInitialState = ({ initialState }) => {
  const color = initialState ? initialState.color : getRandomColor();
  const width = initialState
    ? initialState.width
    : getValueWithVarConfig({
        base: 2,
        variation: 0.5,
      });
  const multiline = initialState?.multiline || true;
  const constraint = getConstraint();
  return {
    color,
    width: applyVariatedConstraint(width, constraint),
    multiline,
  };
};

StrokeGroup.getRoughConfig = (state) => ({
  stroke: state.color,
  strokeWidth: state.width.value,
  disableMultiStrokeFill: !state.multiline,
});
