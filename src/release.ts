export const EQUALTRACE_RELEASE_NAME = "challenge-v1.0.0";

const injectedCommit = import.meta.env.VITE_RELEASE_COMMIT?.trim();

export const EQUALTRACE_RELEASE_COMMIT =
  injectedCommit && /^[a-f0-9]{40}$/.test(injectedCommit)
    ? injectedCommit
    : "development";
