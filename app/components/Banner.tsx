export type BannerStyle = "error" | "warning";

export type BannerDetail = {
  title: string;
  message: string;
  style: BannerStyle;
};

type BannerProps = BannerDetail & {
  onDismiss: () => void;
};

function BannerIcon({ style }: { style: BannerStyle }) {
  if (style === "warning") {
    return (
      <span className="banner__icon banner__icon--warning" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1.5 1 12.5h12L7 1.5zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 7 5zm0 6.25a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="banner__icon banner__icon--error" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M6.25 3.5h1.5v4.5h-1.5V3.5zm.75 6.75a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75z" />
      </svg>
    </span>
  );
}

export default function Banner({
  title,
  message,
  style,
  onDismiss,
}: BannerProps) {
  return (
    <div
      className="banner"
      role="alert"
      aria-live="assertive"
      aria-label={`${title}. ${message}`}
    >
      <BannerIcon style={style} />
      <div className="banner__content">
        <p className="banner__title">{title}</p>
        <p className="banner__message">{message}</p>
      </div>
      <button
        type="button"
        className="banner__dismiss"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}
