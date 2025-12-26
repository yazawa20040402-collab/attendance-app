const API_URL = "https://script.google.com/macros/s/AKfycbysylzOCiixYsk5m8x21V0Li8oCA6tT4AFq2QEGRjkYYwrnrnsGUVmLAQfNx4IORs-I/exec";


const $ = (id) => document.getElementById(id);
const statusEl = $("status");

function setStatus(msg, type="") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

async function callApi(action, extra={}) {
  const traineeId = $("traineeId").value.trim();
  if (!traineeId) throw new Error("研修生IDを入力してください");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, traineeId, ...extra }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.message || `API error: ${res.status}`);
  return data;
}

$("clockin").addEventListener("click", async () => {
  try {
    setStatus("出勤送信中…");
    const data = await callApi("clockin");
    setStatus(data.message, "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});

$("clockout").addEventListener("click", async () => {
  try {
    setStatus("退勤送信中…");
    const data = await callApi("clockout");
    setStatus(data.work ? `${data.message}（勤務：${data.work}）` : data.message, "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});

$("complete").addEventListener("click", async () => {
  try {
    setStatus("完了報告送信中…");
    const appUrl = location.href.replace(/#.*$/, "");
    const data = await callApi("complete", { appUrl });
    setStatus(data.message, "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});

const API_URL = "https://script.google.com/macros/s/AKfycbysylzOCiixYsk5m8x21V0Li8oCA6tT4AFq2QEGRjkYYwrnrnsGUVmLAQfNx4IORs-I/exec";

const $ = (id) => document.getElementById(id);
const statusEl = $("status");

function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

// ★CORS回避：no-cors + form送信（レスポンスは読まない）
async function callApi(action, extra = {}) {
  const traineeId = $("traineeId").value.trim();
  if (!traineeId) throw new Error("研修生IDを入力してください");

  const params = new URLSearchParams({ action, traineeId, ...extra });

  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    body: params,
  });

  return { ok: true };
}

$("clockin").addEventListener("click", async () => {
  try {
    setStatus("出勤送信中…");
    await callApi("clockin");
    setStatus("送信しました。LINE/スプレッドシートを確認してください。", "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});

$("clockout").addEventListener("click", async () => {
  try {
    setStatus("退勤送信中…");
    await callApi("clockout");
    setStatus("送信しました。LINE/スプレッドシートを確認してください。", "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});

$("complete").addEventListener("click", async () => {
  try {
    setStatus("完了報告送信中…");
    const appUrl = location.href.replace(/#.*$/, "");
    await callApi("complete", { appUrl });
    setStatus("送信しました。LINE/スプレッドシートを確認してください。", "ok");
  } catch (e) {
    setStatus(e.message, "err");
  }
});
