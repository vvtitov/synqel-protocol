"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { getSemanticRegistry } from "./registry.js";
import type { RegistrySnapshot } from "./registry.js";
import type { PolicyContext, RuntimeEvent } from "./types.js";
import { evaluatePolicy } from "./policy.js";

export function useSemanticRuntime() {
  const registry = getSemanticRegistry();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return registry.bus.subscribe(onStoreChange);
    },
    [registry],
  );

  const getSnapshot = useCallback((): RegistrySnapshot => {
    return registry.getSnapshot();
  }, [registry]);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const executeAction = useCallback(
    (actionId: string, context: PolicyContext) => {
      const action = registry.getAction(actionId);
      if (!action) {
        registry.bus.emit({
          type: "action:result",
          actionId,
          ok: false,
          message: `Action "${actionId}" not found in registry.`,
        });
        return;
      }

      registry.bus.emit({ type: "action:attempt", actionId, context });

      const decision = evaluatePolicy(context, action);
      registry.bus.emit({ type: "policy:evaluated", actionId, decision });

      if (!decision.allowed) {
        registry.bus.emit({
          type: "policy:denied",
          actionId,
          reason: decision.reason,
        });
        registry.bus.emit({
          type: "action:result",
          actionId,
          ok: false,
          message: decision.reason,
        });
        return;
      }

      registry.bus.emit({ type: "action:executed", actionId });
      registry.bus.emit({ type: "action:result", actionId, ok: true });
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
