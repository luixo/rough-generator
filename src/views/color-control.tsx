import type React from "react";

import { SketchPicker } from "react-color";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
	color: string;
	onChange: (nextColor: string) => void;
};

export const ColorControl: React.FC<Props> = ({ color, onChange }) => (
	<Popover>
		<PopoverTrigger>
			<Button style={{ backgroundColor: color }} title="Цвет" />
		</PopoverTrigger>
		<PopoverContent>
			<SketchPicker color={color} onChange={(v) => onChange(v.hex)} />
		</PopoverContent>
	</Popover>
);
