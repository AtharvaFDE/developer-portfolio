import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./style.css";
import "./hero-background.css";
import "./technology-globe-loader.css";
import SelectedWorkSection from "./components/selected-work/SelectedWorkSection.jsx";
import SystemIntro from "./components/system-intro/SystemIntro.jsx";

const contactLinks = {
  github: "https://github.com/Atha-rva",
  email: "https://mail.google.com/mail/?view=cm&fs=1&to=deshmukhatharva024%40gmail.com",
  linkedin: "https://www.linkedin.com/in/atharva-deshmukh-9b61b325b/",
};

const portraitImages = [
  { src: "/images/atharva0.png", alt: "Atharva standing with a relaxed smile" },
  { src: "/images/atharva1.png", alt: "Atharva pointing toward the portfolio" },
  { src: "/images/atharva2.png", alt: "Atharva seated and smiling" },
  { src: "/images/atharva3.png", alt: "Atharva standing with a backpack and tablet" },
];

function shouldShowSystemIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  try {
    if (window.sessionStorage.getItem("portfolio-system-intro-seen")) {
      return false;
    }
    window.sessionStorage.setItem("portfolio-system-intro-seen", "true");
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("Intro session preference could not be saved.", error);
      return false;
    }
    throw error;
  }
}

const TechnologyGlobeSection = React.lazy(() =>
  import("./components/technology-globe/TechnologyGlobeSection.jsx"),
);

class TechnologyGlobeErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Failed to render the technology globe section.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="technology-load-error" role="alert">
          The technology globe could not be loaded. Please refresh the page to try
          again.
        </div>
      );
    }

    return this.props.children;
  }
}

function DeferredTechnologyGlobe() {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoad) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div className="toolkit-deferred" id="skills" ref={sectionRef}>
      {shouldLoad && (
        <TechnologyGlobeErrorBoundary>
          <React.Suspense
            fallback={
              <div className="technology-load-fallback" role="status">
                Loading interactive technology globe…
              </div>
            }
          >
            <TechnologyGlobeSection />
          </React.Suspense>
        </TechnologyGlobeErrorBoundary>
      )}
    </div>
  );
}

const navigation = ["Home", "About", "Skills", "Projects", "Contact"];

