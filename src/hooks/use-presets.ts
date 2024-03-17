import { useLocalStorageValue } from "@react-hookz/web";
import { v4 } from "uuid";

import type { ElementType, ElementsPreset } from "@/types/element-types";

const PRESETS_KEY = "presets";

export const usePresets = () => {
  const { value, set } =
    useLocalStorageValue<({ id: string } & ElementsPreset<ElementType>)[]>(
      PRESETS_KEY,
    );
  return {
    list: value,
    putPreset: (preset: ElementsPreset<ElementType>) => {
      set((values) => [...(values || []), { id: v4(), ...preset }]);
    },
    removePreset: (presetId: string) => {
      set((values) => (values || []).filter((value) => value.id !== presetId));
    },
  };
};
