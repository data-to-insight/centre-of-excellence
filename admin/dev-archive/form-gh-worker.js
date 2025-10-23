(function () {
  const FORM = document.getElementById("ghw-form");
  if (!FORM) return;

  const ENDPOINT = "https://coe-feedback-worker.robjharrison.workers.dev";  // from cloudflare worker
  // https://dash.cloudflare.com/<userid>/workers/services/view/coe-feedback-worker/production/settings#variables
  // access token from https://github.com/settings/personal-access-tokens

  document.getElementById("ghw-page").value = location.href;

  FORM.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const ok = document.getElementById("ghw-ok");
    const err = document.getElementById("ghw-err");
    ok.hidden = true; err.hidden = true;

    const payload = {
      page: location.href,
      summary: document.getElementById("ghw-summary").value.trim(),
      details: document.getElementById("ghw-details").value.trim()
    };
    if (!payload.summary) { err.hidden = false; return; }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const j = await res.json().catch(()=> ({}));
      if (res.ok && j && j.ok) { ok.hidden = false; FORM.reset(); }
      else { err.hidden = false; }
    } catch {
      err.hidden = false;
    }
  });
})();
