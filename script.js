let subscriptions = [
  { service: "Netflix", currency: "$", amount: 15, tag: "", notes: "" },
  { service: "Spotify", currency: "$", amount: 10, tag: "", notes: "" },
];

function renderTable() {
  const tbody = document.querySelector("#subscriptionTable tbody");
  tbody.innerHTML = "";
  let total = 0;
  subscriptions.forEach((sub, index) => {
    total += sub.amount;
    const row = `<tr>
      <td>${sub.service}</td>
      <td>${sub.currency}</td>
      <td>${sub.amount}</td>
      <td><input value="${sub.tag}" onchange="updateTag(${index}, this.value)" /></td>
      <td><input value="${sub.notes}" onchange="updateNotes(${index}, this.value)" /></td>
      <td><button onclick="deleteRow(${index})">Delete</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById("totalCost").textContent = "$" + total.toFixed(2);
}

function updateTag(index, value) {
  subscriptions[index].tag = value;
}

function updateNotes(index, value) {
  subscriptions[index].notes = value;
}

function deleteRow(index) {
  subscriptions.splice(index, 1);
  renderTable();
}

function filterTable() {
  const input = document.getElementById("filterInput").value.toLowerCase();
  const rows = document.querySelectorAll("#subscriptionTable tbody tr");
  rows.forEach(row => {
    const service = row.children[0].textContent.toLowerCase();
    row.style.display = service.includes(input) ? "" : "none";
  });
}

function exportToCSV() {
  let csv = "Service,Currency,Amount,Tag,Notes\n";
  subscriptions.forEach(sub => {
    csv += `${sub.service},${sub.currency},${sub.amount},${sub.tag},${sub.notes}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subscriptions.csv";
  a.click();
}

function signIn() {
  alert("OAuth login placeholder");
}

document.addEventListener("DOMContentLoaded", renderTable);
