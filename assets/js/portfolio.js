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
