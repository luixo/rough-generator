import React from "react";

export const useStopPropagation = () =>
  React.useCallback(
    <T extends (e: React.MouseEvent) => void>(fn: T): T =>
      ((e: React.MouseEvent) => {
        e.stopPropagation();
        fn(e);
      }) as T,
    [],
  );
