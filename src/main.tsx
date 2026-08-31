import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/newsreader/latin-600.css";
import "@fontsource/newsreader/latin-700.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-500.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";

import { App } from "./App";
import { workbenchStore } from "./state/initialState";
import { NativeWebMcpAdapter } from "./webmcp/nativeAdapter";
import { startRepairCapabilityLifecycle } from "./webmcp/repairCapability";
import { registerStableTools } from "./webmcp/stableTools";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("EqualTrace root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <App store={workbenchStore} />
  </StrictMode>,
);

const nativeWebMcp = new NativeWebMcpAdapter(document);
void registerStableTools(nativeWebMcp, workbenchStore).then((registration) => {
  const repairLifecycle = registration.registered
    ? startRepairCapabilityLifecycle(nativeWebMcp, workbenchStore)
    : null;
  window.addEventListener(
    "pagehide",
    () => {
      repairLifecycle?.dispose();
      registration.dispose();
    },
    { once: true },
  );
});
