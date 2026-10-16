import React from "react";

import {
	AiOutlineDelete as DeleteIcon,
	AiOutlineFile as ResetIcon,
	AiOutlineSync as SyncIcon,
	AiOutlineUpload as UploadIcon,
} from "react-icons/ai";
import { isDeepEqual } from "remeda";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBooleanState } from "@/hooks/use-boolean-state";
import { usePresets } from "@/hooks/use-presets";
import type { ElementType, ElementsPreset } from "@/types/element-types";

type Props<T extends ElementType> = {
	currentPreset: ElementsPreset<T>;
	onLoad: (preset: ElementsPreset<T>) => void;
	onReset: () => void;
};

export const PresetProviderPanel: React.FC<Props<ElementType>> = ({
	onLoad,
	currentPreset,
	onReset,
}) => {
	const { list, putPreset, removePreset } = usePresets();
	React.useEffect(() => {
		if (list && list[0]) {
			onLoad(list[0]);
		}
	}, [onLoad, list]);
	const [selectedId, setSelectedId] = React.useState<string | undefined>();
	const selectedPreset = list?.find((item) => item.id === selectedId);
	const [
		uploadDialogOpen,
		{ switchValue: setUploadDialogOpen, setFalse: closeUploadDialog },
	] = useBooleanState();

	const [
		deleteDialogOpen,
		{ switchValue: setDeleteDialogOpen, setFalse: closeDeleteDialog },
	] = useBooleanState();

	return (
		<div className="flex gap-2">
			<div className="flex">
				<Button size="icon" variant="outline" disabled>
					<SyncIcon rotate={!list ? 180 : 0} />
				</Button>
				{list ? (
					<Select onValueChange={setSelectedId} value={selectedId}>
						<SelectTrigger>
							<SelectValue placeholder="Выбери элемент" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{list.map((preset) => (
									<SelectItem key={preset.id} value={preset.id}>
										{preset.id}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				) : null}
			</div>
			<Button size="icon" variant="outline" onClick={onReset} title="Сбросить">
				<ResetIcon />
			</Button>
			<div className="flex gap-2">
				<AlertDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
					<AlertDialogTrigger asChild>
						<Button
							size="icon"
							variant="outline"
							disabled={
								!selectedPreset || isDeepEqual(currentPreset, selectedPreset)
							}
							title="Сохранить"
						>
							<UploadIcon />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Точно сохранить текущий пресет?
							</AlertDialogTitle>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={closeUploadDialog}>
								Нет
							</AlertDialogCancel>
							<AlertDialogAction onClick={() => putPreset(currentPreset)}>
								Да
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogTrigger asChild>
						<Button
							size="icon"
							variant="destructive"
							disabled={!selectedId}
							title="Удалить"
						>
							<DeleteIcon />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Точно удалить пресет {selectedId}?
							</AlertDialogTitle>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={closeDeleteDialog}>
								Нет
							</AlertDialogCancel>
							{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
							<AlertDialogAction onClick={() => removePreset(selectedId!)}>
								Да
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
};
