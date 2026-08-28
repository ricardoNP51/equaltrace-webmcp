type StatusIconProps = {
  readonly name: "alert" | "check" | "pending" | "route" | "shield";
};

export function StatusIcon({ name }: StatusIconProps) {
  if (name === "check") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }
  if (name === "alert") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v4.5M12 17h.01" />
      </svg>
    );
  }
  if (name === "pending") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3 5 6v5c0 4.7 2.9 8 7 10 4.1-2 7-5.3 7-10V6l-7-3Z" />
        <path d="M9.5 12 11 13.5l3.5-4" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="m7 12 10-6M7 12l10 6" />
    </svg>
  );
}
