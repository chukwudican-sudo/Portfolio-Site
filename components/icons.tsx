type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const base = (strokeWidth: number) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function HomeIcon({ size = 19, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M3.2 10.4 12 3.4l8.8 7" />
      <path d="M5.6 9.5V19a2 2 0 0 0 2 2h8.8a2 2 0 0 0 2-2V9.5" />
      {/* arched door — without it the house reads as an empty roof outline */}
      <path d="M9.7 21v-4.7a2.3 2.3 0 0 1 4.6 0V21" />
    </svg>
  );
}

export function WorkIcon({ size = 19, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <rect x="2.9" y="7.2" width="18.2" height="12.9" rx="2.8" />
      <path d="M8.9 7.2V5.9a2.2 2.2 0 0 1 2.2-2.2h1.8a2.2 2.2 0 0 1 2.2 2.2v1.3" />
      <path d="M2.9 12.7h18.2" />
    </svg>
  );
}

export function ExperienceIcon({ size = 19, className, strokeWidth = 1.8 }: IconProps) {
  return (
    // A timeline rather than three plain rules, echoing the lit rail that runs
    // down the experience section itself.
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M5.6 4.6v14.8" strokeWidth={1.3} />
      <circle cx="5.6" cy="7.7" r="2.15" fill="currentColor" stroke="none" />
      <circle cx="5.6" cy="12" r="2.15" fill="currentColor" stroke="none" />
      <circle cx="5.6" cy="16.3" r="2.15" fill="currentColor" stroke="none" />
      <path d="M10.4 7.7h8.2" />
      <path d="M10.4 12h6.2" />
      <path d="M10.4 16.3h4.4" />
    </svg>
  );
}

export function BlogIcon({ size = 19, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M16.8 3.1a2.7 2.7 0 0 1 3.8 3.8L8.1 19.4a2 2 0 0 1-.9.5l-3.9 1.1a.6.6 0 0 1-.8-.8l1.1-3.9a2 2 0 0 1 .5-.9Z" />
      {/* ferrule band — turns a plain wedge into a readable pencil */}
      <path d="M14.2 5.7 18 9.5" />
    </svg>
  );
}

export function ActivityIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6-1.5 6-6.6a5.2 5.2 0 0 0-1.4-3.6 4.9 4.9 0 0 0-.1-3.7s-1.6-.5-4.5 1.7a12.3 12.3 0 0 0-6 0C6.1.1 4.5.6 4.5.6a4.9 4.9 0 0 0-.1 3.7A5.2 5.2 0 0 0 3 8c0 5 3 6.2 6 6.6a3.4 3.4 0 0 0-1 2.6V21" />
    </svg>
  );
}

export function GithubIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return <ActivityIcon size={size} className={className} strokeWidth={strokeWidth} />;
}

export function CoffeeIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

export function CodeIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function ConnectIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12.3 19" />
    </svg>
  );
}

export function EducationIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </svg>
  );
}

export function HeartIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1Z" />
    </svg>
  );
}

export function ToolIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.6 9.6a2.8 2.8 0 0 1-4-4L15.7 7.3" />
      <path d="M14.7 6.3 17 4" />
    </svg>
  );
}

export function MailIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v0M11 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </svg>
  );
}

export function ChevronIcon({ size = 13, className, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ImagePlaceholderIcon({ size = 22, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base(strokeWidth)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
