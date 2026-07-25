function createTable(header, entries) {
  const table = document.createElement("table");
  const addRow = (element, cols) => {
    const row = document.createElement("tr");
    for (const col of cols) {
      const cell = document.createElement(element);
      cell.innerText = col;
      row.append(cell);
    }
    table.append(row);
  };

  addRow("th", header);
  for (const row of entries) {
    addRow("td", row);
  }

  return table;
}

function setGlobalError(error) {
  document.getElementById("app-error").hidden = false;
  document.getElementById("app-error").innerText = error;

  for (const button of Array.from(document.getElementsByTagName("button"))) {
    button.disabled = true;
  }
}

const withPassword = (text) =>
  `${text}?pw=${new URLSearchParams(location.search).get("pw")}`;

async function reloadStatus() {
  const response = await fetch(withPassword("./api/stats"));
  if (response.status === 403) {
    setGlobalError("Wrong password");
    return;
  }

  const json = await response.json();
  document
    .getElementById("status-cell-content")
    .replaceChildren(
      createTable(
        ["Key", "Value"],
        [["bootstrapped?", json.bootstrapped ? "Yes" : "No"]],
      ),
    );

  return json;
}

function allowBootstrapping() {
  document.getElementById("already-bootstrapped-text").hidden = true;
  document.getElementById("bootstrapper-content").hidden = false;

  document.getElementById("bootstrap-button").addEventListener("click", () => {
    document.getElementById("bootstrap-button").hidden = true;

    const source = new EventSource(withPassword("./api/bootstrap"));
    source.onmessage = (event) => {
      document.getElementById("bootstrapper-logs").value =
        event.data +
        "\n\n" +
        document.getElementById("bootstrapper-logs").value;
    };
  });
}

async function loadCurrentAuth() {
  const response = await fetch(withPassword("./api/currentauth"));
  if (response.status === 403) {
    setGlobalError("Wrong password");
    return;
  }

  const json = await response.json();
  if (json.auth === null) {
    document.getElementById("current-auth-content").textContent = "None";
    return;
  }

  json.auth.accessToken = json.auth.accessToken.slice(-50);
  json.auth.refreshToken = json.auth.refreshToken.slice(-50);

  document
    .getElementById("current-auth-content")
    .replaceChildren(
      createTable(["Key", "Value (last 50 chars)"], Object.entries(json.auth)),
    );

  document
    .getElementById("current-auth-refresh-button")
    .addEventListener("click", async () => {
      await fetch(withPassword("./api/refreshAuth"));
      location.reload();
    });
}

async function loadRefreshes() {
  const response = await fetch(withPassword("./api/refreshes"));
  if (response.status === 403) {
    setGlobalError("Wrong password");
    return;
  }

  const json = await response.json();
  console.log(json);
  const dates = json.refreshes.map((t) => new Date(t));

  document.getElementById("refreshes-content").replaceChildren(
    createTable(
      ["Date"],
      dates.map((d) => [d.toLocaleString()]),
    ),
  );
}

async function main() {
  const password = new URLSearchParams(location.search).get("pw");
  if (password === null) {
    setGlobalError("no password");
    return;
  }

  loadCurrentAuth();
  loadRefreshes();

  const status = await reloadStatus();
  if (!status.bootstrapped) {
    allowBootstrapping();
  }
}

window.addEventListener("DOMContentLoaded", () => main());
