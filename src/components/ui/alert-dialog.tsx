import type React from "react";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { twMerge } from "tailwind-merge";

import { getButtonClassname } from "@/components/ui/button";

export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Overlay>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Overlay
    className={twMerge(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
  />
);

export const AlertDialogContent: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Content>
> = ({ className, ...props }) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      className={twMerge(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
);

export const AlertDialogHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={twMerge(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);

export const AlertDialogFooter: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    className={twMerge(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);

export const AlertDialogTitle: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Title>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Title
    className={twMerge("text-lg font-semibold", className)}
    {...props}
  />
);

export const AlertDialogDescription: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Description>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Description
    className={twMerge("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export const AlertDialogAction: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Action>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Action
    className={twMerge(getButtonClassname(), className)}
    {...props}
  />
);

export const AlertDialogCancel: React.FC<
  React.ComponentProps<typeof AlertDialogPrimitive.Cancel>
> = ({ className, ...props }) => (
  <AlertDialogPrimitive.Cancel
    className={twMerge(
      getButtonClassname({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
);
