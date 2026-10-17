import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./system-intro.css";

export default function SystemIntro({ onComplete }) {
  const introRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = introRef.current;
    if (!root) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const complete = () => onComplete?.();
    const watchdog = window.setTimeout(complete, 4000);
    const progressValue = { value: 0 };
    const context = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            gsap.to(root, {
              autoAlpha: 0,
              duration: 0.25,
              onComplete: complete,
            });
          },
        })
        .to(progressValue, {
          value: 100,
          duration: 1.8,
          ease: "power1.inOut",
          onUpdate: () => setProgress(Math.round(progressValue.value)),
        });
    }, root);

    return () => {
      window.clearTimeout(watchdog);
      context.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div
      className="system-intro-overlay"
      ref={introRef}
      role="status"
      aria-label={`Loading portfolio, ${progress}%`}
    >
      <div className="system-intro-loader">
        <span className="system-intro-label">Loading</span>
        <span className="system-intro-percentage">{progress}%</span>
        <div
          className="system-intro-track"
          role="progressbar"
          aria-label="Loading portfolio"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
