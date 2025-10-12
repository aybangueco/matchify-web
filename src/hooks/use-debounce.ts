import { useCallback, useRef } from "react";

export default function useDebounce() {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		<T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => fn(), delay);
		},
		[],
	);
}
