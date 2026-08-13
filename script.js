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

const workflowData = {
  observe: {
    number: '01',
    title: 'Freeze the state around failure.',
    description: 'Capture stack frames, tensor summaries, allocator state, recent metrics, Git changes, environment drift, and the last successful step.',
    tags: ['CUDA state', 'tensor shapes', 'Git diff', 'stdout'],
  },
  hypothesize: {
    number: '02',
    title: 'Rank causes against real evidence.',
    description: 'A local Ollama agent receives structured tools and evidence IDs, then returns ranked hypotheses instead of an ungrounded diagnosis.',
    tags: ['structured output', 'evidence IDs', 'confidence', 'local LLM'],
  },
  intervene: {
    number: '03',
    title: 'Create the smallest safe experiment.',
    description: 'The policy engine validates each proposed configuration or code patch, creates an isolated trial, and enforces hard resource limits.',
    tags: ['worktree', 'container', 'allowlist', 'budget'],
  },
  evaluate: {
    number: '04',
    title: 'Let deterministic checks decide.',
    description: 'Metrics, constraints, failure assertions, and performance tests determine whether the intervention succeeded—not the agent’s opinion.',
    tags: ['objective', 'constraints', 'tests', 'verdict'],
  },
  remember: {
    number: '05',
    title: 'Turn outcomes into resolution memory.',
    description: 'Store the signature, hypothesis, action, and measured result so future runs can begin with fixes that survived real experiments.',
    tags: ['verified fix', 'resolution graph', 'history', 'reuse'],
  },
};

const workflowTabs = document.querySelectorAll('[data-workflow-tab]');
const stageId = document.querySelector('[data-stage-id]');
const stageNumber = document.querySelector('[data-stage-number]');
const stageTitle = document.querySelector('[data-stage-title]');
const stageDescription = document.querySelector('[data-stage-description]');
const stageTags = document.querySelector('[data-stage-tags]');

workflowTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.workflowTab;
    const item = workflowData[key];
    if (!item) return;

    workflowTabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-selected', String(active));
    });

    stageId.textContent = key;
    stageNumber.textContent = item.number;
    stageTitle.textContent = item.title;
    stageDescription.textContent = item.description;
    stageTags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join('');
  });
});

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
    score: '0.887',
    rows: [
      ['Observed', 'CUDA OOM at step 417.'],
      ['Captured', 'Allocator snapshot and tensor shapes.'],
      ['Comparing', 'Searching nearest successful run.'],
    ],
  },
  {
    score: '0.906',
    rows: [
      ['Diagnosed', 'Activation memory growth likely.'],
      ['Proposed', 'Lower batch + enable bf16.'],
      ['Running', 'Probe trial 04 of 08.'],
    ],
  },
  {
    score: '0.928',
    rows: [
      ['Verified', 'OOM signature resolved.'],
      ['Measured', 'Throughput improved by 18%.'],
      ['Completed', 'Campaign objective satisfied.'],
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
