// Animated starfield background rendered inside the existing NOVA.js file.
document.documentElement.classList.add("js-enabled");

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0;
let height = 0;
let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
let pointerX = 0;
let pointerY = 0;
let scrollShift = 0;
let scrollFrame = null;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function smoothRange(value, start, end) {
  const progress = Math.min(Math.max((value - start) / Math.max(end - start, 0.001), 0), 1);
  return progress * progress * (3 - 2 * progress);
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const starCount = Math.min(130, Math.floor((width * height) / 11800));
  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.25 + 0.25,
    alpha: Math.random() * 0.46 + 0.18,
    speed: Math.random() * 0.08 + 0.018
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const pageProgress = Math.min(Math.max(scrollShift / maxScroll, 0), 1);
  const nebulaX = width * (0.56 + Math.sin(pageProgress * Math.PI * 1.2) * 0.09);
  const nebulaY = height * (0.18 + pageProgress * 0.18);
  const nebula = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, Math.max(width, height) * 0.72);
  nebula.addColorStop(0, `rgba(121, 223, 255, ${(0.04 + pageProgress * 0.018).toFixed(3)})`);
  nebula.addColorStop(0.36, `rgba(154, 134, 255, ${(0.026 + (1 - pageProgress) * 0.012).toFixed(3)})`);
  nebula.addColorStop(1, "rgba(1, 4, 11, 0)");
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    if (!prefersReducedMotion()) {
      star.y += star.speed;
      if (star.y > height + 4) {
        star.y = -4;
        star.x = Math.random() * width;
      }
    }

    ctx.beginPath();
    const depth = star.radius / 2.05;
    const parallaxX = pointerX * depth * 0.34;
    const parallaxY = (pointerY * depth * 0.26) + (scrollShift * depth * 0.08);
    ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(121, 223, 255, 0.42)";
    ctx.fill();
  });

  if (!prefersReducedMotion()) {
    requestAnimationFrame(drawStars);
  }
}

// Reveals sections as they enter the viewport for a smooth premium feel.
const sections = document.querySelectorAll(".section");
const animatedElements = document.querySelectorAll("[data-animate]");
const counters = document.querySelectorAll("[data-counter]");
const launchIntro = document.querySelector(".launch-intro");
const journeySection = document.querySelector(".journey-section");
const journeySteps = document.querySelectorAll(".journey-orbit span");
const siteFooter = document.querySelector(".site-footer");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("journey-orbit") && !prefersReducedMotion()) {
          entry.target.classList.add("is-revealing");
          window.setTimeout(() => entry.target.classList.remove("is-revealing"), 1900);
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const startTime = performance.now();
      const duration = 1650;

      if (prefersReducedMotion()) {
        counter.textContent = target.toLocaleString("en-US");
        counterObserver.unobserve(counter);
        return;
      }

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        counter.textContent = Math.round(target * eased).toLocaleString("en-US");

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.65 }
);

// Adds a subtle active state to the header after the user starts scrolling.
const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const navTargets = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);
let activeNavId = "";
let deferredFeaturesInitialized = false;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("has-scrolled", window.scrollY > 20);
}

function scheduleIdleWork(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1400 });
    return;
  }

  window.setTimeout(callback, 320);
}

function initializeDeferredFeatures() {
  if (deferredFeaturesInitialized) return;

  deferredFeaturesInitialized = true;
  sections.forEach((section) => observer.observe(section));
  animatedElements.forEach((element) => observer.observe(element));
  counters.forEach((counter) => counterObserver.observe(counter));
  if (siteFooter) observer.observe(siteFooter);

  setupLightboxTriggers();
  setupGalaxyMotionTargets();
  resizeCanvas();
  drawStars();
}

