  (function () {
  function init() {
    var feedback = document.forms.feedback;
    if (!feedback) return;

    feedback.hidden = false;

    feedback.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = ev.submitter.getAttribute("data-md-value");
      // DEV: send {page: location.pathname, value: data} to backend/endpoint

      // Disable button and show note
      feedback.firstElementChild.disabled = true;
      var note = feedback.querySelector(".md-feedback__note [data-md-value='" + data + "']");
      if (note) note.hidden = false;
    });
  }

  if (window.document$ && typeof document$.subscribe === "function") {
    document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();

