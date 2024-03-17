import type React from "react";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Item>
> = ({ className, ...props }) => (
  <AccordionPrimitive.Item
    className={twMerge("border-b", className)}
    {...props}
  />
);

export const AccordionTrigger: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Trigger>
> = ({ className, children, ...props }) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={twMerge(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {props.asChild ? (
        children
      ) : (
        <>
          {children}
          <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 cursor-pointer transition-transform duration-200" />
        </>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

export const AccordionContent: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Content>
> = ({ className, children, ...props }) => (
  <AccordionPrimitive.Content
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={twMerge("pt-0 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
);
