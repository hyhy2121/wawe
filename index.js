const burgerToggle = document.querySelector(".burger");
const navMenu = document.querySelector(".nav");
const body = document.body;
const tabToggle = document.querySelectorAll(".tab");

burgerToggle.addEventListener("click", () => {
  burgerToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  body.classList.toggle("no-scroll");
});

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".hidden");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.remove("hidden");
        el.classList.add("animate");
        obs.unobserve(el);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0,
    }
  );

  items.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const cardSection = document.querySelectorAll(".cards");

  function switchTab(selected) {
    tabs.forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === selected);
    });

    cardSection.forEach((section) => {
      section.classList.toggle(
        "active",
        section.dataset.category === selected || selected === "all"
      );
    });
  }

  switchTab("tourists");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const selected = tab.dataset.tab;
      switchTab(selected);
    });
  });
});
