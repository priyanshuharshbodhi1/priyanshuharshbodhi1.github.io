const header = document.querySelector(".site-header");
const meter = document.querySelector(".scroll-meter");
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("#lead-form");
const note = document.querySelector("#form-note");

const updateScrollState = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;

  meter.style.width = `${progress}%`;
  header.classList.toggle("is-solid", window.scrollY > 80);
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

revealItems.forEach((item) => observer.observe(item));
window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const business = data.get("business").trim();
  const location = data.get("location").trim();
  const action = data.get("action");
  const notes = data.get("notes").trim();

  const subject = encodeURIComponent(`Dreamsite plan for ${business}`);
  const body = encodeURIComponent(
    [
      "Hi Dreamsite.me,",
      "",
      "I would like a first site plan.",
      "",
      `Business type: ${business}`,
      `City or area: ${location}`,
      `Main customer action: ${action}`,
      `Notes: ${notes || "No notes yet."}`,
      "",
      "Please send me a practical launch outline."
    ].join("\n")
  );

  note.textContent = "Opening your email app with the site brief.";
  window.location.href = `mailto:hello@dreamsite.me?subject=${subject}&body=${body}`;
});
