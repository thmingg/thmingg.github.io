const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

let scrollCueAbort: AbortController | null = null;
let revealObserver: IntersectionObserver | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function revealElements(): void {
  revealObserver?.disconnect();
  revealObserver = null;

  const targets = document.querySelectorAll<HTMLElement>(
    ".reveal, .reveal-stagger"
  );

  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver?.unobserve(entry.target);
      }
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  targets.forEach(el => {
    if (el.classList.contains("is-visible") || isInViewport(el)) {
      el.classList.add("is-visible");
      return;
    }
    revealObserver?.observe(el);
  });
}

function initScrollCue(): void {
  scrollCueAbort?.abort();
  scrollCueAbort = null;

  const cue = document.querySelector<HTMLElement>("#scroll-cue");
  if (!cue) return;

  if (prefersReducedMotion()) {
    cue.classList.remove("is-hidden");
    return;
  }

  scrollCueAbort = new AbortController();

  const onScroll = () => {
    if (window.scrollY > 48) {
      cue.classList.add("is-hidden");
    } else {
      cue.classList.remove("is-hidden");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, {
    passive: true,
    signal: scrollCueAbort.signal,
  });
}

function initMotion(): void {
  revealElements();
  initScrollCue();
}

initMotion();
document.addEventListener("astro:page-load", initMotion);
