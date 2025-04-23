
const CLIENT_ID = "802518038033-c7ovg2vfmcuutcup44phb1qnc87fvkob.apps.googleusercontent.com";
let tokenClient;
let accessToken;

function signIn() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    callback: (tokenResponse) => {
      if (tokenResponse.access_token) {
        accessToken = tokenResponse.access_token;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        fetchSubscriptions();
      }
    },
  });
  tokenClient.requestAccessToken();
}

function fetchSubscriptions() {
  const headers = new Headers({ Authorization: `Bearer ${accessToken}` });
  const now = new Date();
  const pastDate = new Date(now.setMonth(now.getMonth() - 24));
  const after = Math.floor(pastDate.getTime() / 1000);
  const query = `after:${after} subject:(receipt OR subscription OR invoice)`;
  fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`, { headers })
    .then(res => res.json())
    .then(data => {
      if (!data.messages) return;
      const promises = data.messages.slice(0, 20).map(msg =>
        fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, { headers })
          .then(res => res.json())
      );
      Promise.all(promises).then(renderResults);
    });
}

function renderResults(messages) {
  const tbody = document.querySelector("#subscriptionTable tbody");
  tbody.innerHTML = "";
  let total = 0;
  messages.forEach(msg => {
    const snippet = msg.snippet || "";
    const match = snippet.match(/([\w\s]{2,40})(₹|\$|€)([\d,.]+)/);
    if (match) {
      const [ , service, currency, amount ] = match;
      const date = new Date(parseInt(msg.internalDate)).toLocaleDateString();
      const amt = parseFloat(amount.replace(/,/g, ''));
      total += amt;
      const row = `<tr><td>${service.trim()}</td><td>${currency}</td><td>${amt.toFixed(2)}</td><td>${date}</td></tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    }
  });
  document.getElementById("totalCost").innerText = `Total: ₹${total.toFixed(2)}`;
}

function exportToCSV() {
  let csv = "Service,Currency,Amount,Date\n";
  document.querySelectorAll("#subscriptionTable tbody tr").forEach(row => {
    const cells = Array.from(row.querySelectorAll("td")).map(td => td.textContent);
    csv += cells.join(",") + "\n";
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subscriptions.csv";
  link.click();
}
