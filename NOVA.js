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
const languageStorageKey = "nova-language";
const localizedTextNodes = [];
const localizedAttributes = [];
const pageCopy = {
  ja: {
    title: "NOVA | 宇宙を、ゲームのように学ぶ。",
    description: "宇宙を、ゲームのように学ぶ。クイズ・銀河マップ・図鑑・ミッションで楽しく宇宙を学べる学習アプリ。"
  },
  en: {
    title: "NOVA | Learn Space Like a Game",
    description: "Learn space like a game. Explore the universe through quizzes, galaxy maps, collections, and missions."
  }
};
const textTranslations = {
  "宇宙を、ゲームのように学ぶ。": "Learn Space Like a Game",
  "クイズ、銀河マップ、図鑑、ミッションで、宇宙の知識を楽しく積み重ねる学習アプリ。": "Build your knowledge of space through quizzes, galaxy maps, collections, and missions.",
  "近日公開": "Coming Soon",
  "App Storeで公開予定": "Planned for release on the App Store",
  "宇宙の知識を、楽しく積み重ねる。": "Build your space knowledge, one step at a time.",
  "NOVAは、クイズ、銀河マップ、図鑑、ミッションを通して、宇宙の知識を楽しく積み重ねられる学習アプリです。": "NOVA is a learning app that helps you build space knowledge through quizzes, galaxy maps, collections, and missions.",
  "最初の一歩を、もっと美しく。": "Make the first step more beautiful.",
  "宇宙に興味はある。": "You are curious about space.",
  "でも、何から学べばいいのか分からない。": "But you may not know where to begin.",
  "NOVAは、その最初の一歩になるために生まれました。": "NOVA was created to be that first step.",
  "宇宙を学ぶことは、未来を学ぶこと。": "Learning space means learning the future.",
  "NOVAは、知識を増やすためだけのアプリではありません。宇宙への好奇心を育み、学び続ける楽しさを届けることを目指しています。": "NOVA is not only about gaining knowledge. It is designed to nurture curiosity about space and make continuous learning enjoyable.",
  "私たちは、誰もが宇宙をもっと身近に感じられる未来をつくります。": "We are building a future where everyone can feel closer to the universe.",
  "学びが進むほど、宇宙が広がる。": "The more you learn, the wider the universe becomes.",
  "クイズ、カテゴリ、XP、マップ、ミッション、図鑑。毎日の小さな進歩を、ひとつの探索体験へ。": "Quizzes, categories, XP, maps, missions, and collections turn small daily progress into one exploration experience.",
  "ホームから、銀河の奥へ。": "From home to the depths of the galaxy.",
  "学ぶ、進む、集める、振り返る。NOVAの体験は、ひとつの宇宙探索としてつながっています。": "Learn, progress, collect, and reflect. The NOVA experience connects everything as a single space exploration journey.",
  "NOVAの世界を、画面から。": "Step into NOVA through the screen.",
  "はじめた瞬間、広がる。": "A world opens the moment you begin.",
  "NOVAの世界観と学習の流れを、シンプルに体験できます。": "Experience NOVA's world and learning flow in a simple way.",
  "宇宙への入口。": "Your gateway to space.",
  "NOVAを開いた瞬間から、宇宙を学ぶ体験が始まります。": "The moment you open NOVA, your space learning journey begins.",
  "今日の宇宙へ、すぐに。": "Jump into today's universe.",
  "進捗、ミッション、次のクイズを一画面で確認できます。": "Check your progress, missions, and next quiz on one screen.",
  "一問ずつ、宇宙が近づく。": "One question brings space closer.",
  "宇宙の知識を、短いクイズで少しずつ深められます。": "Deepen your space knowledge little by little through short quizzes.",
  "知識が増えるほど、銀河が広がる。": "The more you know, the more your galaxy expands.",
  "学習の進み具合に合わせて銀河が広がります。": "Your galaxy expands as your learning progresses.",
  "学んだことを、図鑑で振り返る。": "Review what you have learned in your collection.",
  "学んだ内容を図鑑として振り返れます。": "Review what you have learned as a collection.",
  "成長が、見える。": "See your growth.",
  "正答率、学習数、XP、進捗をまとめて確認できます。": "Check your accuracy, learning count, XP, and progress in one place.",
  "今日の目的を、ひとつずつ。": "Complete today's goals one by one.",
  "毎日のミッションが、学習のきっかけをつくります。": "Daily missions give you a reason to keep learning.",
  "集中を、静かに積み重ねる。": "Build focus quietly over time.",
  "短い集中時間を設定して、学習に入りやすくします。": "Set short focus sessions to make it easier to start learning.",
  "探索の証を、美しく残す。": "Keep a beautiful record of your exploration.",
  "レベル、XP、達成状況をひとつにまとめて確認できます。": "View your level, XP, and achievements together.",
  "宇宙を、テーマごとに旅する。": "Travel through space by theme.",
  "基礎から未来の応用まで。知りたい分野を選び、少しずつ理解を深めていけます。": "From the basics to future applications, choose the fields you want to explore and deepen your understanding step by step.",
  "🪐 基礎宇宙": "🪐 Space Basics",
  "宇宙を学ぶ最初の一歩。": "The first step in learning about space.",
  "太陽系": "Solar System",
  "惑星": "Planets",
  "月探査": "Lunar Exploration",
  "火星": "Mars",
  "小惑星": "Asteroids",
  "天文学": "Astronomy",
  "🌌 恒星・銀河・宇宙論": "🌌 Stars, Galaxies, and Cosmology",
  "宇宙の広がりと構造を知る。": "Understand the scale and structure of the universe.",
  "恒星": "Stars",
  "星雲": "Nebulae",
  "銀河": "Galaxies",
  "ブラックホール": "Black Holes",
  "宇宙論": "Cosmology",
  "系外惑星": "Exoplanets",
  "宇宙物理": "Astrophysics",
  "🚀 宇宙開発・探査": "🚀 Space Development and Exploration",
  "宇宙へ行くための技術を学ぶ。": "Learn the technologies that make spaceflight possible.",
  "ロケット工学": "Rocket Engineering",
  "再使用ロケット": "Reusable Rockets",
  "宇宙技術": "Space Technology",
  "探査機": "Space Probes",
  "人工衛星": "Satellites",
  "衛星測位": "Satellite Navigation",
  "宇宙望遠鏡": "Space Telescopes",
  "🛰 組織・ミッション": "🛰 Organizations and Missions",
  "世界の宇宙開発と有人宇宙活動。": "Global space development and human spaceflight.",
  "宇宙開発史": "Spaceflight History",
  "宇宙飛行士": "Astronauts",
  "月面基地": "Moon Bases",
  "🔬 未来・応用": "🔬 Future and Applications",
  "宇宙が広げる未来の可能性。": "The future possibilities opened by space.",
  "宇宙AI": "Space AI",
  "宇宙ビジネス": "Space Business",
  "宇宙医学": "Space Medicine",
  "宇宙生命": "Astrobiology",
  "宇宙天気": "Space Weather",
  "知識が、星のようにつながる。": "Knowledge connects like stars.",
  "答える。進む。深める。振り返る。": "Answer. Progress. Deepen. Reflect.",
  "宇宙の知識を、短いクイズで少しずつ深められます。太陽系、惑星、探査、宇宙開発など、幅広いテーマをゲーム感覚で学べます。": "Deepen your space knowledge little by little through short quizzes. Learn a wide range of themes, from the solar system and planets to exploration and space development, with a game-like feel.",
  "学習の進み具合に合わせて銀河が広がり、新しい惑星やエリアが解放されます。知識が増えるほど、自分だけの宇宙が広がっていきます。": "Your galaxy expands as your learning progresses, unlocking new planets and areas. The more you know, the more your own universe grows.",
  "学びの現在地を、美しく見渡す。": "See where your learning stands, beautifully.",
  "学んだ内容を図鑑として振り返れます。惑星、衛星、探査機、宇宙現象などを整理し、知識をあとから確認できます。": "Review what you have learned as a collection. Organize planets, moons, spacecraft, and space phenomena so you can revisit your knowledge anytime.",
  "知識を深める、静かなライブラリ。": "A quiet library for deepening knowledge.",
  "正答率、学習数、XP、進捗をまとめて確認できます。自分の成長が見えることで、学びを続けやすくなります。": "Check your accuracy, learning count, XP, and progress in one place. Seeing your growth makes it easier to keep learning.",
  "成長を、数字ではなく実感へ。": "Turn growth from numbers into a feeling.",
  "よくある質問": "FAQ",
  "宇宙初心者でも使えますか？": "Can beginners use NOVA?",
  "はい。基礎カテゴリと短いクイズから始められます。": "Yes. You can start with basic categories and short quizzes.",
  "どんな分野を学べますか？": "What fields can I learn?",
  "太陽系、銀河、探査、宇宙開発、未来技術まで学べます。": "You can learn about the solar system, galaxies, exploration, space development, and future technologies.",
  "料金はかかりますか？": "Will NOVA cost money?",
  "料金は公開時にApp Storeでお知らせします。": "Pricing will be announced on the App Store when NOVA is released.",
  "いつ公開されますか？": "When will NOVA be released?",
  "現在準備中です。公開日は決まり次第お知らせします。": "NOVA is currently in preparation. The release date will be announced once it is decided.",
  "公開後も、NOVAの宇宙は広がり続けます。": "Even after launch, NOVA's universe will continue to expand.",
  "宇宙への旅を、NOVAから。": "Begin your space journey.",
  "閉じる": "Close"
};
const translatableAttributes = ["aria-label", "data-subtitle", "data-description"];

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function smoothRange(value, start, end) {
  const progress = Math.min(Math.max((value - start) / Math.max(end - start, 0.001), 0), 1);
  return progress * progress * (3 - 2 * progress);
}

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(languageStorageKey) === "en" ? "en" : "ja";
  } catch {
    return "ja";
  }
}

