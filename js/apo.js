const projects = window.PROJECTS || [];
let currentIndex = 0;
let isAnimating = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const activeCover = document.getElementById("activeCover");
const leftCover = document.getElementById("leftCover");
const rightCover = document.getElementById("rightCover");
const desktopNav = document.getElementById("desktopNav");
const mobileNav = document.getElementById("mobileNav");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const infoToggle = document.getElementById("infoToggle");
const profilePanel = document.getElementById("profilePanel");

function getWrappedIndex(index) {
  if (!projects.length) return 0;
  return (index + projects.length) % projects.length;
}

function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function preloadNeighbors() {
  if (!projects.length) return;
  preloadImage(projects[getWrappedIndex(currentIndex + 1)]?.cover);
  preloadImage(projects[getWrappedIndex(currentIndex - 1)]?.cover);
  preloadImage(projects[getWrappedIndex(currentIndex + 2)]?.cover);
  preloadImage(projects[getWrappedIndex(currentIndex - 2)]?.cover);
}

function scrollActiveMobileNavIntoView() {
  if (!mobileNav) return;
  const activeItem = mobileNav.querySelector(".nav-item.active");
  if (!activeItem) return;

  activeItem.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

function renderNav(container) {
  if (!container) return;
  container.innerHTML = "";

  projects.forEach((project, index) => {
    const item = document.createElement("span");
    item.className = "nav-item";
    if (index === currentIndex) item.classList.add("active");
    item.textContent = project.title;

    item.addEventListener("click", () => {
      if (index === currentIndex || isAnimating) return;
      animateTo(index);
    });

    container.appendChild(item);
  });
}

function renderCovers() {
  if (!projects.length) return;

  const current = projects[currentIndex];
  const left = projects[getWrappedIndex(currentIndex - 1)];
  const right = projects[getWrappedIndex(currentIndex + 1)];

  activeCover.innerHTML = `<img src="${current.cover}" alt="${current.title}" loading="eager">`;
  leftCover.innerHTML = `<img src="${left.cover}" alt="${left.title}" loading="lazy">`;
  rightCover.innerHTML = `<img src="${right.cover}" alt="${right.title}" loading="lazy">`;

  activeCover.onclick = () => {
    window.location.href = `project.html?slug=${encodeURIComponent(current.slug)}`;
  };

  leftCover.onclick = () => {
    if (!isAnimating) animateTo(currentIndex - 1);
  };

  rightCover.onclick = () => {
    if (!isAnimating) animateTo(currentIndex + 1);
  };
}

function render() {
  if (!projects.length) return;

  renderCovers();
  renderNav(desktopNav);
  renderNav(mobileNav);

  requestAnimationFrame(() => {
    scrollActiveMobileNavIntoView();
  });

  preloadNeighbors();
}

function animateTo(nextIndex) {
  if (isAnimating || !projects.length) return;

  isAnimating = true;
  currentIndex = getWrappedIndex(nextIndex);
  render();

  window.setTimeout(() => {
    isAnimating = false;
  }, 760);
}

prevBtn?.addEventListener("click", () => {
  animateTo(currentIndex - 1);
});

nextBtn?.addEventListener("click", () => {
  animateTo(currentIndex + 1);
});

infoToggle?.addEventListener("click", () => {
  profilePanel.classList.toggle("open");
  const opened = profilePanel.classList.contains("open");
  infoToggle.textContent = opened ? "CLOSE" : "INFO";
});

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) < 42) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (isAnimating) return;

    if (deltaX < 0) {
      animateTo(currentIndex + 1);
    } else {
      animateTo(currentIndex - 1);
    }
  },
  { passive: true }
);

document.addEventListener("keydown", (e) => {
  if (isAnimating) return;

  if (e.key === "ArrowLeft") {
    animateTo(currentIndex - 1);
  }

  if (e.key === "ArrowRight") {
    animateTo(currentIndex + 1);
  }

  if (e.key === "Enter") {
    const current = projects[currentIndex];
    if (current) {
      window.location.href = `project.html?slug=${encodeURIComponent(current.slug)}`;
    }
  }
});

render();
