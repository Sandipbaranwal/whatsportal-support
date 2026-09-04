import { cn } from "@/lib/utils";

/**
 * The WhatsPortal mark, inlined so it can be tinted by its container.
 *
 * The bubble and dots follow `currentColor`; the sparkle is separate so it can
 * stay brand green on light surfaces and go monochrome on the green launcher.
 */
export function WhatsPortalMark({ className, sparkleClassName = "fill-primary" }) {
  return (
    <svg
      viewBox="0 0 59 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M49.4454 22.8928V38.5476C49.4454 39.6663 49.0234 40.7391 48.272 41.5302C47.5207 42.3212 46.5017 42.7656 45.4392 42.7656L11.0124 43.0441C9.94998 43.0444 8.93115 43.4889 8.18001 44.28L3.76915 48.924C3.57025 49.1334 3.31685 49.276 3.041 49.3337C2.76514 49.3915 2.47921 49.3619 2.21935 49.2485C1.9595 49.1352 1.73739 48.9433 1.58112 48.6971C1.42484 48.4509 1.34141 48.1614 1.34137 47.8653V13.5182C1.34137 12.3995 1.76346 11.3267 2.51477 10.5356C3.26609 9.74461 4.28509 9.30021 5.3476 9.30021C5.3476 9.30021 21.2968 9.18939 35.6805 9.08945"
        stroke="currentColor"
        strokeWidth="2.68274"
        strokeLinecap="round"
      />
      <path
        d="M39.2575 9.39691C39.2609 9.51999 39.5019 9.64471 39.9316 9.80881C40.3783 9.97784 40.985 10.1879 41.4855 10.3881C48.7005 13.1089 48.2134 20.6495 49.346 18.0714C50.701 14.2609 53.0352 11.4728 57.043 10.1288C57.5064 9.92533 58.4721 9.70871 58.5733 9.39363C58.5749 9.2804 58.3811 9.16717 58.0255 9.0244C57.7778 8.92429 57.4525 8.80942 57.08 8.67157C53.106 7.37023 50.578 4.45576 49.3494 0.627221C48.2421 -2.25608 48.9027 5.57822 41.5142 8.38768C40.9715 8.60757 40.2822 8.8406 39.8154 9.02276C39.4564 9.16553 39.2592 9.27876 39.2575 9.39035V9.39691Z"
        className={sparkleClassName}
      />
      <circle cx="16.9907" cy="26.4698" r="4.91836" fill="currentColor" />
      <circle cx="33.9814" cy="26.4698" r="4.91836" fill="currentColor" />
    </svg>
  );
}
