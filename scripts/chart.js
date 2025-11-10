function buildChart(dataObj) {
  const mods = Object.keys(dataObj).sort();
  const table = document.getElementById("compatTable");
  table.innerHTML = "";

  // header
  let header = "<tr><th></th>";
  mods.forEach(m => (header += `<th>${m}</th>`));
  header += "</tr>";
  table.innerHTML = header;

  // body
  mods.forEach(modA => {
    let row = `<tr><th class="rowHeader">${modA}</th>`;
    mods.forEach(modB => {
      if (modA === modB) {
        row += `<td style="background:#222;">–</td>`;
        return;
      }
      const status = dataObj[modA][modB] || "NEUTRAL";
      row += `<td class="${status}" data-a="${modA}" data-b="${modB}">${status}</td>`;
    });
    row += "</tr>";
    table.innerHTML += row;
  });

  return mods;
}