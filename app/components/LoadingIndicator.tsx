type LoadingIndicatorProps = {
  style?: "white" | "accent";
  size?: "small" | "medium";
};

const sizeMap = {
  small: { dimension: 20, strokeWidth: 3.5 },
  medium: { dimension: 32, strokeWidth: 5.5 },
} as const;

export default function LoadingIndicator({
  style = "white",
  size = "small",
}: LoadingIndicatorProps) {
  const { dimension, strokeWidth } = sizeMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const trim = circumference * 0.4;

  const gradientId = `loading-gradient-${style}-${size}`;

  return (
    <svg
      className="loading-indicator"
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {style === "white" ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="rgba(142, 142, 147, 0.2)" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="rgba(255, 155, 136, 0.2)" />
            </>
          )}
        </linearGradient>
      </defs>
      <circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${trim} ${circumference - trim}`}
      />
    </svg>
  );
}
