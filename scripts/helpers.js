// auto-mirror relationships so only one direction is needed
function autoMirrorData(dataObj) {
  for (const [a, list] of Object.entries(dataObj)) {
    for (const [b, status] of Object.entries(list)) {
      if (!dataObj[b]) dataObj[b] = {};
      if (!dataObj[b][a]) dataObj[b][a] = status;
    }
  }
}

// utility to get best fuzzy match
function getBestMatch(query, mods, fuseInstance) {
  if (!query) return null;
  const result = fuseInstance.search(query.trim());
  return result.length ? result[0].item : null;
}
