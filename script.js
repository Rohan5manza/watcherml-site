const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const setHeaderState = () => {
  header?.classList.toggle('scrolled', window.scrollY > 16);
};
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const codeTabs = document.querySelectorAll('[data-code-tab]');
const codePanels = document.querySelectorAll('[data-code-panel]');
const copyButton = document.querySelector('[data-copy-code]');

codeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.codeTab;
    codeTabs.forEach((candidate) => candidate.classList.toggle('active', candidate === tab));
    codePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.codePanel === selected));
    if (copyButton) copyButton.textContent = 'Copy';
  });
});

copyButton?.addEventListener('click', async () => {
  const activePanel = document.querySelector('[data-code-panel].active');
  if (!activePanel) return;

  try {
    await navigator.clipboard.writeText(activePanel.innerText);
    copyButton.textContent = 'Copied';
  } catch {
    copyButton.textContent = 'Select code';
  }

  window.setTimeout(() => {
    copyButton.textContent = 'Copy';
  }, 1600);
});

const agentStates = [
  {
    score: '0.442',
    rows: [
      ['Captured', 'CUDA OOM capsule v1.0.'],
      ['Sealed', 'Contract and six-trial budget.'],
      ['Planned', 'Automatic typed interventions.'],
    ],
  },
  {
    score: '0.428',
    rows: [
      ['Rejected', 'Unchanged batch still OOM.'],
      ['Survived', 'Batch 16 reached probe limit.'],
      ['Completed', 'Full trial within metric guard.'],
    ],
  },
  {
    score: '0.421',
    rows: [
      ['Confirmed', 'Independent run 1 passed.'],
      ['Confirmed', 'Independent run 2 passed.'],
      ['Verified', 'Recovery contract satisfied.'],
    ],
  },
];

let stateIndex = 0;
const agentLog = document.querySelector('[data-agent-log]');
const objectiveScore = document.querySelector('[data-objective-score]');

const renderAgentState = () => {
  if (!agentLog || !objectiveScore) return;
  const state = agentStates[stateIndex];
  objectiveScore.textContent = state.score;
  agentLog.innerHTML = state.rows
    .map(
      ([verb, text], index) => `
        <div class="log-row ${index === state.rows.length - 1 ? 'active' : ''}">
          <span class="log-time">0${index + 1}</span>
          <p><b>${verb}</b> ${text}</p>
        </div>`
    )
    .join('');
  stateIndex = (stateIndex + 1) % agentStates.length;
};

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(renderAgentState, 3600);
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

(() => {
  const carousel = document.querySelector("[data-oom-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-oom-track]");
  const viewport = carousel.querySelector("[data-oom-viewport]");
  const slides = [...carousel.querySelectorAll(".oom-carousel-slide")];
  const dots = [...carousel.querySelectorAll("[data-oom-dot]")];
  const previousButton = carousel.querySelector("[data-oom-prev]");
  const nextButton = carousel.querySelector("[data-oom-next]");
  const counter = carousel.querySelector("[data-oom-counter]");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let autoplayTimer = null;
  let pointerStartX = null;

  function render() {
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

    slides.forEach((slide, index) => {
      slide.setAttribute(
        "aria-hidden",
        index === currentIndex ? "false" : "true"
      );
    });

    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", String(active));
    });

    counter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ` +
      `${String(slides.length).padStart(2, "0")}`;
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    render();
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (reduceMotion.matches || document.hidden) return;

    autoplayTimer = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5500);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    restartAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.oomDot));
      restartAutoplay();
    });
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1);
      restartAutoplay();
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) return;

    pointerStartX = event.clientX;
    viewport.setPointerCapture?.(event.pointerId);
    stopAutoplay();
  });

  viewport.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;

    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) > 45) {
      showSlide(
        distance < 0
          ? currentIndex + 1
          : currentIndex - 1
      );
    }

    startAutoplay();
  });

  viewport.addEventListener("pointercancel", () => {
    pointerStartX = null;
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);

  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  reduceMotion.addEventListener?.("change", startAutoplay);

  render();
  startAutoplay();
})();

(() => {
  const carousel = document.querySelector("[data-value-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-value-track]");
  const viewport = carousel.querySelector("[data-value-viewport]");
  const slides = [...carousel.querySelectorAll(".value-slide")];
  const dots = [...carousel.querySelectorAll("[data-value-dot]")];
  const previousButton = carousel.querySelector("[data-value-prev]");
  const nextButton = carousel.querySelector("[data-value-next]");
  const counter = carousel.querySelector("[data-value-counter]");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let autoplayTimer = null;
  let pointerStartX = null;

  function render() {
    track.style.transform =
      `translate3d(-${currentIndex * 100}%, 0, 0)`;

    slides.forEach((slide, index) => {
      slide.setAttribute(
        "aria-hidden",
        index === currentIndex ? "false" : "true"
      );
    });

    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", String(active));
    });

    counter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ` +
      `${String(slides.length).padStart(2, "0")}`;
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    render();
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (reduceMotion.matches || document.hidden) return;

    autoplayTimer = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 7000);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  previousButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
    restartAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.valueDot));
      restartAutoplay();
    });
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1);
      restartAutoplay();
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary) return;

    pointerStartX = event.clientX;
    viewport.setPointerCapture?.(event.pointerId);
    stopAutoplay();
  });

  viewport.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;

    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) > 45) {
      showSlide(
        distance < 0
          ? currentIndex + 1
          : currentIndex - 1
      );
    }

    startAutoplay();
  });

  viewport.addEventListener("pointercancel", () => {
    pointerStartX = null;
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);

  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  reduceMotion.addEventListener?.("change", startAutoplay);

  render();
  startAutoplay();
})();
