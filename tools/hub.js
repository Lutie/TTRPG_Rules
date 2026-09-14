const search = document.getElementById("search");
const grid = document.getElementById("toolsGrid");
const cards = Array.from(grid.querySelectorAll(".card"));

function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

search?.addEventListener("input", () => {
  const q = norm(search.value.trim());
  for (const c of cards) {
    const text = norm(c.textContent);
    c.style.display = text.includes(q) ? "" : "none";
  }
});
