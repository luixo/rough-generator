import React from "react";

import { updateSetStateAction } from "@/utils/react";

export const usePartialSetState = <T, K extends keyof T>(
	setState: React.Dispatch<React.SetStateAction<T>>,
	key: K,
	getAdditional?: (prevState: T, prop: T[K]) => Partial<T>,
): React.Dispatch<React.SetStateAction<T[K]>> =>
	React.useCallback(
		(propAction: React.SetStateAction<T[K]>) =>
			setState((state) => {
				const prop = updateSetStateAction(propAction, state[key]);
				const additional = getAdditional?.(state, prop) || {};
				return { ...state, [key]: prop, ...additional };
			}),
		[setState, key, getAdditional],
	);