const technologies = [
  { name: "React", url: "https://react.dev/", className: "react-logo" },
  { name: "TypeScript", url: "https://www.typescriptlang.org/", className: "typescript-logo" },
  { name: "JavaScript", url: "https://developer.mozilla.org/docs/Web/JavaScript", className: "javascript-logo" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/", className: "tailwind-logo" },
  { name: "Node.js", url: "https://nodejs.org/", className: "node-logo" },
  { name: "Git", url: "https://git-scm.com/", className: "git-logo" },
];

function TechBadges() {
  return (
    <div className="tech" aria-label="Technologies I work with">
      {technologies.map((technology) => (
        <a
          className={`tech-badge ${technology.className}`}
          href={technology.url}
          key={technology.name}
          target="_blank"
          rel="noreferrer"
          aria-label={`Learn about ${technology.name}`}
          title={technology.name}
        >
          {technology.name === "React" && (
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="2.5" />
              <ellipse cx="20" cy="20" rx="17" ry="6.5" />
              <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(60 20 20)" />
              <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(120 20 20)" />
            </svg>
          )}
          {technology.name === "TypeScript" && <span>TS</span>}
          {technology.name === "JavaScript" && <span>JS</span>}
          {technology.name === "Tailwind CSS" && (
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <path d="M8 17c2.7-5.3 6.7-8 12-8 8 0 9 6 13 7-2.7 5.3-6.7 8-12 8-8 0-9-6-13-7Zm-3 11c2.7-5.3 6.7-8 12-8 8 0 9 6 13 7-2.7 5.3-6.7 8-12 8-8 0-9-6-13-7Z" />
            </svg>
          )}
          {technology.name === "Node.js" && <span>JS</span>}
          {technology.name === "Git" && (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v6m0 0 5 4m-5-4-5 4m5 0v7" />
              <circle cx="12" cy="3" r="2" />
              <circle cx="12" cy="21" r="2" />
              <circle cx="7" cy="13" r="2" />
              <circle cx="17" cy="13" r="2" />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}

function CinematicPortrait({ portraits }) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const transitionRef = useRef(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const hero = imageRef.current?.closest(".hero");
    const portrait = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!hero || !portrait || !canvas || !context) {
      if (canvas) canvas.hidden = true;
      if (!context) {
        console.error("Canvas rendering is unavailable for the portrait effect.");
      }
      setMotionAllowed(false);
      return undefined;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let canvasAvailable = true;
    const imageCache = [portrait];
    const loadImage = (index) => {
      if (imageCache[index]) {
        const image = imageCache[index];
        if (image.complete && image.naturalWidth > 0) {
          return Promise.resolve(image);
        }
        return new Promise((resolve, reject) => {
          image.addEventListener("load", () => resolve(image), { once: true });
          image.addEventListener(
            "error",
            () =>
              reject(
                new Error(
                  `Portrait image could not be loaded: ${portraits[index].src}`,
                ),
              ),
            { once: true },
          );
        });
      }

      const image = new Image();
      image.decoding = "async";
      imageCache[index] = image;
      return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = () =>
          reject(
            new Error(
              `Portrait image could not be loaded: ${portraits[index].src}`,
            ),
          );
        image.src = portraits[index].src;
      });
    };

    let animationFrame = 0;
    let switchTimer = 0;
    let currentIndex = 0;
    let targetIndex = 1;
    let transitionStartedAt = 0;
    let outgoingFragments = [];
    let outgoingFragmentMap = new Map();
    let incomingFragmentMap = new Map();
    let fragmentColumns = 0;
    let fragmentRows = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let pixelRatio = 1;
    let transitioning = false;
    let preparingTransition = false;
    let pendingManualSwitch = false;
    let initialized = false;
    let disposed = false;
    const transitionDuration = 2800;

    const getPortraitRect = (image) => {
      const heroRect = hero.getBoundingClientRect();
      const imageRect = portrait.getBoundingClientRect();
      if (!image?.naturalWidth || !image?.naturalHeight) return null;

      const scale = Math.min(
        imageRect.width / image.naturalWidth,
        imageRect.height / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      return {
        x: imageRect.left - heroRect.left + (imageRect.width - width) / 2,
        y: imageRect.top - heroRect.top + imageRect.height - height,
        width,
        height,
      };
    };

    const makeFragments = (image, rect, grid) => {
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const cellSize = isMobile ? 17 : 12;
      const columns = grid?.columns ?? Math.max(1, Math.ceil(rect.width / cellSize));
      const rows = grid?.rows ?? Math.max(1, Math.ceil(rect.height / cellSize));
      const sampler = document.createElement("canvas");
      sampler.width = columns;
      sampler.height = rows;
      const samplerContext = sampler.getContext("2d", {
        willReadFrequently: true,
      });
      if (!samplerContext) {
        console.error("Canvas sampling is unavailable for the portrait effect.");
        return { items: [], columns, rows };
      }
      samplerContext.drawImage(image, 0, 0, columns, rows);
      const alpha = samplerContext.getImageData(0, 0, columns, rows).data;
      const output = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = (row * columns + column) * 4;
          if (alpha[index + 3] < 12) continue;
          const seed = (row * 73856093) ^ (column * 19349663);
          const random = (offset) => {
            const value = Math.sin(seed + offset * 78.233) * 43758.5453;
            return value - Math.floor(value);
          };
          output.push({
            column,
            row,
            x: rect.x + (column / columns) * rect.width,
            y: rect.y + (row / rows) * rect.height,
            width: rect.width / columns + 0.5,
            height: rect.height / rows + 0.5,
            sourceX: (column / columns) * image.naturalWidth,
            sourceY: (row / rows) * image.naturalHeight,
            sourceWidth: image.naturalWidth / columns + 1,
            sourceHeight: image.naturalHeight / rows + 1,
            centerX: (column + 0.5) / columns,
            scatterX: 18 + random(1) * 58,
            scatterY: (random(2) - 0.5) * 82,
            rotation: (random(3) - 0.5) * 0.36,
            depth: 0.5 + random(4) * 0.8,
            glow: random(5) > 0.84,
            alpha: alpha[index + 3] / 255,
          });
        }
      }
      return { items: output, columns, rows };
    };

    const drawImageFragment = (
      image,
      fragment,
      x,
      y,
      width,
      height,
      alpha,
      rotation,
      glow,
    ) => {
      if (alpha <= 0.01 || width <= 0 || height <= 0) return;
      context.save();
      context.globalAlpha = Math.min(1, alpha * fragment.alpha);
      context.translate(x + width / 2, y + height / 2);
      context.rotate(rotation);
      context.scale(width / fragment.width, height / fragment.height);
      if (glow) {
        context.shadowColor = "rgba(45, 193, 255, 0.78)";
        context.shadowBlur = 11;
      }
      context.drawImage(
        image,
        fragment.sourceX,
        fragment.sourceY,
        fragment.sourceWidth,
        fragment.sourceHeight,
        -fragment.width / 2,
        -fragment.height / 2,
        fragment.width,
        fragment.height,
      );
      context.shadowBlur = 0;
      context.globalCompositeOperation = "screen";
      context.fillStyle = `rgba(76, 204, 255, ${glow ? 0.3 : 0.13})`;
      context.fillRect(
        -fragment.width / 2,
        -fragment.height / 2,
        fragment.width,
        fragment.height,
      );
      context.restore();
    };

    const drawFocusRing = () => {
      if (!portrait.matches(":focus-visible")) return;
      const rect = getPortraitRect(imageCache[currentIndex]);
      if (!rect) return;
      context.save();
      context.strokeStyle = "rgba(145, 186, 255, 0.9)";
      context.lineWidth = 2;
      context.setLineDash([5, 4]);
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.restore();
    };

    const drawStaticPortrait = (image = imageCache[currentIndex]) => {
      if (!viewportWidth || !viewportHeight) return;
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      const rect = getPortraitRect(image);
      if (image?.naturalWidth && rect) {
        context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
      }
      drawFocusRing();
    };

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      viewportWidth = rect.width;
      viewportHeight = rect.height;
      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth <= 760 ? 1 : 1.5,
      );
      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const image = imageCache[currentIndex];
      const portraitRect = image?.naturalWidth ? getPortraitRect(image) : null;
      if (image && portraitRect) {
        const grid = makeFragments(image, portraitRect);
        outgoingFragments = grid.items;
        fragmentColumns = grid.columns;
        fragmentRows = grid.rows;
        outgoingFragmentMap = new Map(
          outgoingFragments.map((item) => [
            item.row * fragmentColumns + item.column,
            item,
          ]),
        );
        if (transitioning) {
          const nextRect = getPortraitRect(imageCache[targetIndex]);
          const targetItems = nextRect
            ? makeFragments(imageCache[targetIndex], nextRect, grid).items
            : [];
          incomingFragmentMap = new Map(
            targetItems.map((item) => [
              item.row * fragmentColumns + item.column,
              item,
            ]),
          );
        }
      }
      if (!transitioning && initialized) drawStaticPortrait(image);
    };

    const smoothEase = (value) => value * value * (3 - 2 * value);
    const drawTransition = (now) => {
      if (disposed || !transitioning) return;
      const progress = Math.min(1, (now - transitionStartedAt) / transitionDuration);
      const outgoing = imageCache[currentIndex];
      const incoming = imageCache[targetIndex];
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      for (let cell = 0; cell < fragmentColumns * fragmentRows; cell += 1) {
        const index = cell;
        const fragment = outgoingFragmentMap.get(cell);
        if (fragment) {
          const oldStart = (1 - fragment.centerX) * 0.48;
          const oldProgress = Math.max(
            0,
            Math.min(1, (progress - oldStart) / 0.28),
          );
          if (oldProgress < 1) {
            const scatter = smoothEase(oldProgress);
            const waveActive = oldProgress > 0 && oldProgress < 1;
            const x = fragment.x + fragment.scatterX * scatter * fragment.depth;
            const y = fragment.y + fragment.scatterY * scatter * fragment.depth;
            const scale = 1 - scatter * 0.38;
            drawImageFragment(
              outgoing,
              fragment,
              x,
              y,
              fragment.width * scale,
              fragment.height * scale,
              1 - scatter,
              fragment.rotation * scatter,
              waveActive && (fragment.glow || index % 37 === 0),
            );
            if (waveActive && index % 13 === 0) {
              context.save();
              context.globalAlpha = 1 - scatter;
              context.fillStyle = "rgba(96, 220, 255, 0.88)";
              context.fillRect(
                x + fragment.width * 0.35,
                y + fragment.height * 0.35,
                2,
                2,
              );
              context.restore();
            }
          }
        }

        const incomingFragment = incomingFragmentMap.get(cell);
        if (!incomingFragment) continue;
        const newStart = 0.31 + incomingFragment.centerX * 0.48;
        const newProgress = Math.max(
          0,
          Math.min(1, (progress - newStart) / 0.24),
        );
        if (newProgress > 0) {
          const arrival = smoothEase(newProgress);
          const x =
            incomingFragment.x -
            (1 - arrival) * incomingFragment.scatterX * incomingFragment.depth;
          const y =
            incomingFragment.y +
            (1 - arrival) * incomingFragment.scatterY * 0.35;
          drawImageFragment(
            incoming,
            incomingFragment,
            x,
            y,
            incomingFragment.width * (0.68 + arrival * 0.32),
            incomingFragment.height * (0.68 + arrival * 0.32),
            arrival,
            incomingFragment.rotation * (1 - arrival),
            newProgress < 0.75 && (incomingFragment.glow || index % 37 === 0),
          );
        }
      }
      drawFocusRing();

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(drawTransition);
      } else {
        currentIndex = targetIndex;
        transitioning = false;
        setDisplayIndex(currentIndex);
        resizeCanvas();
        if (pendingManualSwitch) {
          pendingManualSwitch = false;
          window.clearTimeout(switchTimer);
          beginTransition();
        } else {
          scheduleTransition();
        }
      }
    };

    const beginTransition = async () => {
      if (
        disposed ||
        transitioning ||
        preparingTransition ||
        motionPreference.matches
      ) {
        return;
      }
      preparingTransition = true;
      targetIndex = (currentIndex + 1) % portraits.length;
      try {
        await loadImage(targetIndex);
      } catch (error) {
        preparingTransition = false;
        console.error("Unable to load the next hero portrait.", error);
        scheduleTransition();
        return;
      }
      if (disposed || motionPreference.matches) {
        preparingTransition = false;
        return;
      }
      const outgoingRect = getPortraitRect(imageCache[currentIndex]);
      const incomingRect = getPortraitRect(imageCache[targetIndex]);
      if (!outgoingRect || !incomingRect) {
        preparingTransition = false;
        scheduleTransition();
        return;
      }
      const grid = makeFragments(imageCache[currentIndex], outgoingRect);
      outgoingFragments = grid.items;
      fragmentColumns = grid.columns;
      fragmentRows = grid.rows;
      outgoingFragmentMap = new Map(
        outgoingFragments.map((item) => [
          item.row * fragmentColumns + item.column,
          item,
        ]),
      );
      const targetItems = makeFragments(
        imageCache[targetIndex],
        incomingRect,
        grid,
      ).items;
      incomingFragmentMap = new Map(
        targetItems.map((item) => [
          item.row * fragmentColumns + item.column,
          item,
        ]),
      );
      if (outgoingFragments.length === 0 || incomingFragmentMap.size === 0) {
        preparingTransition = false;
        console.error("The portrait could not be sampled for its transition.");
        currentIndex = targetIndex;
        setDisplayIndex(currentIndex);
        resizeCanvas();
        scheduleTransition();
        return;
      }
      preparingTransition = false;
      transitioning = true;
      transitionStartedAt = performance.now();
      animationFrame = window.requestAnimationFrame(drawTransition);
    };

    function scheduleTransition() {
      window.clearTimeout(switchTimer);
      if (
        disposed ||
        motionPreference.matches ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      switchTimer = window.setTimeout(beginTransition, 4000);
    }

    const handleMotionPreference = () => {
      setMotionAllowed(!motionPreference.matches);
      window.clearTimeout(switchTimer);
      window.cancelAnimationFrame(animationFrame);
      transitioning = false;
      preparingTransition = false;
      if (motionPreference.matches) {
        canvas.style.opacity = "0";
        portrait.style.opacity = "1";
        setDisplayIndex(currentIndex);
        return;
      }
      if (!canvasAvailable) {
        portrait.style.opacity = "1";
        return;
      }
      initialized = true;
      canvas.style.opacity = "1";
      portrait.style.opacity = "0";
      resizeCanvas();
      scheduleTransition();
    };

    transitionRef.current = () => {
      if (motionPreference.matches) return;
      window.clearTimeout(switchTimer);
      if (transitioning || preparingTransition) {
        pendingManualSwitch = true;
        return;
      }
      beginTransition();
    };

    const initialize = async () => {
      if (motionPreference.matches) {
        setMotionAllowed(false);
        return;
      }
      try {
        await Promise.all(portraits.map((_, index) => loadImage(index)));
      } catch (error) {
        console.error("A hero portrait image failed to load.", error);
        canvasAvailable = false;
        canvas.hidden = true;
        portrait.style.opacity = "1";
        setMotionAllowed(false);
        return;
      }
      if (disposed) return;
      initialized = true;
      resizeCanvas();
      if (motionPreference.matches) {
        canvas.style.opacity = "0";
        portrait.style.opacity = "1";
      } else {
        canvas.style.opacity = "1";
        portrait.style.opacity = "0";
        scheduleTransition();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(switchTimer);
      } else if (!transitioning) {
        scheduleTransition();
      }
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(hero);
    observer.observe(portrait);
    motionPreference.addEventListener("change", handleMotionPreference);
    const onFocusChange = () => {
      if (!transitioning) drawStaticPortrait();
    };
    portrait.addEventListener("focus", onFocusChange);
    portrait.addEventListener("blur", onFocusChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    initialize();

    return () => {
      disposed = true;
      window.clearTimeout(switchTimer);
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      motionPreference.removeEventListener("change", handleMotionPreference);
      portrait.removeEventListener("focus", onFocusChange);
      portrait.removeEventListener("blur", onFocusChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      transitionRef.current = null;
    };
  }, [portraits]);

  return (
    <>
      <img
        ref={imageRef}
        className="person"
        src={portraits[displayIndex].src}
        alt={portraits[displayIndex].alt}
        role={motionAllowed ? "button" : undefined}
        tabIndex={motionAllowed ? 0 : undefined}
        aria-label={
          motionAllowed
            ? `Portrait ${displayIndex + 1} of ${portraits.length}. Click to transform to the next portrait.`
            : undefined
        }
        onClick={() => transitionRef.current?.()}
        onKeyDown={(event) => {
          if (motionAllowed && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            transitionRef.current?.();
          }
        }}
      />
      <canvas
        ref={canvasRef}
        className="portrait-effects-canvas"
        aria-hidden="true"
      />
    </>
  );
}

function TouchCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    let lastScrollY = window.scrollY;
    let hideTimeout;
    let resetTimeout;
    let animationFrame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let hasPosition = false;

    const animatePosition = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      cursor.style.setProperty("--cursor-x", `${currentX}px`);
      cursor.style.setProperty("--cursor-y", `${currentY}px`);

      if (
        Math.abs(targetX - currentX) > 0.5 ||
        Math.abs(targetY - currentY) > 0.5
      ) {
        animationFrame = window.requestAnimationFrame(animatePosition);
      } else {
        currentX = targetX;
        currentY = targetY;
        cursor.style.setProperty("--cursor-x", `${currentX}px`);
        cursor.style.setProperty("--cursor-y", `${currentY}px`);
        animationFrame = 0;
      }
    };

    const showCursor = (x, y, emoji, shouldHide = false) => {
      targetX = x;
      targetY = y;
      if (!hasPosition) {
        currentX = x;
        currentY = y;
        hasPosition = true;
        cursor.style.setProperty("--cursor-x", `${x}px`);
        cursor.style.setProperty("--cursor-y", `${y}px`);
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animatePosition);
      }
      cursor.textContent = emoji;
      cursor.classList.add("visible");
      window.clearTimeout(hideTimeout);
      window.clearTimeout(resetTimeout);

      if (shouldHide) {
        hideTimeout = window.setTimeout(() => {
          cursor.classList.remove("visible");
        }, 1000);
      } else {
        resetTimeout = window.setTimeout(() => {
          cursor.textContent = "TOUCH";
        }, 650);
      }
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        showCursor(event.clientX, event.clientY, "TOUCH", true);
      } else if (hasFinePointer) {
        showCursor(event.clientX, event.clientY, "TOUCH");
      }
    };

    const handlePointerDown = (event) => {
      showCursor(
        event.clientX,
        event.clientY,
        "TOUCH",
        event.pointerType === "touch",
      );
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === lastScrollY) return;

      lastScrollY = currentScrollY;
      showCursor(
        hasPosition ? targetX : window.innerWidth / 2,
        hasPosition ? targetY : window.innerHeight / 2,
        "SCROLL",
        !hasFinePointer,
      );
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(hideTimeout);
      window.clearTimeout(resetTimeout);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div className="touch-cursor" ref={cursorRef} aria-hidden="true" />;
}

