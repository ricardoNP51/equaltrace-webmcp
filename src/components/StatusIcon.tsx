import {
  Check,
  Clock,
  Eye,
  Headphones,
  Robot,
  ShieldCheck,
  ShareNetwork,
  Warning,
} from "@phosphor-icons/react";

type StatusIconProps = {
  readonly name:
    | "agent"
    | "alert"
    | "assistive"
    | "check"
    | "pending"
    | "route"
    | "shield"
    | "visual";
};

export function StatusIcon({ name }: StatusIconProps) {
  const props = { "aria-hidden": true, size: 22, weight: "bold" } as const;
  if (name === "check") return <Check {...props} />;
  if (name === "alert") return <Warning {...props} />;
  if (name === "pending") return <Clock {...props} />;
  if (name === "shield") return <ShieldCheck {...props} />;
  if (name === "visual") return <Eye {...props} />;
  if (name === "assistive") return <Headphones {...props} />;
  if (name === "agent") return <Robot {...props} />;
  return <ShareNetwork {...props} />;
}
