// 主题切换
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
});
