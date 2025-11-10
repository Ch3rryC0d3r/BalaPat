// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // insert search container
  const controls = document.querySelector("h1");
  controls.insertAdjacentHTML(
    "afterend",
    `
    <div class="search-container">
      <input type="text" id="searchA" placeholder="Left mod (row or number)">
      <input type="text" id="searchB" placeholder="Top mod (column or number)">
    </div>
  `
  );

  const searchA = document.getElementById("searchA");
  const searchB = document.getElementById("searchB");

  const mods = Object.keys(data).sort();

  // auto-mirror
  for (const [a, list] of Object.entries(data)) {
    for (const [b, status] of Object.entries(list)) {
      if (!data[b]) data[b] = {};
      if (!data[b][a]) data[b][a] = status;
    }
  }

  // build chart
  buildChart(data);

  // highlight functions
  function clearHighlights() {
    document.querySelectorAll("td, th").forEach(c => c.classList.remove("highlight"));
  }

  function highlightIntersection(a, b) {
    clearHighlights();
    if (!a || !b) return;

    const cell =
      document.querySelector(`td[data-a="${a}"][data-b="${b}"]`) ||
      document.querySelector(`td[data-a="${b}"][data-b="${a}"]`);

    if (cell) {
      cell.classList.add("highlight");
      cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  // fuzzy + index helper
  function getBestMatch(input) {
    if (!input) return null;

    // if input is a number, select mod at that index (1-based)
    const idx = parseInt(input);
    if (!isNaN(idx) && idx >= 1 && idx <= mods.length) {
      return mods[idx - 1];
    }

    // case-insensitive partial match - return first alphabetical match
    const lowerInput = input.trim().toLowerCase().replace(/[^\w\s]/g, '');
    const matches = mods.filter(mod => {
      const cleanMod = mod.toLowerCase().replace(/[^\w\s]/g, '');
      return cleanMod.includes(lowerInput);
    });
    return matches.length ? matches[0] : null;
  }

  // event listener
  function onSearch() {
    const modA = getBestMatch(searchA.value);
    const modB = getBestMatch(searchB.value);
    highlightIntersection(modA, modB);
  }

  searchA.addEventListener("input", onSearch);
  searchB.addEventListener("input", onSearch);
}