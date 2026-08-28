import { useSyncExternalStore } from "react";

import type { WorkbenchStore } from "./WorkbenchStore";

export function useWorkbench(store: WorkbenchStore) {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
