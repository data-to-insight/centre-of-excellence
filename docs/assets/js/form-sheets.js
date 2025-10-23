// docs/assets/js/form-sheets.js
// Handle submission of feedback form to Google Sheets via Cloudflare Worker
// timing and scoping fix applied RH
document.addEventListener('DOMContentLoaded', () => {
  const FORM = document.getElementById('gs-form');
  if (!FORM) return; // only on pages that have the compact form

  // demo/disabled gate
  const WRAP = document.getElementById('sheets');
  const DISABLED = FORM.dataset.disabled === 'true' || (WRAP && WRAP.classList.contains('is-demo'));
  if (DISABLED) {
    const pageField = FORM.querySelector('#gs-page');
    if (pageField) pageField.value = location.href;
    FORM.querySelectorAll('input, textarea, select, button').forEach(el => {
      if (el.type !== 'hidden') el.disabled = true;
    });
    const btn = FORM.querySelector("button[type='submit']");
    if (btn) btn.textContent = 'Feedback disabled on this page';
    FORM.addEventListener('submit', ev => ev.preventDefault());
    return;
  }

  // Worker endpoint (unchanged)
  const ENDPOINT = 'https://coe-feedback-worker.robjharrison.workers.dev/sheets';
  // const ENDPOINT = 'https://script.google.com/macros/s/…/exec';

  // Page value (prefer ?page=…)
  const params   = new URLSearchParams(location.search);
  const pageUrl  = params.get('page') ? decodeURIComponent(params.get('page')) : location.href;
  const pageField = FORM.querySelector('#gs-page');
  if (pageField) pageField.value = pageUrl;

  const btn = FORM.querySelector("button[type='submit']");
  const ok  = FORM.querySelector('#gs-ok');
  const err = FORM.querySelector('#gs-err');
  const val = sel => (FORM.querySelector(sel)?.value || '').trim();

  let submitting = false;

  FORM.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (submitting) return;

    // native validity
    if (FORM.checkValidity && !FORM.checkValidity()) {
      FORM.reportValidity();
      return;
    }
    if (!FORM.checkValidity && !val('#gs-summary')) {
      if (err) err.hidden = false;
      return;
    }

    submitting = true;
    if (ok)  ok.hidden  = true;
    if (err) err.hidden = true;

    const payload = {
      tab:     'Feedback',
      page:    pageUrl,
      summary: val('#gs-summary'),
      details: val('#gs-details'),
      role:    val('#mf-role'),     // scoped to the COMPACT form
      org:     val('#mf-org'),
      email:   val('#mf-email'),
      nature:  FORM.querySelector('#mf-nature')?.value || '',
      hp_field: val('#hp_field')
    };

    if (btn) {
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.dataset.orig = btn.textContent;
      btn.textContent = 'Sending…';
    }
    FORM.classList.add('is-submitting');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.warn('Compact feedback non-OK:', res.status, res.statusText, text);
        if (err) err.hidden = false;
      } else {
        if (ok) ok.hidden = false;
        FORM.reset();
        FORM.querySelector('#gs-summary')?.focus();
        setTimeout(() => { if (ok) ok.hidden = true; }, 2500);
      }
    } catch (e) {
      console.warn('Compact feedback request failed:', e);
      if (err) err.hidden = false;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        if (btn.dataset.orig) btn.textContent = btn.dataset.orig;
      }
      FORM.classList.remove('is-submitting');
      submitting = false;
    }
  });

  // Simple wiring smoke test
  //console.debug('[compact] form-sheets wired:', !!FORM);
});





// depreciated during testing RH 231025
// Handle submission of feedback form to Google Sheets via Cloudflare Worker 
(function () {
  const FORM = document.getElementById("gs-form");
  if (!FORM) return;

  // start of index page demo mode (blocked to avoid feedback from index pg)
  const WRAP = document.getElementById("sheets");
  const DISABLED = FORM.dataset.disabled === "true" || (WRAP && WRAP.classList.contains("is-demo"));
  if (DISABLED) {
    // set page field for consistency
    const pageField = document.getElementById("gs-page");
    if (pageField) pageField.value = location.href;

    // disable all controls and make button inactive
    FORM.querySelectorAll("input, textarea, select, button").forEach(el => {
      if (el.type !== "hidden") el.disabled = true;
    });
    const btn = FORM.querySelector("button[type='submit']");
    if (btn) btn.textContent = "Feedback disabled on this page";

    // hard block submits
    FORM.addEventListener("submit", ev => ev.preventDefault());
    return; // stop wiring real submit handler
  } // end of index page demo mode


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

  FORM.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (submitting) return;

    // use browser validity UI for required fields (e.g., role, summary minlength)
    if (!FORM.checkValidity && !document.getElementById("gs-summary").value.trim()) {
      err.hidden = false; return;
    }
    if (FORM.checkValidity && !FORM.checkValidity()) {
      FORM.reportValidity();
      return;
    }

    submitting = true;
    ok.hidden = true; err.hidden = true;

    const payload = {
      tab: "Feedback",                            // <-- write to Feedback tab
      page: pageUrl,
      summary: document.getElementById("gs-summary")?.value.trim() || "",
      details: document.getElementById("gs-details")?.value.trim() || "",
      role:    document.getElementById("mf-role")?.value || "",
      org:     document.getElementById("mf-org")?.value.trim() || "",
      email:   document.getElementById("mf-email")?.value.trim() || "",
      nature:  document.getElementById("mf-nature")?.value || "",
      hp_field: document.getElementById("hp_field")?.value || ""
    };

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
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        ok.hidden = false;
        FORM.reset();
        document.getElementById("gs-summary")?.focus();
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

