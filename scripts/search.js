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
    if (!a && !b) return;

    // highlight row
    if (a) {
      // highlight all cells in row a (using data attribute which is reliable)
      const rowCells = document.querySelectorAll(`td[data-a="${a}"]`);
      rowCells.forEach(el => el.classList.add("highlight"));
      
      // highlight row header by finding the one that matches the data-a value
      const rowHeader = Array.from(document.querySelectorAll('.rowHeader')).find(el => {
        return el.textContent.trim() === a;
      });
      if (rowHeader) {
        rowHeader.classList.add("highlight");
        rowHeader.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // highlight column
    if (b) {
      // highlight all cells in column b (using data attribute which is reliable)
      const colCells = document.querySelectorAll(`td[data-b="${b}"]`);
      colCells.forEach(el => el.classList.add("highlight"));
      
      // highlight column header
      const colHeader = Array.from(document.querySelectorAll('th')).find(el => {
        return el.textContent.trim() === b && !el.classList.contains('rowHeader');
      });
      if (colHeader) {
        colHeader.classList.add("highlight");
        colHeader.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }

    // if both exist, scroll to intersection
    if (a && b) {
      const cell = document.querySelector(`td[data-a="${a}"][data-b="${b}"]`);
      if (cell) {
        cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
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

    const trimmedInput = input.trim();
    const lowerInput = trimmedInput.toLowerCase().replace(/[^\w\s]/g, '');
    
    // first try exact case-insensitive match
    const exactMatch = mods.find(mod => mod.toLowerCase() === trimmedInput.toLowerCase());
    if (exactMatch) return exactMatch;
    
    // then try exact match on cleaned version
    const cleanedExactMatch = mods.find(mod => {
      const cleanMod = mod.toLowerCase().replace(/[^\w\s]/g, '');
      return cleanMod === lowerInput;
    });
    if (cleanedExactMatch) return cleanedExactMatch;
    
    // finally fall back to partial match - return first alphabetical match
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