import { useStore } from "@tanstack/react-store";
import { entries } from "remeda";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import { canvasSizeStore, easyModeStore } from "@/state/settings";
import type { CanvasSize } from "@/types/canvas";
import type { SubElementComponent } from "@/types/element-types";
import { getRandomColor } from "@/utils/colors";
import type {
  Constraint,
  ValueWithVariationConfig,
  VariationConfig,
} from "@/utils/math";
import {
  applyConstraint,
  applyVariatedConstraint,
  getValueWithVarConfig,
} from "@/utils/math";
import { ColorControl } from "@/views/color-control";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

import { NumberWithVariation } from "./number-with-variation";

const getConstraints = (
  canvasSize: CanvasSize,
): Record<"angle" | "gap" | "weight", VariationConfig<Constraint>> &
  Record<"dashOffset" | "dashGap", Constraint> => {
  const { width, height } = canvasSize;
  const avgSize = (width + height) / 2;
  return {
    angle: {
      base: {
        min: 0,
        step: 3,
        max: 360,
      },
      variation: {
        min: 0,
        step: 0.1,
        max: 360,
      },
    },
    gap: {
      base: {
        min: 0,
        step: 1,
        max: 50,
      },
      variation: {
        min: 0,
        step: 0.5,
        max: 10,
      },
    },
    weight: {
      base: {
        min: 0.1,
        step: 1,
        max: 10,
      },
      variation: {
        min: 0,
        step: 0.1,
        max: 1,
      },
    },
    dashOffset: {
      min: 0,
      step: 1,
      max: avgSize * 0.01,
    },
    dashGap: {
      min: 0,
      step: 1,
      max: avgSize * 0.01,
    },
  };
};

export type HachureStyle =
  | "hachure"
  | "solid"
  | "zigzag"
  | "cross-hatch"
  | "dots"
  | "dashed"
  | "zigzag-line";

const HACHURES: Record<HachureStyle, string> = {
  hachure: "штрих",
  solid: "заливка",
  zigzag: "зиг-заг",
  "cross-hatch": "крест-накрест",
  dots: "точки",
  dashed: "пунктир",
  "zigzag-line": "прямой зиг-заг",
};

export type FillState = {
  color: string;
  style: HachureStyle;
  gap: ValueWithVariationConfig<number>;
  angle: ValueWithVariationConfig<number>;
  weight: ValueWithVariationConfig<number>;
  dashOffset: number;
  dashGap: number;
  multiline: boolean;
};

export const FillGroup: SubElementComponent<FillState> = ({
  setState,
  multiline,
  color,
  style,
  weight,
  angle,
  gap,
  dashGap,
  dashOffset,
}) => {
  const canvasSize = useStore(canvasSizeStore);
  const easyMode = useStore(easyModeStore);
  const constraints = getConstraints(canvasSize);

  const setMultiline = usePartialSetState(setState, "multiline");
  const setColor = usePartialSetState(setState, "color");
  const setStyle = usePartialSetState(setState, "style");
  const setWeight = usePartialSetState(setState, "weight");
  const setAngle = usePartialSetState(setState, "angle");
  const setGap = usePartialSetState(setState, "gap");
  const setDashGap = usePartialSetState(setState, "dashGap");
  const setDashOffset = usePartialSetState(setState, "dashOffset");

  return (
    <RoughElementControlGroup title="Штриховка" size="m" vertical>
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
      <div>
        <RoughElementControlGroup
          title={easyMode ? undefined : "Основное"}
          vertical={!easyMode}
        >
          <ColorControl color={color} onChange={setColor} />
          <Select
            onValueChange={(nextStyle) => setStyle(nextStyle as HachureStyle)}
            value={style}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выбери элемент" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {entries(HACHURES).map(([key, name]) => (
                  <SelectItem key={key} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </RoughElementControlGroup>
        {easyMode ? null : (
          <>
            <NumberWithVariation
              {...weight}
              title={style === "dots" ? "Диаметр" : "Толщина"}
              constraint={constraints.weight}
              setState={setWeight}
              vertical
            />
            <NumberWithVariation
              title="Наклон"
              constraint={constraints.angle}
              {...angle}
              setState={setAngle}
              vertical
            />
            <NumberWithVariation
              title="Просвет"
              constraint={constraints.gap}
              {...gap}
              setState={setGap}
              vertical
            />
            {style === "dashed" ? (
              <RoughElementControlGroup title="Опции пунктира" vertical>
                <Slider
                  {...constraints.dashOffset}
                  value={[dashOffset]}
                  onValueChange={([nextValue]) => setDashOffset(nextValue)}
                />
                <Slider
                  {...constraints.dashGap}
                  value={[dashGap]}
                  onValueChange={([nextValue]) => setDashGap(nextValue)}
                />
              </RoughElementControlGroup>
            ) : null}
          </>
        )}
      </div>
    </RoughElementControlGroup>
  );
};

FillGroup.getInitialState = ({ size, initialState }) => {
  const { width, height } = size;
  const avgSize = (width + height) / 2;
  const color = initialState ? initialState.color : getRandomColor();
  const style = initialState ? initialState.style : "hachure";
  const angle = initialState
    ? initialState.angle
    : getValueWithVarConfig({
        base: 0,
        variation: 0,
      });
  const gap = initialState
    ? initialState.gap
    : getValueWithVarConfig({
        base: 30,
        variation: 0,
      });
  const dashOffset = initialState ? initialState.dashOffset : avgSize * 0.01;
  const dashGap = initialState ? initialState.dashGap : avgSize * 0.01;
  const multiline = initialState?.multiline || true;
  const weight = initialState
    ? initialState.weight
    : getValueWithVarConfig({
        base: 2,
        variation: 0,
      });
  const constraints = getConstraints(size);
  return {
    color,
    style,
    angle: applyVariatedConstraint(angle, constraints.angle),
    gap: applyVariatedConstraint(gap, constraints.gap),
    dashOffset: applyConstraint(dashOffset, constraints.dashOffset),
    dashGap: applyConstraint(dashGap, constraints.dashGap),
    multiline,
    weight,
  };
};

FillGroup.getRoughConfig = (state) => ({
  fill: state.color,
  fillStyle: state.style,
  fillWeight: state.weight?.value,
  dashOffset: state.dashOffset,
  dashGap: state.dashGap,
  disableMultiStroke: !state.multiline,
  hachureGap: state.gap.value,
  hachureAngle: state.angle.value,
});
