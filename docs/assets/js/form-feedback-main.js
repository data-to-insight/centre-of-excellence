// docs/assets/js/form-feedback-main.js
// Full 'General/wider feedback' ---> Google Sheets via Cloudflare Worker

(function () {
  function init() {
    const FORM = document.getElementById("main-form");
    if (!FORM) return;

    // prevent double-wiring on SPA nav
    if (FORM.dataset.wired === "1") return;
    FORM.dataset.wired = "1";

  const ENDPOINT = "https://coe-feedback-worker.robjharrison.workers.dev/sheets"; // Proxy Google Apps Script

  // -------------- desponse options-data --------------
  const IDEAS = [
    "Data tool collaboration",
    "Improving data quality",
    "Facilitating information sharing",
    "Making sense of case management systems",
    "Making sense of AI RPA and other advanced and integrative software",
    "Influencing technology markets",
    "Curating technical standards",
    "Advocacy across internal hierarchies",
    "Supporting professional development",
    "Helping leadership to expect excellence",
    "Redefining cross-sector collaboration",
    "Responding to large-scale change",
    "Discovering what works"
  ];

  const ACTIVITIES = {
    "Data tool collaboration": [
      "Maintaining and continuously developing key products which the sector can rely on",
      "Advising local authority users on best practice in using and developing shared tools",
      "Facilitating collaborative design and development of future shared tools"
    ],
    "Improving data quality": [
      "Providing data quality tools and methods and driving improvement",
      "Defining suitable data quality standards and best practices for the sector",
      "Balancing and explaining the elements of data quality and data maturity in LAs"
    ],
    "Facilitating information sharing": [
      "Promoting good practice in information sharing",
      "Detailing relevant statutory duties and legislation for easy reference by LAs",
      "Advocating for national policy ensuring information sharing works for our sector"
    ],
    "Procurement and configuration": [
      "Improving typical procurement practice and other CMS-related activity",
      "Sharing and hosting good practice in system configuration and operation",
      "Challenging the existing market with new approaches to procurement-development"
    ],
    "Advanced technology": [
      "Surveying the technology landscape and developing adoption approaches",
      "Explaining options to local authorities, including how-to guidance and training",
      "Advocating for good practice with strategies for AI RPA and other technologies"
    ],
    "Influencing technology markets": [
      "Convening local authorities to reach actionable consensus on market issues",
      "Liaising with central government to scope useful policy instruments",
      "Engaging with suppliers to maintain dialogue on mutually beneficial behaviours"
    ],
    "Curating standards": [
      "Curating relevant technical and data standards for our sector",
      "Managing processes for changes to relevant standards",
      "Interacting with cross-government standards work to help it meet our needs"
    ],
    "Advocacy across hierarchies": [
      "Advocating for technical functions to senior leaders and practitioners",
      "Supporting solutions which will work in varied structural contexts",
      "Identifying effective delivery routes for beneficial changes and support offers"
    ],
    "Supporting professional development": [
      "Signposting learning opportunities which meet real needs",
      "Developing provision to meet critical sector needs eg-training and specialist capacity",
      "Establishing professional standards for the sector"
    ],
    "Helping leadership to expect excellence": [
      "Developing senior leaders to maintain high quality local data and digital functions",
      "Defining standard cross-sector expectations of local data functions",
      "Enabling professionals and peers to assess local data and digital maturity"
    ],
    "Redefining cross-sector collaboration": [
      "Co-ordinating the sectors cross-government data-digital change processes",
      "Hosting funding and creating sector resources shared across levels of government",
      "Helping local authorities appropriately relate national policy to local delivery"
    ],
    "Responding to large scale change": [
      "Helping LAs and government navigate the data and digital challenge of change",
      "Testing support approaches to identify those which actually work for LAs",
      "Negotiating across hierarchies including local and national on the change agenda"
    ],
    "Discovering what works": [
      "Mapping innovation and improvement activity relevant to the sector",
      "Connecting colleagues with partners and resources relevant to their problems",
      "Evaluating practices to understand effectiveness in improving outcomes for children"
    ]
  };

    // -------------- helpers --------------
    const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g,"");
    const escapeQuotes = s => s.replace(/"/g, '&quot;');

    function createRankRow(name, group) {
      const wrap = document.createElement("div");
      wrap.className = "item-row";
      const label = document.createElement("label");
      label.textContent = name;
      label.htmlFor = `${group}-${slug(name)}`;
      const sel = document.createElement("select");
      sel.id = `${group}-${slug(name)}`;
      sel.className = "rank";
      sel.innerHTML = `<option value="">—</option>` + [1,2,3,4,5].map(n=>`<option>${n}</option>`).join("");
      wrap.append(label, sel);
      return wrap;
    }

    function createActivityBlock(section, items) {
      const fieldset = document.createElement("div");
      fieldset.className = "activity-section";
      const head = document.createElement("h4");
      head.textContent = section;
      fieldset.appendChild(head);
      items.forEach(txt => {
        const id = `act-${slug(section)}-${slug(txt)}`;
        const row = document.createElement("label");
        row.className = "chk-row";
        row.innerHTML = `<input type="checkbox" id="${id}" value="${section}: ${escapeQuotes(txt)}"> ${txt}`;
        fieldset.appendChild(row);
      });
      return fieldset;
    }

    // -------------- duild dynamic response blocks --------------
    const useDiv  = document.getElementById("usefulness-list");
    const likeDiv = document.getElementById("likelihood-list");
    if (useDiv && likeDiv) {
      IDEAS.forEach(name => {
        useDiv.appendChild(createRankRow(name, "use"));
        likeDiv.appendChild(createRankRow(name, "like"));
      });
    }

    const actsDiv = document.getElementById("activities-list");
    if (actsDiv) {
      Object.entries(ACTIVITIES).forEach(([sec, items]) => {
        actsDiv.appendChild(createActivityBlock(sec, items));
      });
    }


    // // -------------- (re)build dynamic blocks --------------
    // // in case later mv to dynamic data (or chge init)
    // // data-wired guard (init runs once per-page view)
    // // cache elements first
    // const useDiv  = document.getElementById("usefulness-list");
    // const likeDiv = document.getElementById("likelihood-list");
    // const actsDiv = document.getElementById("activities-list");

    // // if rebuild lists, clear first (to avoid adding dups)
    // useDiv?.replaceChildren();
    // likeDiv?.replaceChildren();
    // actsDiv?.replaceChildren();

    // // (re)build - avoid errs if container not there
    // // reuse stored useDiv/likeDiv/actsDiv
    // if (useDiv && likeDiv) {
    //   IDEAS.forEach(name => {
    //     useDiv.appendChild(createRankRow(name, "use"));
    //     likeDiv.appendChild(createRankRow(name, "like"));
    //   });
    // }

    // if (actsDiv) {
    //   Object.entries(ACTIVITIES).forEach(([sec, items]) => {
    //     actsDiv.appendChild(createActivityBlock(sec, items));
    //   });
    // }


    // -------------- page submit --------------
    const params  = new URLSearchParams(location.search);
    const pageUrl = params.get("page") ? decodeURIComponent(params.get("page")) : location.href;
    const pageField = document.getElementById("mf-page");
    if (pageField) pageField.value = pageUrl;

    const btn = FORM.querySelector("button[type='submit']");
    const ok  = document.getElementById("mf-ok");
    const err = document.getElementById("mf-err");

    let sending = false;

    FORM.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (sending) return;
      sending = true;

      if (ok) ok.hidden = true;
      if (err) err.hidden = true;

      const roleEl  = document.getElementById("mf-role");
      const orgEl   = document.getElementById("mf-org");
      const emailEl = document.getElementById("mf-email");

      const role = roleEl ? roleEl.value.trim() : "";
      if (!role) { if (err) err.hidden = false; sending = false; return; }

      const org   = orgEl ? orgEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";

      // reposnse collecting
      // collect rankings
      const rankUse = {};
      const rankLik = {};
      IDEAS.forEach(name => {
        const uEl = document.getElementById(`use-${slug(name)}`);
        const lEl = document.getElementById(`like-${slug(name)}`);
        const u = uEl ? (uEl.value || "").trim() : "";
        const l = lEl ? (lEl.value || "").trim() : "";
        if (u) rankUse[name] = Number(u);
        if (l) rankLik[name] = Number(l);
      });

      // collect activities
      const acts = [];
      if (actsDiv) {
        actsDiv.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => acts.push(cb.value));
      }

      // reflections
      const sectionEl  = document.getElementById("mf-section");
      const commentsEl = document.getElementById("mf-comments");
      const section  = sectionEl  ? (sectionEl.value  || "").trim() : "";
      const comments = commentsEl ? (commentsEl.value || "").trim() : "";

      // disable UI
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
            tab: "MainFeedback",
            page: pageUrl,
            role, org, email,
            rank_usefulness: rankUse,
            rank_likelihood: rankLik,
            activities: acts,
            section,
            comments,
            hp_field: document.getElementById("mf_hp")?.value || ""
          })
        });

        if (res.ok) {
          if (ok) ok.hidden = false;
          FORM.reset();
          document.getElementById("mf-role")?.focus();
          setTimeout(() => { if (ok) ok.hidden = true; }, 3000);
        } else {
          if (err) err.hidden = false;
        }
      } catch {
        if (err) err.hidden = false;
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove("is-loading");
          if (btn.dataset.orig) btn.textContent = btn.dataset.orig;
        }
        FORM.classList.remove("is-submitting");
        sending = false;
      }
    });
  }

  // MkDocs Material SPA support
  if (window.document$ && typeof document$.subscribe === "function") {
    document$.subscribe(init);         // run each page change
  } else {
    document.addEventListener("DOMContentLoaded", init); // hard load
  }
})();