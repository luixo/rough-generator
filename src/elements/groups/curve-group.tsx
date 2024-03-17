import { Slider } from "@/components/ui/slider";
import { usePartialSetState } from "@/hooks/use-partial-set-state";
import type { SubElementComponent } from "@/types/element-types";
import type { Constraint } from "@/utils/math";
import { applyConstraint } from "@/utils/math";
import { RoughElementControlGroup } from "@/views/rough-element-control-group";

const getConstraints = (): Record<
  "stepCount" | "fitting" | "tightness" | "bowing",
  Constraint
> => ({
  stepCount: {
    min: 3,
    max: 25,
    step: 1,
  },
  fitting: {
    min: 0,
    max: 1,
    step: 0.05,
  },
  tightness: {
    min: 0,
    max: 1,
    step: 0.05,
  },
  bowing: {
    min: 0,
    max: 1,
    step: 0.05,
  },
});

export type CurveState = {
  stepCount: number;
  fitting: number;
  tightness: number;
  bowing: number;
};

export const CurveGroup: SubElementComponent<CurveState> = ({
  setState,
  bowing,
  stepCount,
  fitting,
  tightness,
}) => {
  const constraints = getConstraints();

  const setBowing = usePartialSetState(setState, "bowing");
  const setStepCount = usePartialSetState(setState, "stepCount");
  const setFitting = usePartialSetState(setState, "fitting");
  const setTightness = usePartialSetState(setState, "tightness");

  return (
    <RoughElementControlGroup title="Кривые" size="m" vertical>
      <RoughElementControlGroup title="Изгиб">
        <Slider
          {...constraints.bowing}
          value={[bowing]}
          onValueChange={([nextValue]) => setBowing(nextValue)}
        />
      </RoughElementControlGroup>
      <RoughElementControlGroup title="Итерации">
        <Slider
          {...constraints.stepCount}
          value={[stepCount]}
          onValueChange={([nextValue]) => setStepCount(nextValue)}
        />
      </RoughElementControlGroup>
      <RoughElementControlGroup title="Похожесть">
        <Slider
          {...constraints.fitting}
          value={[fitting]}
          onValueChange={([nextValue]) => setFitting(nextValue)}
        />
      </RoughElementControlGroup>
      <RoughElementControlGroup title="Квадратность">
        <Slider
          {...constraints.tightness}
          value={[tightness]}
          onValueChange={([nextValue]) => setTightness(nextValue)}
        />
      </RoughElementControlGroup>
    </RoughElementControlGroup>
  );
};

CurveGroup.getInitialState = ({ initialState }) => {
  const constraints = getConstraints();
  const stepCount = initialState?.stepCount || 9;
  const fitting = initialState?.fitting || 0.95;
  const tightness = initialState?.tightness || 0;
  const bowing = initialState?.bowing || 1;
  return {
    stepCount: applyConstraint(stepCount, constraints.stepCount),
    fitting: applyConstraint(fitting, constraints.fitting),
    tightness: applyConstraint(tightness, constraints.tightness),
    bowing: applyConstraint(bowing, constraints.bowing),
  };
};

CurveGroup.getRoughConfig = (state) => ({
  curveFitting: state.fitting,
  curveStepCount: state.stepCount,
  curveTightness: state.tightness,
  bowing: state.bowing,
});
