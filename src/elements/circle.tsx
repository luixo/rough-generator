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
  GetInitialState,
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

import type { CoordinatesState } from "./groups/coordinates-group";
import { CoordinatesGroup } from "./groups/coordinates-group";
import type { CurveState } from "./groups/curve-group";
import { CurveGroup } from "./groups/curve-group";
import { FillGroup } from "./groups/fill-group";
import type { FillState } from "./groups/fill-group";
import { FixedGroup } from "./groups/fixed-group";
import { NumberWithVariation } from "./groups/number-with-variation";
import { RoughnessGroup } from "./groups/roughness-group";
import type { RoughnessState } from "./groups/roughness-group";
import { StrokeGroup } from "./groups/stroke-group";
import type { StrokeState } from "./groups/stroke-group";

const getInitialTitle = (title?: string) => title || "Круг";

const getRadiusConstraint = (
  canvasSize: CanvasSize,
): VariationConfig<Constraint> => {
  const { width, height } = canvasSize;
  const avgSize = (width + height) / 2;
  return {
    base: {
      min: Math.ceil(avgSize * 0.01),
      step: 10,
      max: Math.floor(avgSize * 0.3),
    },
    variation: {
      min: 0,
      step: 2,
      max: Math.floor(avgSize * 0.1),
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
  const constraint = getRadiusConstraint(size);
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

export type CircleConfig = BaseElementDescription<"circle"> & {
  coordinates: CoordinatesState;
  fill: FillState;
  curve: CurveState;
  stroke: StrokeState;
  roughness: RoughnessState;
  radius: ValueWithVariationConfig<number>;
};

export const Circle: ElementComponent<"circle"> = ({
  setState,
  fixed,
  title,
  onRemoveDialogOpen,
  coordinates,
  radius,
  fill,
  stroke,
  curve,
  roughness,
}) => {
  const canvasSize = useStore(canvasSizeStore);
  const easyMode = useStore(easyModeStore);

  const radiusConstraint = getRadiusConstraint(canvasSize);

  const setFill = usePartialSetState(setState, "fill");
  const setStroke = usePartialSetState(setState, "stroke");
  const setCurve = usePartialSetState(setState, "curve");
  const setCoordinates = usePartialSetState(setState, "coordinates");
  const setRoughness = usePartialSetState(setState, "roughness");
  const setFixed = usePartialSetState(setState, "fixed");
  const setTitle = usePartialSetState(setState, "title");
  const setRadius = usePartialSetState(setState, "radius");

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
            constraint={radiusConstraint}
            {...radius}
            setState={setRadius}
            vertical
          />
        </CoordinatesGroup>
        <Separator className="my-4" />
        <FillGroup {...fill} setState={setFill} />
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

export const getInitialState: GetInitialState<CircleConfig> = ({
  size,
  initialState,
}) => ({
  type: "circle",
  coordinates: CoordinatesGroup.getInitialState({
    size,
    initialState: initialState?.coordinates,
  }),
  fill: FillGroup.getInitialState({
    size,
    initialState: initialState?.fill,
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
  radius: getInitialRadius({
    size,
    initialState: initialState?.radius,
  }),
  fixed: FixedGroup.getInitialState({
    size,
    initialState: initialState?.fixed,
  }),
  curve: CurveGroup.getInitialState({
    size,
    initialState: initialState?.curve,
  }),
});

Circle.renderFigure = (
  canvas: RoughCanvas,
  props: CircleConfig,
  canvasSize: CanvasSize,
) => {
  const [x, y] = applySizeToValues(
    [props.coordinates.x.value, props.coordinates.y.value],
    canvasSize,
  );
  canvas.circle(x, y, props.radius.value * 2, {
    ...CoordinatesGroup.getRoughConfig(props.coordinates),
    ...CurveGroup.getRoughConfig(props.curve),
    ...FillGroup.getRoughConfig(props.fill),
    ...FixedGroup.getRoughConfig(props.fixed),
    ...RoughnessGroup.getRoughConfig(props.roughness),
    ...StrokeGroup.getRoughConfig(props.stroke),
  });
};
