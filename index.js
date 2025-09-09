// Burger
const burgerToggle = document.getElementById("burger");
const navMenu = document.getElementById("nav");
const body = document.body;

burgerToggle.addEventListener("click", () => {
  burgerToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  body.classList.toggle("no-scroll");
});

// Burger/

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
  const tabs = document.querySelectorAll(".gallery__tab");
  const cardSection = document.querySelectorAll(".gallery__cards");

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

// Player
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("customVideo");
  const playPause = document.getElementById("playPause");
  const muteUnmute = document.getElementById("muteUnmute");
  const seekBar = document.getElementById("seekBar");
  const volumeBar = document.getElementById("volumeBar");
  const timeDisplay = document.getElementById("timeDisplay");

  let rafId;
  let lastVolume = 1;
  let fadeId;

  seekBar.step = "any";

  // --- Вспом. формат времени (снаружи, чтобы юзать в тултипе) ---
  function formatTime(t) {
    if (!isFinite(t) || isNaN(t)) return "0:00";
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  // --- Time Display ---
  function updateTimeDisplay() {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(
      video.duration
    )}`;
  }

  // --- Play / Pause ---
  playPause.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playPause.innerHTML =
        '<img src="assets/main/pause_white.svg" alt="Pause" width="15"/>';
      updateSeekSmooth();
    } else {
      video.pause();
      playPause.innerHTML =
        '<img src="assets/main/play_white.svg" alt="Play" width="14"/>';
      cancelAnimationFrame(rafId);
    }
  });

  video.addEventListener("ended", () => {
    cancelAnimationFrame(rafId);
    playPause.innerHTML =
      '<img src="assets/main/play_white.svg" alt="Play" width="14"/>';
    updateTimeDisplay();
  });

  // --- Seek (плавное обновление) ---
  function updateSeekSmooth() {
    if (isFinite(video.duration)) {
      seekBar.max = video.duration;
    }
    seekBar.value = video.currentTime;
    updateTimeDisplay();

    if (!video.paused) {
      rafId = requestAnimationFrame(updateSeekSmooth);
    }
  }

  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration)) {
      seekBar.max = video.duration;
    }
    updateTimeDisplay();
  });

  seekBar.addEventListener("input", () => {
    const t = Number(seekBar.value);
    if (!isNaN(t)) {
      video.currentTime = t;
    }
    updateTimeDisplay();
  });

  // --- Volume ---
  volumeBar.addEventListener("input", () => {
    cancelAnimationFrame(fadeId);
    const vol = volumeBar.value / 100;
    video.volume = vol;
    video.muted = vol === 0;

    if (video.muted) {
      muteUnmute.innerHTML = '<img src="assets/main/mute.svg" width="18"/>';
    } else {
      muteUnmute.innerHTML = '<img src="assets/main/unmute.svg" width="18"/>';
      lastVolume = vol;
    }
  });

  muteUnmute.addEventListener("click", () => {
    cancelAnimationFrame(fadeId);

    if (video.muted || video.volume === 0) {
      const targetVolume = lastVolume || 1;
      fadeVolume(video.volume, targetVolume, 300, () => {
        video.volume = targetVolume;
        video.muted = false;
        volumeBar.value = Math.round(targetVolume * 100);
      });
      muteUnmute.innerHTML = '<img src="assets/main/unmute.svg" width="18"/>';
    } else {
      lastVolume = video.volume;
      fadeVolume(video.volume, 0, 300, () => {
        video.volume = 0;
        video.muted = true;
        volumeBar.value = 0;
      });
      muteUnmute.innerHTML = '<img src="assets/main/mute.svg" width="18"/>';
    }
  });

  function fadeVolume(from, to, duration, callback) {
    cancelAnimationFrame(fadeId);
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const newVolume = from + (to - from) * progress;

      video.volume = newVolume;
      volumeBar.value = Math.round(newVolume * 100);

      if (progress < 1) {
        fadeId = requestAnimationFrame(step);
      } else if (callback) {
        callback();
      }
    }

    fadeId = requestAnimationFrame(step);
  }
});

// Slider
const sliderData = [
  {
    id: 0,
    title: "ЧТО НЕОБХОДИМО ВЗЯТЬ С<br>СОБОЙ НА СЕРФ ТУР",
    subtitle: "ТОП 20 необходимых вещей для комфортного отдыха и обучения",
    background: "assets/main/bg_slider.png",
  },
  {
    id: 1,
    title: "ТОП 20",
    subtitle: "ТОП 20 необходимых вещей для комфортного отдыха и обучения",
    background: "assets/main/bg_slider.png",
  },
];

const slider = document.getElementById("slider");

sliderData.forEach((slide, indx) => {
  let slideHTML = `
    <div class="slide ${indx === 0 ? "active" : ""}" 
        style="background-image: url(${slide.background})">
      <div class="slider__header">
        <h2 class="slider__title">${slide.title}</h2>
        <p class="slider__subtitle">${slide.subtitle}</p>
      </div>
    </div>`;

  slider.insertAdjacentHTML("beforeend", slideHTML);
});

const pagination = document.createElement("div");
pagination.classList.add("pagination");
slider.appendChild(pagination);

const slides = document.querySelectorAll(".slide");

slides.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.dataset.index = index;
  pagination.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
  dots.forEach((el, idx) => {
    el.classList.toggle("active", idx === index);
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    currentSlide = parseInt(dot.dataset.index);
    showSlide(currentSlide);
  });
});

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);
// Slider/

// Form
const form = document.querySelector(".form__body");
const inputs = form.querySelectorAll(".form__input");

form.addEventListener("submit", (e) => {
  let valid = true;

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("form__input--error");
      valid = false;
    } else {
      input.classList.remove("form__input--error");
    }
  });
  if (!valid) {
    e.preventDefault();
  }
});
