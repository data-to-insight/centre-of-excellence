
(function () {
  const FORM = document.getElementById("gs-form");
  if (!FORM) return;

  // Browser posts to Cloudflare Worker (not direct to Google)
  const ENDPOINT = "https://coe-feedback-worker.robjharrison.workers.dev/sheets";
  // const ENDPOINT = "https://script.google.com/macros/s/AKfycbz6k8wMBFf3YEzBNPz6Wblm9uQqqlzIdcGsekIHOer1prvlB6srGxpkNbX4hCAUFkTR/exec"; 

  
  // Prefer ?page=... fallback to current URL
  const params  = new URLSearchParams(location.search);
  const pageUrl = params.get("page") ? decodeURIComponent(params.get("page")) : location.href;
  const pageField = document.getElementById("gs-page");
  if (pageField) pageField.value = pageUrl;

  const btn = FORM.querySelector("button[type='submit']");
  const ok  = document.getElementById("gs-ok");
  const err = document.getElementById("gs-err");

  let submitting = false;

  // disable button, stop re-entry, add sending… state)
  FORM.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (submitting) return;                 // against dbl click
    submitting = true;

    ok.hidden = true; err.hidden = true;

    const summaryEl = document.getElementById("gs-summary");
    const detailsEl = document.getElementById("gs-details");
    const summary = summaryEl ? summaryEl.value.trim() : "";
    const details = detailsEl ? detailsEl.value.trim() : "";

    if (!summary) { err.hidden = false; submitting = false; return; }

    // Disable UI + show loading
    if (btn) {
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.dataset.orig = btn.textContent;
      btn.textContent = "Sending…";
    }
    FORM.classList.add("is-submitting");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageUrl,
          summary,
          details,
          hp_field: document.getElementById("hp_field")?.value || ""
        })
      });

      if (res.ok) {
        ok.hidden = false;
        FORM.reset();
        summaryEl && summaryEl.focus();
        setTimeout(() => { ok.hidden = true; }, 2500);
      } else {
        err.hidden = false;
      }
    } catch {
      err.hidden = false;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("is-loading");
        if (btn.dataset.orig) btn.textContent = btn.dataset.orig;
      }
      FORM.classList.remove("is-submitting");
      submitting = false;
    }
  });
})();







// (function () {
//   const FORM = document.getElementById("gs-form");
//   if (!FORM) return;

//   // Browser posts to Cloudflare Worker (not direct to Google)
//   const ENDPOINT = "https://coe-feedback-worker.robjharrison.workers.dev/sheets";
//   // const ENDPOINT = "https://script.google.com/macros/s/AKfycbz6k8wMBFf3YEzBNPz6Wblm9uQqqlzIdcGsekIHOer1prvlB6srGxpkNbX4hCAUFkTR/exec"; 

//   document.getElementById("gs-page").value = location.href;

//   FORM.addEventListener("submit", async function (ev) {
//     ev.preventDefault();
//     const ok = document.getElementById("gs-ok");
//     const err = document.getElementById("gs-err");
//     ok.hidden = true; err.hidden = true;

//     const payload = {
//       page: location.href,
//       summary: document.getElementById("gs-summary").value.trim(),
//       details: document.getElementById("gs-details").value.trim(),
//       email: document.getElementById("gs-email").value.trim(),
//       hp_field: document.getElementById("hp_field") ? document.getElementById("hp_field").value : ""
//     };
//     if (!payload.summary) { err.hidden = false; return; }

//     try {
//       const res = await fetch(ENDPOINT, {
//         method: "POST",
//         headers: {"Content-Type":"application/json"},
//         body: JSON.stringify(payload)
//       });
//       if (res.ok) { ok.hidden = false; FORM.reset(); }
//       else { err.hidden = false; }
//     } catch {
//       err.hidden = false;
//     }
//   });
// })();
