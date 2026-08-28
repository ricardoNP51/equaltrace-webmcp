import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { workbenchStore } from "./state/initialState";
import { NativeWebMcpAdapter } from "./webmcp/nativeAdapter";
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
  window.addEventListener("pagehide", registration.dispose, { once: true });
});
