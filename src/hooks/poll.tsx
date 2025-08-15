'use client';
import { useRef, useCallback, useEffect } from "react";

type PollingOptions<T> = {
    interval: number;
    pollFn: () => Promise<T>;
    onData: (data: T) => void;
    enabled?: boolean;
};

export function usePolling<T>({
    interval,
    pollFn,
    onData,
    enabled = true,
}: PollingOptions<T>) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const poll = useCallback(async () => {
        if (!enabled) return;

        try {
            const data = await pollFn();
            onData(data);
        } catch (error) {
            console.error("Polling function failed:", error);
        } finally {
            if (timeoutRef.current !== null) {
                timeoutRef.current = setTimeout(poll, interval);
            }
        }
    }, [pollFn, onData, interval, enabled]);

    useEffect(() => {
        if (enabled) {
            timeoutRef.current = setTimeout(poll, interval);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [poll, interval, enabled]);
}