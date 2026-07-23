/** Accessible click-to-zoom lightbox for images inside a container. */

type LightboxWindow = Window & {
  __closeLightbox?: (() => void) | null;
  __lightboxSwapBound?: boolean;
};

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const ZOOM_STEP = 1.25;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Prefer the widest candidate from srcset so lightbox isn't capped by the page size. */
function largestImageSrc(img: HTMLImageElement): string {
  const srcset = img.getAttribute("srcset");
  if (!srcset) return img.currentSrc || img.src;

  let bestUrl = img.currentSrc || img.src;
  let bestWidth = 0;

  for (const part of srcset.split(",")) {
    const match = part.trim().match(/^(.+?)\s+(\d+)w$/);
    if (!match) continue;
    const width = Number(match[2]);
    if (width > bestWidth) {
      bestWidth = width;
      bestUrl = match[1];
    }
  }

  return bestUrl;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function initImageLightbox(
  container: Element | null,
  selector = "img.js-zoomable"
): void {
  if (!container) return;
  const root = container;

  let overlay: HTMLDivElement | null = null;
  let lastFocused: HTMLElement | null = null;
  let removeMouseListeners: (() => void) | null = null;

  requestAnimationFrame(() => {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>(selector));
    for (const image of images) {
      if (image.closest("a")) continue;
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute(
        "aria-label",
        image.alt ? `Zoom image: ${image.alt}` : "Zoom image"
      );
      image.classList.add("cursor-zoom-in");
    }
  });

  function open(src: string, alt: string, trigger: HTMLElement | null) {
    if (overlay) return;
    lastFocused = trigger ?? (document.activeElement as HTMLElement | null);

    overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute(
      "aria-label",
      alt ? `Image preview: ${alt}` : "Image preview"
    );
    overlay.className =
      "fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center overflow-hidden bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-200 motion-reduce:transition-none";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close image preview");
    closeButton.className =
      "absolute end-4 top-4 z-10 rounded p-2 text-3xl leading-none text-white";
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", close);

    const hint = document.createElement("p");
    hint.className =
      "pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded bg-black/50 px-3 py-1 text-xs text-white/90";
    hint.textContent =
      "Scroll to zoom · Double-click to zoom further · Drag to pan · Esc to close";

    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    image.draggable = false;
    image.className =
      "h-auto w-auto max-h-[96dvh] max-w-[98dvw] origin-center select-none object-contain";
    image.style.cursor = "zoom-in";

    overlay.append(closeButton, image, hint);
    overlay.addEventListener("click", e => {
      if (e.target === overlay && currentScale <= 1.01) close();
    });

    let currentScale = 1;
    let translateX = 0;
    let translateY = 0;
    let initialDist = 0;
    let initialScale = 1;
    let panStartX = 0;
    let panStartY = 0;
    let panStartTranslateX = 0;
    let panStartTranslateY = 0;
    let lastTapTime = 0;
    let isPanning = false;

    function applyTransform() {
      image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
      image.style.cursor = currentScale > 1.01 ? "grab" : "zoom-in";
    }

    function clampPan() {
      if (!overlay) return;
      const maxX = Math.max(
        0,
        (image.clientWidth * currentScale - overlay.clientWidth) / 2
      );
      const maxY = Math.max(
        0,
        (image.clientHeight * currentScale - overlay.clientHeight) / 2
      );
      translateX = clamp(translateX, -maxX, maxX);
      translateY = clamp(translateY, -maxY, maxY);
    }

    function resetTransform() {
      currentScale = 1;
      translateX = 0;
      translateY = 0;
      image.style.transform = "";
      image.style.cursor = "zoom-in";
    }

    function setScale(next: number, originX?: number, originY?: number) {
      if (!overlay) return;
      const prev = currentScale;
      currentScale = clamp(next, MIN_SCALE, MAX_SCALE);

      if (currentScale <= 1.01) {
        resetTransform();
        return;
      }

      if (
        typeof originX === "number" &&
        typeof originY === "number" &&
        prev > 0
      ) {
        const rect = overlay.getBoundingClientRect();
        const cx = originX - (rect.left + rect.width / 2);
        const cy = originY - (rect.top + rect.height / 2);
        const ratio = currentScale / prev;
        translateX = cx - (cx - translateX) * ratio;
        translateY = cy - (cy - translateY) * ratio;
      }

      clampPan();
      applyTransform();
    }

    function cycleZoom(clientX: number, clientY: number) {
      if (currentScale < 1.5) setScale(2.5, clientX, clientY);
      else if (currentScale < 4) setScale(5, clientX, clientY);
      else resetTransform();
    }

    overlay.addEventListener(
      "wheel",
      e => {
        e.preventDefault();
        const direction = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
        setScale(currentScale * direction, e.clientX, e.clientY);
      },
      { passive: false }
    );

    image.addEventListener("dblclick", e => {
      e.preventDefault();
      e.stopPropagation();
      cycleZoom(e.clientX, e.clientY);
    });

    function onMouseMove(e: MouseEvent) {
      if (!isPanning) return;
      translateX = panStartTranslateX + (e.clientX - panStartX);
      translateY = panStartTranslateY + (e.clientY - panStartY);
      clampPan();
      applyTransform();
    }

    function onMouseUp() {
      if (!isPanning) return;
      isPanning = false;
      image.style.cursor = currentScale > 1.01 ? "grab" : "zoom-in";
    }

    image.addEventListener("mousedown", e => {
      if (e.button !== 0 || currentScale <= 1.01) return;
      e.preventDefault();
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartTranslateX = translateX;
      panStartTranslateY = translateY;
      image.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    removeMouseListeners = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      removeMouseListeners = null;
    };

    overlay.addEventListener(
      "touchstart",
      e => {
        const t = e.touches;
        if (t.length === 2) {
          initialDist = Math.hypot(
            t[1].clientX - t[0].clientX,
            t[1].clientY - t[0].clientY
          );
          initialScale = currentScale;
        } else if (t.length === 1) {
          const now = Date.now();
          if (now - lastTapTime < 300) {
            e.preventDefault();
            cycleZoom(t[0].clientX, t[0].clientY);
            lastTapTime = 0;
            panStartX = t[0].clientX;
            panStartY = t[0].clientY;
            panStartTranslateX = translateX;
            panStartTranslateY = translateY;
          } else {
            lastTapTime = now;
            if (currentScale > 1) {
              panStartX = t[0].clientX;
              panStartY = t[0].clientY;
              panStartTranslateX = translateX;
              panStartTranslateY = translateY;
            }
          }
        }
      },
      { passive: false }
    );

    overlay.addEventListener(
      "touchmove",
      e => {
        if (!overlay) return;
        const t = e.touches;
        if (t.length === 2) {
          e.preventDefault();
          const dist = Math.hypot(
            t[1].clientX - t[0].clientX,
            t[1].clientY - t[0].clientY
          );
          setScale(initialScale * (dist / Math.max(initialDist, 1)));
        } else if (t.length === 1 && currentScale > 1) {
          e.preventDefault();
          translateX = panStartTranslateX + (t[0].clientX - panStartX);
          translateY = panStartTranslateY + (t[0].clientY - panStartY);
          clampPan();
          applyTransform();
        } else if (t.length === 1) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    (window as LightboxWindow).__closeLightbox = close;

    requestAnimationFrame(() => overlay?.classList.add("opacity-100"));
    closeButton.focus();
  }

  function close() {
    if (!overlay) return;
    const el = overlay;
    overlay = null;
    (window as LightboxWindow).__closeLightbox = null;
    removeMouseListeners?.();

    document.removeEventListener("keydown", onKeyDown);
    document.body.style.overflow = "";
    lastFocused?.focus();
    lastFocused = null;

    if (prefersReducedMotion()) {
      el.remove();
      return;
    }
    const remove = () => el.remove();
    el.addEventListener("transitionend", remove, { once: true });
    setTimeout(remove, 250);
    el.classList.remove("opacity-100");
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  }

  function trapFocus(e: KeyboardEvent) {
    if (!overlay) return;
    const focusables = overlay.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function triggerFromEvent(e: Event): HTMLImageElement | null {
    const target = e.target;
    if (!(target instanceof Element)) return null;
    const image = target.closest("img");
    if (
      !image ||
      !(image instanceof HTMLImageElement) ||
      !root.contains(image) ||
      !image.matches(selector) ||
      image.closest("a")
    ) {
      return null;
    }
    return image;
  }

  function activate(image: HTMLImageElement) {
    open(largestImageSrc(image), image.alt, image);
  }

  root.addEventListener("click", e => {
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    activate(image);
  });

  root.addEventListener("keydown", e => {
    if (!(e instanceof KeyboardEvent)) return;
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    activate(image);
  });
}

export function bindLightboxViewTransitions(init: () => void): void {
  const win = window as LightboxWindow;
  if (!win.__lightboxSwapBound) {
    win.__lightboxSwapBound = true;
    document.addEventListener("astro:before-swap", () => win.__closeLightbox?.());
  }
  init();
  document.addEventListener("astro:after-swap", init);
}
