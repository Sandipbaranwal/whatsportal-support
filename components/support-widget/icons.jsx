import { cn } from "@/lib/utils";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
      focusable="false"
      {...strokeProps}
    >
      {children}
    </svg>
  );
}

export function CloseIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}

export function ChatIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
    </Icon>
  );
}

export function SendIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4.4 12h6.2M4.9 4.6l14.7 6.5a1 1 0 0 1 0 1.8L4.9 19.4a.6.6 0 0 1-.8-.8l2.2-6.2a1 1 0 0 0 0-.8L4.1 5.4a.6.6 0 0 1 .8-.8Z" />
    </Icon>
  );
}