function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(() =>
    window.location.pathname.startsWith("/practices/") ? "projects" : "home",
  );
  const [showSystemIntro, setShowSystemIntro] = useState(shouldShowSystemIntro);
  const completeSystemIntro = useCallback(() => setShowSystemIntro(false), []);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let lenis = null;
    const updateSmoothScroll = () => {
      if (motionPreference.matches) {
        lenis?.destroy();
        lenis = null;
        return;
      }

      if (!lenis) {
        lenis = new Lenis({
          anchors: true,
          autoRaf: true,
          lerp: 0.08,
          smoothWheel: true,
          wheelMultiplier: 0.9,
        });
        lenis.on("scroll", () => {
          window.dispatchEvent(new Event("portfolio:lenis-scroll"));
        });
      }
    };
    updateSmoothScroll();
    motionPreference.addEventListener("change", updateSmoothScroll);
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const sections = navigation
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter(Boolean);
    let activeSectionFrame = 0;
    const updateActiveSection = () => {
      if (activeSectionFrame) return;

      activeSectionFrame = window.requestAnimationFrame(() => {
        activeSectionFrame = 0;
        if (window.location.pathname.startsWith("/practices/")) {
          setActiveSection("projects");
          return;
        }
        const activeLine = Math.min(window.innerHeight * 0.35, 180);
        const currentSection = sections
          .filter((section) => section.getBoundingClientRect().top <= activeLine)
          .sort(
            (a, b) =>
              b.getBoundingClientRect().top - a.getBoundingClientRect().top,
          )[0];

        if (currentSection) setActiveSection(currentSection.id);
      });
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    const updateActiveRoute = () => {
      if (window.location.pathname.startsWith("/practices/")) {
        setActiveSection("projects");
        return;
      }
      const hashSection = window.location.hash.slice(1);
      if (navigation.some((item) => item.toLowerCase() === hashSection)) {
        setActiveSection(hashSection);
      }
    };
    const scrollToPracticeTop = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };
    window.addEventListener("portfolio:route-change", updateActiveRoute);
    window.addEventListener("portfolio:practice-open", scrollToPracticeTop);
    window.addEventListener("popstate", updateActiveRoute);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("portfolio:route-change", updateActiveRoute);
      window.removeEventListener("portfolio:practice-open", scrollToPracticeTop);
      window.removeEventListener("popstate", updateActiveRoute);
      window.cancelAnimationFrame(activeSectionFrame);
      motionPreference.removeEventListener("change", updateSmoothScroll);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      {showSystemIntro && (
        <SystemIntro
          onComplete={completeSystemIntro}
        />
      )}
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            setActiveSection("home");
            if (
              window.location.pathname.startsWith("/practices/") &&
              event.button === 0 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              event.preventDefault();
              window.location.assign("/#home");
            }
          }}
        >
          <img className="brand-logo" src="/images/logo-transparent.png" alt="" />
          Atharva Deshmukh
        </a>
        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          className={open ? "nav show" : "nav"}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const id = item.toLowerCase();
            return (
              <a
                className={activeSection === id ? "active" : ""}
                key={item}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={(event) => {
                  setOpen(false);
                  setActiveSection(id);
                  if (
                    id !== "projects" &&
                    window.location.pathname.startsWith("/practices/") &&
                    event.button === 0 &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  ) {
                    event.preventDefault();
                    window.location.assign(`/#${id}`);
                    return;
                  }
                  if (
                    id === "projects" &&
                    event.button === 0 &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  ) {
                    window.dispatchEvent(new Event("portfolio:show-practices"));
                  }
                }}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <a
          className="connect connect-btn"
          href={contactLinks.email}
          target="_blank"
          rel="noreferrer"
          aria-label="Let's Connect by email"
        >
          <span className="connect-label">Let's Connect</span>
          <ArrowRight className="arrow" size={16} aria-hidden="true" />
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="sky" />
          <div className="mountain m1" />
          <div className="mountain m2" />
          <div className="mountain m3" />
          <div className="hero-copy">
            <div className="pill">
              <i /> CURIOUS BY NATURE · BUILDER BY CHOICE
            </div>
            <p className="hello">Hi, I'm</p>
            <h1>
              Atharva
              <br />
              <span>Deshmukh</span>
            </h1>
            <h2>Software Developer</h2>
            <p className="desc">
              I turn complex challenges into thoughtful digital experiences
              through intuitive design, reliable engineering, and seamless
              delivery.
            </p>
            <div className="actions">
              <a
                className="btn primary"
                href="#projects"
                onClick={(event) => {
                  if (
                    event.button === 0 &&
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  ) {
                    window.dispatchEvent(
                      new Event("portfolio:show-practices"),
                    );
                  }
                }}
              >
                View My Work <ArrowRight size={17} />
              </a>
              <a className="btn ghost" href="#contact">
                <Download size={16} /> Download Resume
              </a>
            </div>
            <TechBadges />
          </div>
          <div className="person-glow" />
          <CinematicPortrait portraits={portraitImages} />
          <a className="scroll" href="#about" aria-label="Scroll to the About section">
            <span className="scroll-mouse" aria-hidden="true">
              <i />
            </span>
            <span>Scroll to explore</span>
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </section>

        <section className="section" id="about">
          <label>01 / ABOUT ME</label>
          <div className="heading">
            <h2>
              Crafting digital
              <br />
              <span>experiences.</span>
            </h2>
            <p>
              I’m drawn to the moment a complex problem becomes simple to use.
              I listen, ask better questions, and turn uncertainty into
              considered digital experiences—built with care, made to last, and
              grounded in what people actually need.
            </p>
          </div>
        </section>

        <DeferredTechnologyGlobe />

        <SelectedWorkSection />

        <section className="contact" id="contact">
          <label>04 / WHAT'S NEXT?</label>
          <h2>
            Have a good idea?
            <br />
            <span>Let's build it.</span>
          </h2>
          <p>
            I'm open to frontend opportunities, collaborations, and interesting
            product problems.
          </p>
          <a
            className="btn primary"
            href={contactLinks.email}
            target="_blank"
            rel="noreferrer"
          >
            Get in touch <ArrowRight size={17} />
          </a>
          <div className="social">
            <a href={contactLinks.github} aria-label="GitHub" target="_blank" rel="noreferrer">
              <Github />
            </a>
            <a href={contactLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <Linkedin />
            </a>
            <a
              href={contactLinks.email}
              aria-label="Email"
              target="_blank"
              rel="noreferrer"
            >
              <Mail />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#home">
          <img className="brand-logo" src="/images/logo-transparent.png" alt="" />
          Atharva Deshmukh
        </a>
        <span>Designed with intention · © {new Date().getFullYear()}</span>
        <a href="#home">Back to top ↑</a>
      </footer>
      <TouchCursor />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
