export default function ProfileVerificationPage() {
  return (
    <div className="screen">
      <div className="screen__content">
        <header className="top-bar">
          <h2 className="top-bar__title">Pentagon Demo</h2>
        </header>

        <section className="page-header">
          <h1 className="page-header__title">Tribes Profile Verification</h1>
          <p className="page-header__subtitle">
            To help keep our riding community safe, please complete Profile
            verification by posing with your bike.
          </p>
        </section>

        <section className="rules">
          <p>1. No Helmets</p>
          <p>2. Face and Bike must be visible.</p>
          <p>
            Note that you might only be matched with un-verified riders if you
            proceed without verification.
          </p>
        </section>

        <div className="upload-zone-wrapper">
          <button type="button" className="upload-zone">
            <div className="upload-zone__brackets" aria-hidden="true">
              <span className="corner-bracket corner-bracket--top-left" />
              <span className="corner-bracket corner-bracket--top-right" />
              <span className="corner-bracket corner-bracket--bottom-left" />
              <span className="corner-bracket corner-bracket--bottom-right" />
            </div>
            <div className="upload-zone__center">
              <span className="camera-icon-circle">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                </svg>
              </span>
              <p className="upload-zone__label">Tap to Upload Image</p>
            </div>
          </button>
        </div>
      </div>

      <footer className="cta-stack">
        <button type="button" className="cta-button cta-button--primary">
          Proceed
        </button>
      </footer>
    </div>
  );
}
