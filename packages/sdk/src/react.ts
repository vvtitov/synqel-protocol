"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { getSemanticRegistry } from "./registry.js";
import type { RegistrySnapshot } from "./registry.js";
import type {
  PolicyContext,
  RuntimeEvent,
  ExecuteActionOptions,
  ExecuteActionResult,
} from "./types.js";

export function useSemanticRuntime() {
  const registry = getSemanticRegistry();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return registry.bus.subscribe(onStoreChange);
    },
    [registry],
  );

  const getSnapshotData = useCallback((): RegistrySnapshot => {
    return registry.getSnapshot();
  }, [registry]);

  const snapshot = useSyncExternalStore(subscribe, getSnapshotData, getSnapshotData);

  const executeAction = useCallback(
    (
      actionId: string,
      context: PolicyContext,
      input?: unknown,
      options?: ExecuteActionOptions,
    ): Promise<ExecuteActionResult> => {
      return registry.executeAction(actionId, context, input, options);
    },
    [registry],
  );

  return useMemo(
    () => ({ registry, snapshot, executeAction }),
    [registry, snapshot, executeAction],
  );
}

export function useSemanticEvents(
  onEvent: (event: RuntimeEvent) => void,
): void {
  const registry = getSemanticRegistry();

  useEffect(() => {
    return registry.bus.subscribe(onEvent);
  }, [registry, onEvent]);
}