function setActiveNavLink(sectionId) {
  if (sectionId === activeNavId) return;

  activeNavId = sectionId;
  navTargets.forEach(({ link, target }) => {
    const isActive = target.id === sectionId;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveNav() {
  if (!navTargets.length) return;

  const viewportHeight = Math.max(window.innerHeight, 1);
  let currentId = "";
  let strongestVisibility = 0;

  navTargets.forEach(({ target }) => {
    const rect = target.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

    if (visibleHeight > strongestVisibility) {
      strongestVisibility = visibleHeight;
      currentId = target.id;
    }
  });

  setActiveNavLink(strongestVisibility > 0 ? currentId : "");
}

const lightbox = document.getElementById("screenshotLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxSubtitle = document.getElementById("lightboxSubtitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const heroVisual = document.querySelector(".hero-visual");
const heroPhone = document.querySelector(".hero-phone");

function setupGalaxyMotionTargets() {
  document.querySelectorAll("[data-image='画像/optimized/GalaxyView-660.jpg']").forEach((target) => {
    target.classList.add("galaxy-motion");
  });
}

function setupLightboxTriggers() {
  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");

    if (!trigger.hasAttribute("aria-label")) {
      const title = trigger.dataset.title || "NOVA screenshot";
      trigger.setAttribute("aria-label", `${title}のスクリーンショットを拡大表示`);
    }
  });
}

function openLightbox(trigger) {
  const image = trigger.dataset.image;
  if (!image) return;

  lightboxImage.src = image;
  lightboxImage.alt = trigger.dataset.title || "NOVA screenshot";
  lightboxTitle.textContent = trigger.dataset.title || "";
  lightboxSubtitle.textContent = trigger.dataset.subtitle || "";
  lightboxDescription.textContent = trigger.dataset.description || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox.classList.contains("is-open")) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function updateJourneyGlow() {
  if (!journeySection || !journeySteps.length || prefersReducedMotion()) return;

  const rect = journeySection.getBoundingClientRect();
  const travel = Math.max(window.innerHeight + rect.height, 1);
  const progress = Math.min(Math.max((window.innerHeight - rect.top) / travel, 0), 1);
  const activeIndex = Math.min(journeySteps.length - 1, Math.max(0, Math.floor(progress * journeySteps.length)));

  journeySteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === activeIndex);
    step.classList.toggle("is-passed", index < activeIndex);
  });
}

