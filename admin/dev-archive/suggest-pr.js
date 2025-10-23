
(function () {
  const ORG = "data-to-insight";           // 
  const REPO = "centre-of-excellence";         // 
  const BRANCH = "main";       // or def' branch
  const FOLDER = "docs/_suggestions";
  // Suggest filename like: 10-07-1974-suggestion.md
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const here = window.location.href;

  const title = document.title.replace(/\s+/g, " ").trim();
  const fname = `${yyyy}-${mm}-${dd}-feedback.md`;

  const body = [
    "# Feedback",
    "",
    `**Source page:** ${here}`,
    `**Page title:** ${title}`,
    "",
    "## Summary",
    "- ",
    "",
    "## Details / context",
    "- ",
    "",
    "## Category",
    "- Content | Navigation | Accessibility | UI | Performance | Other",
    ""
  ].join("\n");

  const url = `https://github.com/${ORG}/${REPO}/new/${BRANCH}/${FOLDER}`
            + `?filename=${encodeURIComponent(fname)}`
            + `&value=${encodeURIComponent(body)}`;

  const btn = document.getElementById("pr-suggest-btn");
  if (btn) btn.href = url;
})();

