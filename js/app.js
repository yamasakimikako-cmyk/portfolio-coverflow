const projects = window.PROJECTS || [];
let currentIndex = 0;
let isAnimating = false;

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

function preload(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
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
      goTo(index);
    });

    container.appendChild(item);
  });
}

function render() {
  if (!projects.length) return;

  const current = projects[currentIndex];
  const left = projects[getWrappedIndex(currentIndex - 1)];
  const right = projects[getWrappedIndex(currentIndex + 1)];

  if (activeCover) {
    activeCover.innerHTML = `<img src="${current.cover}" alt="${current.title}">`;
    activeCover.onclick = () => {
      window.location.href = `project.html?slug=${encodeURIComponent(current.slug)}`;
    };
  }

  if (leftCover) {
    leftCover.innerHTML = `<img src="${left.cover}" alt="${left.title}">`;
    leftCover.onclick = () => {
      if (!isAnimating) goTo(currentIndex - 1);
    };
  }

  if (rightCover) {
    rightCover.innerHTML = `<img src="${right.cover}" alt="${right.title}">`;
    rightCover.onclick = () => {
      if (!isAnimating) goTo(currentIndex + 1);
    };
  }

  renderNav(desktopNav);
  renderNav(mobileNav);

  preload(projects[getWrappedIndex(currentIndex + 1)]?.cover);
  preload(projects[getWrappedIndex(currentIndex - 1)]?.cover);

  const activeMobileItem = mobileNav?.querySelector(".nav-item.active");
  if (activeMobileItem) {
    activeMobileItem.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }
}

function goTo(index) {
  if (isAnimating || !projects.length) return;

  isAnimating = true;
  currentIndex = getWrappedIndex(index);
  render();

  setTimeout(() => {
    isAnimating = false;
  }, 650);
}

prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

infoToggle?.addEventListener("click", () => {
  if (!profilePanel) return;
  profilePanel.classList.toggle("open");
  if (infoToggle) {
    infoToggle.textContent = profilePanel.classList.contains("open") ? "CLOSE" : "INFO";
  }
});

let startX = 0;
let startY = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    if (!e.changedTouches || !e.changedTouches.length || isAnimating) return;

    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) < 40) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < 0) {
      goTo(currentIndex + 1);
    } else {
      goTo(currentIndex - 1);
    }
  },
  { passive: true }
);

document.addEventListener("keydown", (e) => {
  if (isAnimating) return;

  if (e.key === "ArrowLeft") goTo(currentIndex - 1);
  if (e.key === "ArrowRight") goTo(currentIndex + 1);

  if (e.key === "Enter" && projects[currentIndex]) {
    window.location.href = `project.html?slug=${encodeURIComponent(projects[currentIndex].slug)}`;
  }
});

render();