function updateLaunchIntro() {
  const root = document.documentElement.style;
  if (!launchIntro || prefersReducedMotion()) {
    root.setProperty("--launch-progress", "1");
    root.setProperty("--launch-rocket-y", "-18px");
    root.setProperty("--launch-flame-scale", "1");
    root.setProperty("--launch-copy-y", "0px");
    root.setProperty("--launch-stars-opacity", "0.18");
    root.setProperty("--launch-rocket-glow", "34px");
    root.setProperty("--launch-smoke-opacity", "0.18");
    root.setProperty("--launch-smoke-scale", "1");
    root.setProperty("--launch-intro-opacity", "1");
    root.setProperty("--launch-pad-glow-opacity", "0.1");
    root.setProperty("--launch-cloud-opacity", "0.08");
    root.setProperty("--launch-cloud-field-opacity", "0.06");
    root.setProperty("--launch-cloud-y-slow", "0px");
    root.setProperty("--launch-cloud-y-medium", "0px");
    root.setProperty("--launch-cloud-y-fast", "0px");
    root.setProperty("--launch-cloud-y-near", "0px");
    root.setProperty("--launch-cloud-drift", "0px");
    root.setProperty("--launch-cloud-drift-small", "0px");
    root.setProperty("--launch-cloud-drift-mid", "0px");
    root.setProperty("--launch-cloud-drift-reverse", "0px");
    root.setProperty("--launch-atmo-opacity", "0.06");
    root.setProperty("--launch-space-opacity", "0.18");
    root.setProperty("--launch-particle-opacity", "0");
    root.setProperty("--launch-flame-opacity", "0.42");
    root.setProperty("--launch-rocket-light", "0.06");
    launchIntro.classList.remove("is-launching");
    return;
  }

  const rect = launchIntro.getBoundingClientRect();
  const travel = Math.max(rect.height - window.innerHeight, 1);
  const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
  const liftoffStart = 0.08;
  const liftoffProgress = Math.min(Math.max((progress - liftoffStart) / (1 - liftoffStart), 0), 1);
  const acceleratedLift = Math.pow(liftoffProgress, 1.75);
  const fade = 1 - Math.max(0, (progress - 0.78) / 0.22);
  const lift = -acceleratedLift * Math.min(window.innerHeight * 1.28, 1080);
  const isLaunching = progress > 0.015 && progress < 0.52;
  const ignitionPressure = Math.min(progress / 0.24, 1);
  const flameScale = 0.62 + ignitionPressure * 1.74 + liftoffProgress * 1.18;
  const smokeScale = 1 + ignitionPressure * 0.54 + liftoffProgress * 0.68;
  const cloudPresence = smoothRange(progress, 0.04, 0.14) * (1 - smoothRange(progress, 0.5, 0.66));
  const cloudDensity = smoothRange(progress, 0.25, 0.34) * (1 - smoothRange(progress, 0.4, 0.56));
  const cloudOpacity = cloudPresence * (0.34 + cloudDensity * 0.24);
  const cloudDrift = Math.sin(progress * Math.PI) * 42;

  launchIntro.classList.toggle("is-launching", isLaunching);

  root.setProperty("--launch-progress", progress.toFixed(4));
  root.setProperty("--launch-rocket-y", `${lift.toFixed(1)}px`);
  root.setProperty("--launch-flame-scale", flameScale.toFixed(3));
  root.setProperty("--launch-copy-y", `${(-progress * 22).toFixed(1)}px`);
  root.setProperty("--launch-stars-opacity", (0.36 * fade).toFixed(3));
  root.setProperty("--launch-rocket-glow", `${(40 + ignitionPressure * 72 + liftoffProgress * 22).toFixed(1)}px`);
  root.setProperty("--launch-smoke-opacity", (0.82 * (1 - liftoffProgress * 0.72)).toFixed(3));
  root.setProperty("--launch-smoke-scale", smokeScale.toFixed(3));
  root.setProperty("--launch-intro-opacity", fade.toFixed(3));
  root.setProperty("--launch-pad-glow-opacity", (0.08 + ignitionPressure * 0.32).toFixed(3));
  root.setProperty("--launch-cloud-opacity", Math.min(Math.max((progress - 0.18) / 0.38, 0), 0.24).toFixed(3));
  root.setProperty("--launch-cloud-field-opacity", cloudOpacity.toFixed(3));
  root.setProperty("--launch-cloud-y-slow", `${(72 + progress * 96).toFixed(1)}px`);
  root.setProperty("--launch-cloud-y-medium", `${(92 + progress * 156).toFixed(1)}px`);
  root.setProperty("--launch-cloud-y-fast", `${(118 + progress * 236).toFixed(1)}px`);
  root.setProperty("--launch-cloud-y-near", `${(54 + progress * 188).toFixed(1)}px`);
  root.setProperty("--launch-cloud-drift", `${cloudDrift.toFixed(1)}px`);
  root.setProperty("--launch-cloud-drift-small", `${(cloudDrift * 0.34).toFixed(1)}px`);
  root.setProperty("--launch-cloud-drift-mid", `${(cloudDrift * 0.62).toFixed(1)}px`);
  root.setProperty("--launch-cloud-drift-reverse", `${(-cloudDrift * 0.45).toFixed(1)}px`);
  root.setProperty("--launch-atmo-opacity", Math.min(Math.max((progress - 0.38) / 0.42, 0), 0.22).toFixed(3));
  root.setProperty("--launch-space-opacity", Math.min(Math.max((progress - 0.56) / 0.36, 0), 0.38).toFixed(3));
  root.setProperty("--launch-particle-opacity", (isLaunching || liftoffProgress > 0 ? Math.min(0.74, 0.2 + progress * 0.78) : 0).toFixed(3));
  root.setProperty("--launch-flame-opacity", Math.min(0.98, 0.56 + ignitionPressure * 0.32 + liftoffProgress * 0.1).toFixed(3));
  root.setProperty("--launch-rocket-light", Math.min(0.34, 0.06 + ignitionPressure * 0.2 + liftoffProgress * 0.08).toFixed(3));
}

