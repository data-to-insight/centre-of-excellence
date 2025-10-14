(function () {
  const mailbox = "datatoinsight.enquiries@gmail.com"; // 
  const btn = document.getElementById("email-feedback");
  if (!btn) return;

  const here = window.location.href;
  const title = document.title.trim().replace(/\s+/g, " ");
  const selection = (window.getSelection && window.getSelection().toString()) || "";

  const subject = encodeURIComponent(`CoE feedback: ${title}`);
  const body = encodeURIComponent(
`
(Thank you for getting in touch, pls add your query or feedback below))
${selection}

Role: -
Organisation: -

Summary / context:
- 

Comments / details:
- `
  );
  btn.href = `mailto:${mailbox}?subject=${subject}&body=${body}`;
})();

// rem
//   const body = encodeURIComponent(
// `Page: ${here}
