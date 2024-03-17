import type React from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

export const Slider: React.FC<
  Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "onValueChange"> & {
    onValueChange?: (numbers: [number, ...number[]]) => void;
  }
> = ({ className, ...props }) => (
  <SliderPrimitive.Root
    className={twMerge(
      "relative flex min-h-4 w-full touch-none items-center select-none",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-primary/20 relative h-1.5 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="bg-primary absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block size-4 cursor-pointer rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
);
