const API_URL = "https://script.google.com/macros/s/AKfycbysylzOCiixYsk5m8x21V0Li8oCA6tT4AFq2QEGRjkYYwrnrnsGUVmLAQfNx4IORs-I/exec";

const $ = (id) => document.getElementById(id);
const statusEl = $("status");

function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

// ★これが見えたら「新しいapp.jsが読めてる」確定
setStatus("v3 loaded（no-cors送信）", "");

async function callApi(action, extra = {}) {
  const traineeId = $("traineeId").value.trim();
  if (!traineeId) throw new Error("研修生IDを入力してください");

  // ★フォーム形式で送る（GAS側は e.parameter で受け取れる）
  const params = new URLSearchParams({ action, traineeId, ...extra });

  // ★CORS回避：レスポンスは読まない
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
    setStatus(String(e.message || e), "err");
  }
});

$("clockout").addEventListener("click", async () => {
  try {
    setStatus("退勤送信中…");
    await callApi("clockout");
    setStatus("送信しました。LINE/スプレッドシートを確認してください。", "ok");
  } catch (e) {
    setStatus(String(e.message || e), "err");
  }
});

$("complete").addEventListener("click", async () => {
  try {
    setStatus("完了報告送信中…");
    const appUrl = location.href.replace(/#.*$/, "");
    await callApi("complete", { appUrl });
    setStatus("送信しました。LINE/スプレッドシートを確認してください。", "ok");
  } catch (e) {
    setStatus(String(e.message || e), "err");
  }
});
