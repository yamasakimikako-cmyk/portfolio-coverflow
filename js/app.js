const projects = window.PROJECTS || [];
let currentIndex = 0;
let isAnimating = false;
let animationDirection = "forward";

const coverflow = document.getElementById("coverflow");
const activeCover = document.getElementById("activeCover");
const leftCover = document.getElementById("leftCover");
const rightCover = document.getElementById("rightCover");
const desktopNav = document.getElementById("desktopNav");
const mobileNav = document.getElementById("mobileNav");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const infoToggle = document.getElementById("infoToggle");
const profilePanel = document.getElementById("profilePanel");

let touchStartX = 0;
let touchStartY = 0;

function getWrappedIndex(index) {
  if (!projects.length) return 0;
  return (index + projects.length) % projects.length;
}

function preload(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function preloadNeighbors() {
  preload(projects[getWrappedIndex(currentIndex + 1)]?.cover);
  preload(projects[getWrappedIndex(currentIndex - 1)]?.cover);
  preload(projects[getWrappedIndex(currentIndex + 2)]?.cover);
  preload(projects[getWrappedIndex(currentIndex - 2)]?.cover);
}

function renderNav(container) {
  if (!container) return;
  container.innerHTML = "";

  projects.forEach((project, index) => {
    const item = document.createElement("span");
    item.className = "nav-item" + (index === currentIndex ? " active" : "");
    item.textContent = project.title;

    item.addEventListener("click", () => {
      if (isAnimating || index === currentIndex) return;
      goTo(index, index > currentIndex ? "forward" : "backward");
    });

    container.appendChild(item);
  });
}

function renderCovers() {
  if (!projects.length) return;

  const current = projects[currentIndex];
  const left = projects[getWrappedIndex(currentIndex - 1)];
  const right = projects[getWrappedIndex(currentIndex + 1)];

  if (activeCover) {
    activeCover.innerHTML = `<img src="${current.cover}" alt="${current.title}" loading="eager">`;
    activeCover.onclick = () => {
      window.location.href = `project.html?slug=${encodeURIComponent(current.slug)}`;
    };
  }

  if (leftCover) {
    leftCover.innerHTML = `<img src="${left.cover}" alt="${left.title}" loading="lazy">`;
    leftCover.onclick = () => {
      if (!isAnimating) goTo(currentIndex - 1, "backward");
    };
  }

  if (rightCover) {
    rightCover.innerHTML = `<img src="${right.cover}" alt="${right.title}" loading="lazy">`;
    rightCover.onclick = () => {
      if (!isAnimating) goTo(currentIndex + 1, "forward");
    };
  }
}

function syncMobileNav() {
  if (!mobileNav) return;
  const activeItem = mobileNav.querySelector(".nav-item.active");
  if (!activeItem) return;

  activeItem.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

function render() {
  if (!projects.length) return;

  renderCovers();
  renderNav(desktopNav);
  renderNav(mobileNav);

  requestAnimationFrame(() => {
    syncMobileNav();
  });

  preloadNeighbors();
}

function setAnimatingState(direction) {
  if (!coverflow) return;

  coverflow.classList.remove("forward", "backward");
  coverflow.classList.add("is-animating");
  coverflow.classList.add(direction);
}

function clearAnimatingState() {
  if (!coverflow) return;
  coverflow.classList.remove("is-animating", "forward", "backward");
}

function goTo(index, direction = "forward") {
  if (isAnimating || !projects.length) return;

  isAnimating = true;
  animationDirection = direction;
  setAnimatingState(animationDirection);

  window.setTimeout(() => {
    currentIndex = getWrappedIndex(index);
    render();
  }, 70);

  window.setTimeout(() => {
    clearAnimatingState();
    isAnimating = false;
  }, 900);
}

prevBtn?.addEventListener("click", () => {
  goTo(currentIndex - 1, "backward");
});

nextBtn?.addEventListener("click", () => {
  goTo(currentIndex + 1, "forward");
});

infoToggle?.addEventListener("click", () => {
  if (!profilePanel) return;
  profilePanel.classList.toggle("open");
  infoToggle.textContent = profilePanel.classList.contains("open") ? "CLOSE" : "INFO";
});

document.addEventListener(
  "touchstart",
  (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    if (!e.changedTouches || !e.changedTouches.length || isAnimating) return;

    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;

    const deltaX = endX - touchStartX;
    const deltaY = endY - touchStartY;

    if (Math.abs(deltaX) < 38) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < 0) {
      goTo(currentIndex + 1, "forward");
    } else {
      goTo(currentIndex - 1, "backward");
    }
  },
  { passive: true }
);

document.addEventListener("keydown", (e) => {
  if (isAnimating) return;

  if (e.key === "ArrowLeft") {
    goTo(currentIndex - 1, "backward");
  }

  if (e.key === "ArrowRight") {
    goTo(currentIndex + 1, "forward");
  }

  if (e.key === "Enter" && projects[currentIndex]) {
    window.location.href = `project.html?slug=${encodeURIComponent(projects[currentIndex].slug)}`;
  }
});

render();
