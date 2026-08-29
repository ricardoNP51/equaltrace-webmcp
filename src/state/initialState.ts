import { BrowserDigestService, SystemClock } from "../core/digest";
import { ACCOUNT_DELETION_SCENARIO } from "../fixtures/accountDeletion";
import { WorkbenchStore, type WorkbenchDependencies } from "./WorkbenchStore";

export function createWorkbenchStore(
  dependencies: WorkbenchDependencies = {
    clock: new SystemClock(),
    digestService: new BrowserDigestService(),
  },
) {
  return new WorkbenchStore(ACCOUNT_DELETION_SCENARIO, dependencies);
}

export const workbenchStore = createWorkbenchStore();
