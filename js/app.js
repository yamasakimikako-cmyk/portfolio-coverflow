const projects = window.PROJECTS || [];
let currentIndex = 0;

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
  if (projects.length === 0) return 0;
  return (index + projects.length) % projects.length;
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
      currentIndex = index;
      render();
    });
    container.appendChild(item);
  });
}

function render() {
  if (!projects.length) return;

  const current = projects[currentIndex];
  const left = projects[getWrappedIndex(currentIndex - 1)];
  const right = projects[getWrappedIndex(currentIndex + 1)];

  activeCover.innerHTML = `<img src="${current.cover}" alt="${current.title}">`;
  leftCover.innerHTML = `<img src="${left.cover}" alt="${left.title}">`;
  rightCover.innerHTML = `<img src="${right.cover}" alt="${right.title}">`;

  activeCover.onclick = () => {
    window.location.href = `project.html?slug=${encodeURIComponent(current.slug)}`;
  };

  renderNav(desktopNav);
  renderNav(mobileNav);
}

prevBtn?.addEventListener("click", () => {
  currentIndex = getWrappedIndex(currentIndex - 1);
  render();
});

nextBtn?.addEventListener("click", () => {
  currentIndex = getWrappedIndex(currentIndex + 1);
  render();
});

leftCover?.addEventListener("click", () => {
  currentIndex = getWrappedIndex(currentIndex - 1);
  render();
});

rightCover?.addEventListener("click", () => {
  currentIndex = getWrappedIndex(currentIndex + 1);
  render();
});

infoToggle?.addEventListener("click", () => {
  profilePanel.classList.toggle("open");
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const delta = touchEndX - touchStartX;

  if (Math.abs(delta) < 40) return;

  if (delta < 0) {
    currentIndex = getWrappedIndex(currentIndex + 1);
  } else {
    currentIndex = getWrappedIndex(currentIndex - 1);
  }
  render();
});

render();
