const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav?.querySelectorAll("a") ?? [];
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-year]");
const story = document.querySelector("[data-scroll-scene]");
const storySteps = story?.querySelectorAll("[data-story-step]") ?? [];
const storyLabel = story?.querySelector("[data-story-label]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const colorScheme = window.matchMedia("(prefers-color-scheme: light)");
const themeStorageKey = "yeshil-portfolio-theme";
const themeMeta = document.querySelector('meta[name="theme-color"]');

const getStoredTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  } catch {
    return null;
  }
};

const applyTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  themeMeta?.setAttribute(
    "content",
    theme === "light" ? "#f7f8f6" : "#07090d",
  );

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = themeToggle?.querySelector("[data-theme-icon]");
  const themeLabel = themeToggle?.querySelector("[data-theme-label]");
  const nextTheme = theme === "light" ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
  }
  if (themeIcon) themeIcon.textContent = theme === "light" ? "☾" : "☼";
  if (themeLabel) {
    themeLabel.textContent = theme === "light" ? "Dark" : "Light";
  }

  if (persist) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // The selected theme still applies when browser storage is unavailable.
    }
  }
};

const initialTheme =
  getStoredTheme() ?? (colorScheme.matches ? "light" : "dark");
applyTheme(initialTheme);

if (nav) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.dataset.themeToggle = "";
  themeToggle.innerHTML =
    '<span data-theme-icon aria-hidden="true"></span><span data-theme-label></span>';

  const navCta = nav.querySelector(".nav-cta");
  nav.insertBefore(themeToggle, navCta);
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(nextTheme, true);
  });
}

colorScheme.addEventListener?.("change", (event) => {
  if (!getStoredTheme()) applyTheme(event.matches ? "light" : "dark");
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeNavigation = () => {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (year) year.textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (story && storySteps.length > 0 && !reduceMotion.matches) {
  const labels = ["DISCOVER", "ENGINEER", "ACTIVATE", "COMPOUND"];
  let frameRequested = false;

  const updateStory = () => {
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    const stage = Math.min(
      Math.floor(progress * storySteps.length),
      storySteps.length - 1,
    );

    story.style.setProperty("--story-progress", progress.toFixed(3));
    story.style.setProperty("--story-stage", String(stage));

    storySteps.forEach((step, index) => {
      step.classList.toggle("is-current", index === stage);
    });

    if (storyLabel) storyLabel.textContent = labels[stage];
    frameRequested = false;
  };

  const requestStoryUpdate = () => {
    if (!frameRequested) {
      window.requestAnimationFrame(updateStory);
      frameRequested = true;
    }
  };

  window.addEventListener("scroll", requestStoryUpdate, { passive: true });
  window.addEventListener("resize", requestStoryUpdate);
  updateStory();
}