function storeLanguage(language) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // Ignore storage failures; the in-page language switch still works.
  }
}

function collectLocalizedText() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style")) return NodeFilter.FILTER_REJECT;

        const key = node.nodeValue.trim();
        return textTranslations[key] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue;
    const key = value.trim();
    localizedTextNodes.push({
      node,
      ja: key,
      en: textTranslations[key],
      prefix: value.match(/^\s*/)[0],
      suffix: value.match(/\s*$/)[0]
    });
  }
}

function collectLocalizedAttributes() {
  document.querySelectorAll("*").forEach((element) => {
    translatableAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value && textTranslations[value]) {
        localizedAttributes.push({
          element,
          attribute,
          ja: value,
          en: textTranslations[value]
        });
      }
    });
  });
}

function updateLanguageButtons(language) {
  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const isActive = button.dataset.languageOption === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateLightboxTriggerLabels() {
  const isEnglish = document.documentElement.lang.startsWith("en");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    const title = trigger.dataset.title || "NOVA screenshot";
    trigger.setAttribute("aria-label", isEnglish ? `Open ${title} screenshot` : `${title}のスクリーンショットを拡大表示`);
  });
}

function setLanguage(language, shouldStore = true) {
  const activeLanguage = language === "en" ? "en" : "ja";
  const copy = pageCopy[activeLanguage];
  document.documentElement.lang = activeLanguage;
  document.title = copy.title;

  const descriptionMeta = document.querySelector("meta[name='description']");
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", copy.description);
  }

  localizedTextNodes.forEach(({ node, ja, en, prefix, suffix }) => {
    node.nodeValue = `${prefix}${activeLanguage === "en" ? en : ja}${suffix}`;
  });

  localizedAttributes.forEach(({ element, attribute, ja, en }) => {
    element.setAttribute(attribute, activeLanguage === "en" ? en : ja);
  });

  updateLanguageButtons(activeLanguage);
  updateLightboxTriggerLabels();

  if (shouldStore) {
    storeLanguage(activeLanguage);
  }
}

