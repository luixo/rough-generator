import type React from "react";

type Props = React.PropsWithChildren<{
	title?: string;
	size?: "s" | "m";
	vertical?: boolean;
}>;

export const RoughElementControlGroup: React.FC<Props> = ({
	title,
	size,
	vertical,
	children,
}) => {
	let titleComponent = null;
	if (title) {
		if (size === "m") {
			titleComponent = <h3 className="shrink-0 text-xl">{title}</h3>;
		} else {
			titleComponent = <p className="shrink-0">{title}</p>;
		}
	}
	return (
		<div
			className={`flex min-h-6 w-full items-center gap-2 ${vertical ? "flex-col" : "flex-row"}`}
		>
			{titleComponent}
			<div className="flex w-full flex-col flex-wrap items-start gap-2">
				{children}
			</div>
		</div>
	);
};
