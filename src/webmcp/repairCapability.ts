import type { RepairAuthority } from "../core/types";
import type { WorkbenchStore } from "../state/WorkbenchStore";
import type { WebMcpPort, WebMcpTool, WebMcpToolResponse } from "./port";
import {
  APPLY_REPAIR_INPUT_SCHEMA,
  parseApplyRepairInput,
} from "./toolSchemas";

export const APPLY_APPROVED_REPAIR_TOOL_NAME =
  "equaltrace_apply_approved_repair" as const;

type ActiveRegistration = {
  readonly authority: RepairAuthority;
  readonly controller: AbortController;
};

export type RepairCapabilityLifecycle = {
  readonly dispose: () => void;
  readonly whenIdle: () => Promise<void>;
};

function response(value: unknown): WebMcpToolResponse {
  return { content: [{ type: "text", text: JSON.stringify(value) }] };
}

function authorityKey(authority: RepairAuthority): string {
  return [
    authority.repairId,
    authority.repairDigest,
    authority.targetScenarioId,
    authority.targetScenarioVersion,
    authority.seed,
    authority.approvalEpoch,
    authority.nonce,
    authority.expiresAt,
  ].join("|");
}

function abortError(signal: AbortSignal): Error {
  return signal.reason instanceof Error
    ? signal.reason
    : new DOMException("Repair execution was cancelled.", "AbortError");
}

function createApprovedRepairTool(
  store: WorkbenchStore,
  authority: RepairAuthority,
  registrationController: AbortController,
): WebMcpTool {
  let executionState: "available" | "in_flight" | "used" | "invalidated" =
    "available";
  registrationController.signal.addEventListener(
    "abort",
    () => {
      if (executionState === "available") executionState = "invalidated";
    },
    { once: true },
  );

  return {
    name: APPLY_APPROVED_REPAIR_TOOL_NAME,
    title: "Apply the exact approved EqualTrace repair",
    description:
      "Apply once the exact bounded repair already approved by a person for the current fictional scenario. The capability expires and removes itself after any attempt.",
    inputSchema: APPLY_REPAIR_INPUT_SCHEMA,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      if (executionState !== "available") {
        throw new Error(
          "This single-use repair capability is no longer valid.",
        );
      }
      executionState = "in_flight";
      const signal = options?.signal ?? new AbortController().signal;

      try {
        if (signal.aborted) throw abortError(signal);
        const exactRepair = parseApplyRepairInput(input);
        const applied = store.applyApprovedRepairFromCapability(
          authority,
          exactRepair,
          signal,
        );
        executionState = "used";
        registrationController.abort("single-use repair applied");
        return response({
          status: "applied",
          repairId: applied.repairId,
          repairDigest: applied.repairDigest,
          policy: "repaired-agent",
          capability: "removed_after_use",
        });
      } catch (error) {
        executionState = "used";
        registrationController.abort("repair attempt ended authority");
        store.invalidateRepairCapabilityExecution(
          authority,
          signal.aborted ? "cancelled" : "execution_failed",
        );
        throw error;
      }
    },
  };
}

export function startRepairCapabilityLifecycle(
  port: WebMcpPort,
  store: WorkbenchStore,
): RepairCapabilityLifecycle {
  let disposed = false;
  let active: ActiveRegistration | null = null;
  let expiryTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let tail = Promise.resolve();

  const clearExpiryTimer = () => {
    if (expiryTimer !== null) globalThis.clearTimeout(expiryTimer);
    expiryTimer = null;
  };

  const teardown = () => {
    clearExpiryTimer();
    active?.controller.abort("repair authority invalidated");
    active = null;
  };

  const scheduleExpiry = () => {
    clearExpiryTimer();
    const remaining = store.repairExpiryDelay();
    if (remaining === null) return;
    const delay = Math.min(Math.max(0, remaining) + 1, 2_147_483_647);
    expiryTimer = globalThis.setTimeout(() => {
      store.expireRepairIfNeeded();
    }, delay);
  };

  const reconcile = async () => {
    if (disposed) return;
    const authority = store.getSnapshot().approvedRepair;
    if (!authority || store.getSnapshot().phase !== "repair_approved") {
      teardown();
      return;
    }

    const key = authorityKey(authority);
    if (active && authorityKey(active.authority) === key) return;
    teardown();

    const controller = new AbortController();
    active = { authority, controller };
    scheduleExpiry();
    if (!store.reportRepairCapabilityRegistering(authority, port.provenance)) {
      teardown();
      return;
    }

    const tool = createApprovedRepairTool(store, authority, controller);
    try {
      if (!port.available) {
        throw new Error(
          "Native WebMCP is unavailable for repair registration.",
        );
      }
      await port.registerTool(tool, { signal: controller.signal });
    } catch (error) {
      const stillCurrent =
        !disposed &&
        active?.controller === controller &&
        !controller.signal.aborted;
      controller.abort("repair registration failed");
      if (stillCurrent) {
        active = null;
        clearExpiryTimer();
        store.reportRepairCapabilityRegistrationFailure(
          authority,
          error instanceof Error ? error.message : "Registration failed.",
        );
      }
      return;
    }

    const current = store.getSnapshot().approvedRepair;
    if (
      disposed ||
      active?.controller !== controller ||
      controller.signal.aborted ||
      !current ||
      authorityKey(current) !== key
    ) {
      controller.abort("repair authority changed during registration");
      if (active?.controller === controller) active = null;
      return;
    }
    store.reportRepairCapabilityRegistered(authority, port.provenance);
  };

  const enqueue = () => {
    tail = tail.then(reconcile);
  };
  const onStoreChange = () => {
    const current = store.getSnapshot();
    if (
      active &&
      (current.phase !== "repair_approved" ||
        !current.approvedRepair ||
        authorityKey(current.approvedRepair) !== authorityKey(active.authority))
    ) {
      teardown();
    }
    enqueue();
  };
  const unsubscribe = store.subscribe(onStoreChange);
  enqueue();

  return {
    dispose: () => {
      if (disposed) return;
      disposed = true;
      unsubscribe();
      teardown();
    },
    whenIdle: async () => {
      let observed: Promise<void>;
      do {
        observed = tail;
        await observed;
        await Promise.resolve();
      } while (observed !== tail);
    },
  };
}