function updateParallax() {
  scrollShift = window.scrollY;
  const x = pointerX * 18;
  const y = pointerY * 18 + Math.min(scrollShift * 0.018, 18);
  const heroScale = Math.max(0.94, 1 - Math.min(scrollShift, height || 1) / Math.max(height || 1, 1) * 0.06);
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const rocketProgress = Math.min(Math.max(scrollShift / maxScroll, 0), 1);
  const heroProgress = Math.min(Math.max(scrollShift / Math.max(height * 0.88, 1), 0), 1);
  const root = document.documentElement.style;
  const glassX = prefersReducedMotion() ? 0 : pointerX * 12;
  const glassY = prefersReducedMotion() ? 0 : pointerY * 12;
  root.setProperty("--hero-parallax-x", `${(x * 0.22).toFixed(2)}px`);
  root.setProperty("--hero-parallax-y", `${(y * 0.22).toFixed(2)}px`);
  root.setProperty("--glass-shadow-x", `${glassX.toFixed(2)}px`);
  root.setProperty("--glass-shadow-y", `${glassY.toFixed(2)}px`);
  root.setProperty("--halo-parallax-x", `${(x * 0.35).toFixed(2)}px`);
  root.setProperty("--halo-parallax-y", `${(y * 0.35).toFixed(2)}px`);
  root.setProperty("--planet-a-x", `${(x * -0.45).toFixed(2)}px`);
  root.setProperty("--planet-a-y", `${(y * -0.45).toFixed(2)}px`);
  root.setProperty("--planet-b-x", `${(x * 0.5).toFixed(2)}px`);
  root.setProperty("--planet-b-y", `${(y * 0.5).toFixed(2)}px`);
  root.setProperty("--hero-content-scale", heroScale.toFixed(3));
  root.setProperty("--hero-phone-scroll-scale", (1 - heroProgress * 0.075).toFixed(3));
  const heroGlowOpacity = 1 - heroProgress * 0.58;
  root.setProperty("--hero-glow-opacity", heroGlowOpacity.toFixed(3));
  root.setProperty("--hero-glow-before-opacity", (0.9 * heroGlowOpacity).toFixed(3));
  root.setProperty("--hero-glow-after-opacity", (0.78 * heroGlowOpacity).toFixed(3));
  root.setProperty("--nebula-scroll-x", `${(46 + Math.sin(rocketProgress * Math.PI) * 18).toFixed(2)}%`);
  root.setProperty("--nebula-scroll-y", `${(-4 + rocketProgress * 72).toFixed(2)}%`);
  root.setProperty("--nebula-scroll-opacity", (0.08 + Math.sin(rocketProgress * Math.PI) * 0.08).toFixed(3));
  const earth = Math.max(0, 1 - smoothRange(rocketProgress, 0.02, 0.2));
  const clouds = smoothRange(rocketProgress, 0.08, 0.28) * (1 - smoothRange(rocketProgress, 0.34, 0.54));
  const atmosphere = smoothRange(rocketProgress, 0.22, 0.48) * (1 - smoothRange(rocketProgress, 0.58, 0.78));
  const space = 0.12 + smoothRange(rocketProgress, 0.42, 0.76) * 0.22;
  const deep = smoothRange(rocketProgress, 0.62, 1);
  const voyageWave = prefersReducedMotion() ? 0.5 : 0.5 + Math.sin(rocketProgress * Math.PI * 2) * 0.5;
  const voyageDepth = 0.06 + smoothRange(rocketProgress, 0.18, 0.92) * 0.05;
  root.setProperty("--journey-earth-opacity", (0.16 * earth).toFixed(3));
  root.setProperty("--journey-cloud-opacity", (0.16 * clouds).toFixed(3));
  root.setProperty("--journey-atmo-opacity", (0.14 * atmosphere).toFixed(3));
  root.setProperty("--journey-space-opacity", space.toFixed(3));
  root.setProperty("--journey-deep-opacity", (0.12 * deep).toFixed(3));
  root.setProperty("--journey-deep-soft-opacity", (0.086 * deep).toFixed(3));
  root.setProperty("--voyage-cyan-opacity", (0.03 + voyageWave * 0.016).toFixed(3));
  root.setProperty("--voyage-violet-opacity", (0.022 + (1 - voyageWave) * 0.016).toFixed(3));
  root.setProperty("--voyage-depth-opacity", voyageDepth.toFixed(3));
  root.setProperty("--scroll-shift", `${scrollShift.toFixed(2)}px`);
  root.setProperty("--rocket-progress", rocketProgress.toFixed(4));
  root.setProperty("--rocket-progress-percent", `${(rocketProgress * 100).toFixed(2)}%`);
  root.setProperty("--rocket-trail-height", `${(72 + rocketProgress * 42).toFixed(1)}px`);
  const rocketGlowScale = 1 + Math.sin(rocketProgress * Math.PI) * 0.22;
  root.setProperty("--rocket-glow-scale", rocketGlowScale.toFixed(3));
  root.setProperty("--rocket-glow-blur", `${(22 * rocketGlowScale).toFixed(1)}px`);
  updateLaunchIntro();
  updateJourneyGlow();
}

