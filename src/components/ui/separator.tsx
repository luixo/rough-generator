import type React from "react";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { twMerge } from "tailwind-merge";

export const Separator: React.FC<
	React.ComponentProps<typeof SeparatorPrimitive.Root>
> = ({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}) => (
	<SeparatorPrimitive.Root
		decorative={decorative}
		orientation={orientation}
		className={twMerge(
			"bg-border shrink-0",
			orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
			className,
		)}
		{...props}
	/>
);
