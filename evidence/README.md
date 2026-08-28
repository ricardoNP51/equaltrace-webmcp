# EqualTrace evidence policy

Automated fixtures and injected test ports prove deterministic behavior, schema handling, cancellation, and state integration. They never prove native WebMCP support.

Files under `evidence/native/` may be added only after a real supported client discovers or invokes tools through the page's browser-provided `document.modelContext`. Every native record must name the client, version, origin, tested commit, exact observations, and limits.

Local native smoke evidence is not release evidence. Public-deployment and complete capability-lifecycle proof are captured separately during build item 11.