function requestScrollUpdate() {
  if (scrollFrame) return;

  scrollFrame = requestAnimationFrame(() => {
    updateHeader();
    updateActiveNav();
    updateParallax();
    scrollFrame = null;
  });
}

function handlePointerMove(event) {
  pointerX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
  pointerY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
  updateParallax();
}

function updateHeroPhoneTilt(event) {
  if (!heroVisual || !heroPhone || !window.matchMedia("(pointer: fine)").matches) return;

  const rect = heroVisual.getBoundingClientRect();
  const localX = (event.clientX - rect.left) / Math.max(rect.width, 1);
  const localY = (event.clientY - rect.top) / Math.max(rect.height, 1);
  const x = Math.max(-1, Math.min(1, (localX - 0.5) * 2));
  const y = Math.max(-1, Math.min(1, (localY - 0.5) * 2));
  const root = document.documentElement.style;

  root.setProperty("--hero-phone-tilt-x", `${(-y * 4.5).toFixed(2)}deg`);
  root.setProperty("--hero-phone-tilt-y", `${(x * 6.5).toFixed(2)}deg`);
  root.setProperty("--hero-phone-shift-x", `${(x * 7).toFixed(2)}px`);
  root.setProperty("--hero-phone-shift-y", `${(y * 5).toFixed(2)}px`);
  heroPhone.classList.add("is-tilting");
}

function resetHeroPhoneTilt() {
  if (!heroPhone) return;

  const root = document.documentElement.style;
  root.setProperty("--hero-phone-tilt-x", "0deg");
  root.setProperty("--hero-phone-tilt-y", "0deg");
  root.setProperty("--hero-phone-shift-x", "0px");
  root.setProperty("--hero-phone-shift-y", "0px");
  heroPhone.classList.remove("is-tilting");
}

function handleResize() {
  resizeCanvas();
  updateActiveNav();
  if (prefersReducedMotion()) {
    drawStars();
  }
}

function handleReducedMotionChange() {
  if (prefersReducedMotion()) {
    journeySteps.forEach((step) => {
      step.classList.remove("is-active", "is-passed");
    });
    drawStars();
    return;
  }

  updateJourneyGlow();
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", handleResize);
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("pointermove", handlePointerMove, { passive: true });
if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
} else {
  reducedMotionQuery.addListener(handleReducedMotionChange);
}
if (heroVisual) {
  heroVisual.addEventListener("pointermove", updateHeroPhoneTilt, { passive: true });
  heroVisual.addEventListener("pointerleave", resetHeroPhoneTilt);
}
document.addEventListener("click", (event) => {
  const disabledTarget = event.target.closest(".disabled-cta");
  if (disabledTarget) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const closeTarget = event.target.closest("[data-lightbox-close]");
  if (closeTarget) {
    closeLightbox();
    return;
  }

  const trigger = event.target.closest("[data-lightbox]");
  if (trigger) {
    openLightbox(trigger);
  }
});
document.addEventListener("keydown", (event) => {
  const trigger = event.target.closest("[data-lightbox]");
  if (trigger && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openLightbox(trigger);
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }
});

if (header) header.classList.add("is-visible");
updateHeader();
updateActiveNav();
updateParallax();
window.requestAnimationFrame(() => {
  scheduleIdleWork(initializeDeferredFeatures);
});
