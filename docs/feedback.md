<div id="feedback-page">
  <!-- wrapped to improve width setting for forms -->

# Provide feedback  

_(IN DEV / TESTING)_
Multiple options shown here only as review. Cloudflare and GSheets options unfortunately via RH account. This unavoidable without ESCC intervention. 
Below shows the feedback endpoints only for dev testing, these, and the repo itself will be/should be set back to private before we start adding either content or taking live feedback. This all just a PoC demo for review. 

<div class="feedback-section" id="email">
<h2>Feedback - via email</h2>
<p>Goes via email app with template prefill(placeholder for now)</p>
<p class="feedback-actions">
  <a id="email-feedback" class="md-button" href="#">Email feedback</a>
</p>
</div>

<div class="feedback-section" id="sheets">
<h2>Feedback - via Google sheet</h2>
<p>Goes via Cloudflare worker(RH account), Google App script into Google sheet (RH account)</p>
<p>Lands here: https://docs.google.com/spreadsheets/d/1DO4D2I2kNSWwPMesh2fIsMzhEUaJXRPzQC0uFHPrakw/edit?usp=sharing</p>
<form id="gs-form">
  <!-- set by JS -->
  <input type="hidden" name="page" id="gs-page">
  <!-- honeypot (spam trap) -->
  <input type="text" name="hp_field" id="hp_field" style="display:none" tabindex="-1" autocomplete="off">

  <label for="gs-summary">Summary (required)</label>
  <input type="text" name="summary" id="gs-summary" required>

  <label for="gs-details">Details (optional)</label>
  <textarea name="details" id="gs-details" rows="5"></textarea>

  <label for="gs-email">Contact email (optional)</label>
  <input type="email" name="email" id="gs-email" placeholder="you@example.org">

  <div class="feedback-actions">
    <button type="submit" class="md-button">Send to Google Sheet</button>
  </div>

  <div class="feedback-success" id="gs-ok" hidden>Thanks -feedback received</div>
  <div class="feedback-error" id="gs-err" hidden>Sorry -something went wrong</div>
</form>
</div>

<div class="feedback-section" id="anon-gh">
<h2>Git Issue(Anon) feedback</h2>
<p>Goes via Cloudflare worker(RH account), creates issue(Anon as via Worker) in Git repo using bot token</p>
<p>Lands here: https://github.com/data-to-insight/centre-of-excellence/issues</p>
<!-- this uses current CoE repo issues, but it could be pointed at seperate private repo -->
<form id="ghw-form">
  <!-- set by JS -->
  <input type="hidden" name="page" id="ghw-page">

  <label for="ghw-summary">Summary (required)</label>
  <input type="text" name="summary" id="ghw-summary" required>

  <label for="ghw-details">Details (optional)</label>
  <textarea name="details" id="ghw-details" rows="5"></textarea>

  <div class="feedback-actions">
    <button type="submit" class="md-button">Send anonymous issue</button>
  </div>

  <div class="feedback-success" id="gs-ok" hidden>Thanks -feedback received</div>
  <div class="feedback-error" id="gs-err" hidden>Sorry -something went wrong</div>
</form>
</div>


</div>