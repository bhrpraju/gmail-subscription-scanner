let subscriptions = []; // Will hold parsed email data

function signIn() {
  alert("Google OAuth sign-in placeholder. Use your token client logic here.");
  // In real app, replace this with OAuth logic and call fetchSubscriptions(token);
  fetchMockData(); // temp
}

function fetchMockData() {
  subscriptions = [
    { service: "Netflix", amount: 499, currency: "₹", category: "Entertainment", tag: "", notes: "", status: "Active" },
    { service: "Spotify", amount: 119, currency: "₹", category: "Entertainment", tag: "", notes: "", status: "Inactive" },
    { service: "Notion Pro", amount: 500, currency: "₹", category: "Productivity", tag: "", notes: "", status: "Active" },
    { service: "YouTube Premium", amount: 129, currency: "₹", category: "Entertainment", tag: "", notes: "", status: "Duplicate" },
  ];
  renderDashboard();
}

function renderDashboard() {
  document.getElementById("dashboard").style.display = "block";
  const tbody = document.querySelector("#subscription-table tbody");
  tbody.innerHTML = "";
  let total = 0;
  const categoryTotals = {};

  subscriptions.forEach((s, i) => {
    total += parseFloat(s.amount);
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.amount;
    tbody.innerHTML += `<tr>
      <td>${s.service}</td>
      <td>${s.amount}</td>
      <td>${s.currency}</td>
      <td>${s.category}</td>
      <td><input value="${s.tag}" onchange="updateField(${i}, 'tag', this.value)"></td>
      <td><input value="${s.notes}" onchange="updateField(${i}, 'notes', this.value)"></td>
      <td>${s.status}</td>
      <td><button onclick="deleteRow(${i})">❌</button></td>
    </tr>`;
  });

  document.getElementById("total-cost").textContent = "₹" + total.toFixed(2);

  const sorted = [...subscriptions].sort((a,b)=>b.amount-a.amount).slice(0,3);
  document.getElementById("top-services").innerHTML = sorted.map(s=>`<li>${s.service} - ₹${s.amount}</li>`).join("");

  drawBarChart(categoryTotals);
}

function updateField(index, field, value) {
  subscriptions[index][field] = value;
}

function deleteRow(index) {
  subscriptions.splice(index, 1);
  renderDashboard();
}

function filterTable() {
  const filter = document.getElementById("filter").value.toLowerCase();
  const rows = document.querySelectorAll("#subscription-table tbody tr");
  rows.forEach(row => {
    const service = row.children[0].textContent.toLowerCase();
    row.style.display = service.includes(filter) ? "" : "none";
  });
}

function exportToCSV() {
  let csv = "Service,Amount,Currency,Category,Tag,Notes,Status\n";
  subscriptions.forEach(s => {
    csv += `${s.service},${s.amount},${s.currency},${s.category},${s.tag},${s.notes},${s.status}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subscriptions.csv";
  link.click();
}

function drawBarChart(data) {
  const canvas = document.getElementById("category-chart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const categories = Object.keys(data);
  const values = Object.values(data);
  const max = Math.max(...values);
  const barWidth = 40;
  const spacing = 60;

  categories.forEach((cat, i) => {
    const barHeight = (values[i] / max) * 150;
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(i * spacing + 30, 180 - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(cat, i * spacing + 25, 195);
  });
}
