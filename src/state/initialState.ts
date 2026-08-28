import { ACCOUNT_DELETION_SCENARIO } from "../fixtures/accountDeletion";
import { WorkbenchStore } from "./WorkbenchStore";

export function createWorkbenchStore() {
  return new WorkbenchStore(ACCOUNT_DELETION_SCENARIO);
}

export const workbenchStore = createWorkbenchStore();
