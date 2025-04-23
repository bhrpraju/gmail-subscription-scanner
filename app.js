
document.getElementById("signin-button").addEventListener("click", function() {
  alert("OAuth login placeholder - integrate Google OAuth here.");
});

// Dummy data display (to be replaced with Gmail API logic)
const data = [
  { service: "Netflix", category: "Streaming", currency: "$", amount: 15.99, date: "2024-06-10" },
  { service: "Spotify", category: "Music", currency: "$", amount: 9.99, date: "2024-06-05" },
  { service: "Just", category: "Misc", currency: "$", amount: 19.00, date: "2024-07-01" },
];

function renderTable(rows) {
  const tbody = document.querySelector("#subscriptionTable tbody");
  tbody.innerHTML = "";
  let total = 0;
  rows.forEach(row => {
    total += parseFloat(row.amount);
    tbody.innerHTML += `
      <tr>
        <td>${row.service}</td>
        <td>${row.category}</td>
        <td>${row.currency}</td>
        <td>${row.amount}</td>
        <td>${row.date}</td>
      </tr>
    `;
  });
  document.getElementById("totalCost").textContent = "$" + total.toFixed(2);
}
renderTable(data);

document.getElementById("filterInput").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const filtered = data.filter(d =>
    d.service.toLowerCase().includes(val) ||
    d.category.toLowerCase().includes(val)
  );
  renderTable(filtered);
});

document.getElementById("exportCsv").addEventListener("click", function () {
  const csv = ["Service,Category,Currency,Amount,Date"];
  data.forEach(d => {
    csv.push(`${d.service},${d.category},${d.currency},${d.amount},${d.date}`);
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "subscriptions.csv";
  a.click();
});
