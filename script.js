
const CLIENT_ID = "802518038033-c7ovg2vfmcuutcup44phb1qnc87fvkob.apps.googleusercontent.com";
const REDIRECT_URI = "https://bhrpraju.github.io/gmail-subscription-scanner";
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

let tokenClient;

document.getElementById("login-btn").addEventListener("click", () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: (tokenResponse) => {
      if (tokenResponse.access_token) {
        fetchSubscriptions(tokenResponse.access_token);
      }
    },
  });
  tokenClient.requestAccessToken();
});

function fetchSubscriptions(token) {
  fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subscription OR invoice OR receipt", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      const messages = data.messages || [];
      const results = [];
      for (let msg of messages.slice(0, 15)) {
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const msgData = await res.json();
        const snippet = msgData.snippet || "";
        const match = snippet.match(/([A-Za-z0-9\s]+)(₹|\$)([\d,\.]+)/);
        if (match) {
          results.push({ service: match[1].trim(), currency: match[2], amount: match[3] });
        }
      }
      renderResults(results);
    });
}

function renderResults(data) {
  const div = document.getElementById("result");
  if (!data.length) return (div.innerHTML = "<p>No subscriptions found.</p>");
  let html = "<table><tr><th>Service</th><th>Currency</th><th>Amount</th></tr>";
  data.forEach((item) => {
    html += `<tr><td>${item.service}</td><td>${item.currency}</td><td>${item.amount}</td></tr>`;
  });
  html += "</table>";
  div.innerHTML = html;
}