function initializeLanguageToggle() {
  collectLocalizedText();
  collectLocalizedAttributes();
  setLanguage(getStoredLanguage(), false);

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.languageOption);
    });
  });
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
const touchAnchorGesture = {
  pointerId: null,
  startX: 0,
  startY: 0,
  moved: false
};
const touchAnchorCancelDistance = 12;

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
  document.querySelectorAll("[data-image$='GalaxyView-660.jpg']").forEach((target) => {
    target.classList.add("galaxy-motion");
  });
}

function setupLightboxTriggers() {
  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");
  });
  updateLightboxTriggerLabels();
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

function trackTouchAnchorStart(event) {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
  if (!event.target.closest("a[href^='#']")) return;

  touchAnchorGesture.pointerId = event.pointerId;
  touchAnchorGesture.startX = event.clientX;
  touchAnchorGesture.startY = event.clientY;
  touchAnchorGesture.moved = false;
}

function trackTouchAnchorMove(event) {
  if (event.pointerId !== touchAnchorGesture.pointerId) return;

  const deltaX = event.clientX - touchAnchorGesture.startX;
  const deltaY = event.clientY - touchAnchorGesture.startY;
  if (Math.hypot(deltaX, deltaY) > touchAnchorCancelDistance) {
    touchAnchorGesture.moved = true;
  }
}

function resetTouchAnchorGesture(event) {
  if (event.pointerId !== touchAnchorGesture.pointerId) return;

  touchAnchorGesture.pointerId = null;
  touchAnchorGesture.startX = 0;
  touchAnchorGesture.startY = 0;
}

function shouldIgnoreTouchAnchorClick(target) {
  return Boolean(target.closest("a[href^='#']") && touchAnchorGesture.moved);
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
document.addEventListener("pointerdown", trackTouchAnchorStart, { passive: true });
document.addEventListener("pointermove", trackTouchAnchorMove, { passive: true });
document.addEventListener("pointercancel", resetTouchAnchorGesture, { passive: true });
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
  if (shouldIgnoreTouchAnchorClick(event.target)) {
    event.preventDefault();
    resetTouchAnchorGesture({ pointerId: touchAnchorGesture.pointerId });
    return;
  }

  resetTouchAnchorGesture({ pointerId: touchAnchorGesture.pointerId });

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
initializeLanguageToggle();
updateHeader();
updateActiveNav();
updateParallax();
window.requestAnimationFrame(() => {
  scheduleIdleWork(initializeDeferredFeatures);
});
