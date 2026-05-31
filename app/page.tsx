"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Banner, { type BannerDetail } from "./components/Banner";
import LoadingIndicator from "./components/LoadingIndicator";
import { uploadVerificationImage } from "./lib/apiClient";
import { isValidEmail } from "./lib/validation";

export default function ProfileVerificationPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [email, setEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [isRequestInFlight, setIsRequestInFlight] = useState(false);
  const [banner, setBanner] = useState<BannerDetail | null>(null);

  const isProceedEnabled =
    !isRequestInFlight && isValidEmail(email) && selectedImage !== null;

  const showBanner = (detail: BannerDetail) => {
    setBanner(detail);
  };

  const dismissBanner = () => {
    setBanner(null);
  };

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setBanner(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [banner]);

  const handleViewfinderClick = () => {
    if (isRequestInFlight) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showBanner({
        title: "Invalid Image",
        message: "The selected file must be an image.",
        style: "error",
      });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewUrl(nextPreviewUrl);
    setUploadedImageUri(null);
  };

  const handleProceed = async () => {
    if (!isProceedEnabled || !selectedImage) {
      return;
    }

    setIsRequestInFlight(true);

    try {
      const imageUri = await uploadVerificationImage(selectedImage);

      setUploadedImageUri(imageUri);
      showBanner({
        title: "Verification Image Uploaded",
        message: "Your image would be assessed over the next few days.",
        style: "warning",
      });
    } catch (error) {
      showBanner({
        title: "Verification Upload Failed",
        message:
          error instanceof Error
            ? error.message
            : "Verification upload failed.",
        style: "error",
      });
    } finally {
      setIsRequestInFlight(false);
    }
  };

  const proceedButtonClassName = [
    "cta-button",
    isRequestInFlight || isProceedEnabled
      ? "cta-button--primary"
      : "cta-button--secondary",
    isRequestInFlight ? "cta-button--loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="screen">
      {banner ? (
        <div className="banner-stack">
          <Banner {...banner} onDismiss={dismissBanner} />
        </div>
      ) : null}

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
        </section>

        <div className="upload-zone-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={`upload-zone${isRequestInFlight ? " upload-zone--disabled" : ""}`}
            disabled={isRequestInFlight}
            onClick={handleViewfinderClick}
          >
            {previewUrl ? (
              <img
                className="upload-zone__preview"
                src={previewUrl}
                alt="Selected verification image"
              />
            ) : (
              <>
                <div className="upload-zone__brackets" aria-hidden="true">
                  <span className="corner-bracket corner-bracket--top-left" />
                  <span className="corner-bracket corner-bracket--top-right" />
                  <span className="corner-bracket corner-bracket--bottom-left" />
                  <span className="corner-bracket corner-bracket--bottom-right" />
                </div>
                <div className="upload-zone__center">
                  <span className="camera-icon-circle">
                    <svg
                      width="24"
                      height="24"
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
              </>
            )}
          </button>

          <div className="text-field">
            <label className="text-field__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="text-field__input"
              placeholder="Enter Email to get notified"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isRequestInFlight}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>
      </div>

      <footer className="cta-stack">
        <button
          type="button"
          className={proceedButtonClassName}
          disabled={!isProceedEnabled}
          aria-busy={isRequestInFlight}
          aria-label={isRequestInFlight ? "Proceeding" : "Proceed"}
          onClick={handleProceed}
        >
          {isRequestInFlight ? (
            <LoadingIndicator style="white" size="small" />
          ) : (
            "Proceed"
          )}
        </button>
      </footer>
    </div>
  );
}
