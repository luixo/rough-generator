import type React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

export const Checkbox: React.FC<
  React.ComponentProps<typeof CheckboxPrimitive.Root>
> = ({ className, ...props }) => (
  <CheckboxPrimitive.Root
    className={twMerge(
      "peer border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={twMerge("flex items-center justify-center text-current")}
    >
      <CheckIcon className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
