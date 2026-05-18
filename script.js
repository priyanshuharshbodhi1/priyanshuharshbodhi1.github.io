const header = document.querySelector(".site-header");
const meter = document.querySelector(".scroll-meter");
const heroImage = document.querySelector(".hero-image");
const revealItems = document.querySelectorAll(".reveal");
const consoleSteps = document.querySelectorAll(".console-step");
const form = document.querySelector("#lead-form");
const note = document.querySelector("#form-note");
let consoleIndex = 0;
let ticking = false;

const updateScrollState = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  const heroShift = Math.min(window.scrollY * 0.08, 34);

  meter.style.width = `${progress}%`;
  document.documentElement.style.setProperty("--scroll-progress", `${progress / 100}`);
  header.classList.toggle("is-solid", window.scrollY > 80);

  if (heroImage) {
    heroImage.style.transform = `scale(1.01) translate3d(0, ${heroShift}px, 0)`;
  }
};

const requestScrollUpdate = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    ticking = false;
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
  observer.observe(item);
});

const cycleConsole = () => {
  if (!consoleSteps.length) return;

  consoleSteps.forEach((step) => step.classList.remove("is-active"));
  consoleSteps[consoleIndex % consoleSteps.length].classList.add("is-active");
  consoleIndex += 1;
};

cycleConsole();
setInterval(cycleConsole, 1800);

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
updateScrollState();

if (form && note) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const business = data.get("business").trim();
    const location = data.get("location").trim();
    const action = data.get("action");
    const notes = data.get("notes").trim();

    const subject = encodeURIComponent(`Dreamsite platform setup for ${business}`);
    const body = encodeURIComponent(
      [
        "Hi Dreamsite.me,",
        "",
        "I would like to configure Dreamsite for this business.",
        "",
        `Business type: ${business}`,
        `City or area: ${location}`,
        `Main customer action: ${action}`,
        `Notes: ${notes || "No notes yet."}`,
        "",
        "Please prepare the platform setup outline."
      ].join("\n")
    );

    note.textContent = "Opening your email app with the platform brief.";
    window.location.href = `mailto:priyanshu@dreamsite.me?subject=${subject}&body=${body}`;
  });
}
