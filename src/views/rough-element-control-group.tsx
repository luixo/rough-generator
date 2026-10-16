import type React from "react";

type Props = React.PropsWithChildren<{
	title?: string;
	size?: "s" | "m";
	vertical?: boolean;
}>;

export const RoughElementControlGroup: React.FC<Props> = ({
	title = "",
	size,
	vertical = false,
	children,
}) => (
	<div
		className={`flex min-h-6 w-full items-center gap-2 ${vertical ? "flex-col" : "flex-row"}`}
	>
		{title ? (
			size === "m" ? (
				<h3 className="shrink-0 text-xl">{title}</h3>
			) : (
				<p className="shrink-0">{title}</p>
			)
		) : undefined}
		<div className="flex w-full flex-col flex-wrap items-start gap-2">
			{children}
		</div>
	</div>
);
