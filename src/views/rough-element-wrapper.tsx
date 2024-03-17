import React from "react";

import {
  AiOutlineDelete as DeleteIcon,
  AiOutlineEdit as EditIcon,
} from "react-icons/ai";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBooleanState } from "@/hooks/use-boolean-state";
import { useStopPropagation } from "@/utils/fn";

type Props = React.PropsWithChildren<{
  title: string;
  onChange: (nextTitle: string) => void;
  onRemoveDialogOpen: () => void;
}>;

export const RoughElementWrapper: React.FC<Props> = ({
  title,
  onChange,
  onRemoveDialogOpen,
  children,
}) => {
  const stopPropagation = useStopPropagation();
  const [isEditing, { setTrue: startEditing, setFalse: stopEditing }] =
    useBooleanState();
  const [editingTitle, setEditingTitle] = React.useState(title);
  const saveTitle = React.useCallback(() => {
    onChange(editingTitle);
    stopEditing();
  }, [onChange, editingTitle, stopEditing]);
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex w-full items-center justify-between pr-4">
            {isEditing ? (
              <Input
                placeholder="Email"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.currentTarget.value)}
              />
            ) : (
              <span>{title}</span>
            )}
            <div className="ml-4 flex items-center gap-2">
              {isEditing ? (
                <Button
                  type="submit"
                  onClick={stopPropagation(saveTitle)}
                  title="Сохранить"
                >
                  Сохранить
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopPropagation(startEditing)}
                  title="Редактировать"
                >
                  <EditIcon />
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon"
                onClick={stopPropagation(onRemoveDialogOpen)}
                title="Удалить"
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
