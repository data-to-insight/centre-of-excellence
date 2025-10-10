(function () {
  const FORM = document.getElementById("gs-form");
  if (!FORM) return;

  // Browser posts to Cloudflare Worker (not direct to Google)
  const ENDPOINT = "https://coe-feedback-worker.robjharrison.workers.dev/sheets";
  // const ENDPOINT = "https://script.google.com/macros/s/AKfycbz6k8wMBFf3YEzBNPz6Wblm9uQqqlzIdcGsekIHOer1prvlB6srGxpkNbX4hCAUFkTR/exec"; 

  document.getElementById("gs-page").value = location.href;

  FORM.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const ok = document.getElementById("gs-ok");
    const err = document.getElementById("gs-err");
    ok.hidden = true; err.hidden = true;

    const payload = {
      page: location.href,
      summary: document.getElementById("gs-summary").value.trim(),
      details: document.getElementById("gs-details").value.trim(),
      email: document.getElementById("gs-email").value.trim(),
      hp_field: document.getElementById("hp_field") ? document.getElementById("hp_field").value : ""
    };
    if (!payload.summary) { err.hidden = false; return; }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      if (res.ok) { ok.hidden = false; FORM.reset(); }
      else { err.hidden = false; }
    } catch {
      err.hidden = false;
    }
  });
})();

