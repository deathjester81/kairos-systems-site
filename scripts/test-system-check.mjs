const base = "http://localhost:3000";

async function post(path, body) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}

async function get(path) {
  const res = await fetch(base + path);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  const { token } = await post("/api/system-check/start", {});
  console.log("TOKEN:", token);

  // 30 answers
  for (let i = 1; i <= 30; i++) {
    const q = `Q${String(i).padStart(2, "0")}`;
    const score = (i % 5) + 1;

    const free_text =
      q === "Q02" ? "Stark personenabhängig im Einkauf." :
      q === "Q08" ? "Lieferzeit schwankt wegen Übergaben." :
      q === "Q13" ? "Führung ist viel im Tagesgeschäft." :
      q === "Q24" ? "Viele Tools, aber keine End-to-End Sicht." :
      q === "Q30" ? "KI wäre spannend, aber Daten sind unzuverlässig." :
      null;

    await post("/api/system-check/answer", { token, question_id: q, score, free_text });
  }

  console.log("Answers OK.");

  // submit
  await post("/api/system-check/submit", {
    token,
    name: "Test User",
    email: "",
    company: "Test GmbH",
    phone: "",
  });
  console.log("Submit OK.");

  // report
  const report = await get(`/api/system-check/report?token=${token}`);
  console.log("Report OK. Open:", `${base}/system-check/report/${token}`);
  console.log("AI summary preview:", report?.report?.ai_json?.summary_md?.slice(0, 120) ?? "(none)");
}

main().catch((e) => {
  console.error("TEST FAILED:", e.message);
  process.exit(1);
});
