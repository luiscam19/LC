const steps = {
  briefing: {
    number: "STEP 1 OF 5",
    title: "Review the weekly briefing",
    description: "Read the assignment, identify the required concepts, and list any questions before beginning.",
    evidence: "A short checklist of requirements and questions."
  },
  plan: {
    number: "STEP 2 OF 5",
    title: "Create a simple plan",
    description: "Choose the project idea, divide it into smaller tasks, and connect each task to a course concept.",
    evidence: "A short project goal and task list."
  },
  build: {
    number: "STEP 3 OF 5",
    title: "Build and test the assignment",
    description: "Write the code in stages, test each change, and ask focused questions when something does not work.",
    evidence: "Git commits, screenshots, code, and troubleshooting notes."
  },
  evidence: {
    number: "STEP 4 OF 5",
    title: "Explain the work",
    description: "Describe what was created, what concepts were used, what problems came up, and how they were solved.",
    evidence: "A completed Action Record and short reflection."
  },
  submit: {
    number: "STEP 5 OF 5",
    title: "Submit and verify",
    description: "Turn in the repository link and required documents, then respond to instructor feedback or questions.",
    evidence: "Canvas submission, working link, and instructor verification if requested."
  }
};

const buttons = document.querySelectorAll(".step-button");
const number = document.querySelector("#step-number");
const title = document.querySelector("#step-title");
const description = document.querySelector("#step-description");
const evidence = document.querySelector("#step-evidence");
const stepDisplay = document.querySelector(".step-display");
const scrollProgress = document.querySelector("#scroll-progress");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedStep = steps[button.dataset.step];

    buttons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    stepDisplay.classList.add("changing");

    window.setTimeout(() => {
      number.textContent = selectedStep.number;
      title.textContent = selectedStep.title;
      description.textContent = selectedStep.description;
      evidence.textContent = selectedStep.evidence;
      stepDisplay.classList.remove("changing");
    }, 160);
  });
});

const revealItems = document.querySelectorAll(
  ".section-heading, .stage-card, .workflow-list li, .evidence-grid article, .tech-visual, .model-copy, .model-frame, .step-buttons, .step-display, .closing"
);

revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("scroll", () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}, { passive: true });
