
# The Data to Insight Consortium: Imagining a Centre of Excellence
## For Children’s Services Data and Digital Professionals
<!--- self-contained logo block (css only applies here) -->
<style>
.md-typeset table.gallery {
  table-layout: fixed; width: 100%;
  border-collapse: collapse; margin: 0;
}
.md-typeset table.gallery td {
  padding: .25rem; text-align: center; vertical-align: middle; border: 0;
}
.md-typeset img.gallery-img {
  display: block; max-width: 100%;
  height: 50px;           /* force height */
  object-fit: contain;    /* letterbox inside box */
  margin: 0 auto;
}
/* mobile shrink */
@media (max-width: 700px){
  .md-typeset img.gallery-img { height: 40px; }
}
</style>

<table class="gallery">
  <tr>
  <!--- need to make these img types consistent! unsure why they're not -->
    <td><img src="assets/img/picture1.png" class="gallery-img" alt="logo 1"></td>
    <td><img src="assets/img/picture2.jpg" class="gallery-img" alt="d2i logo"></td>
    <td><img src="assets/img/picture3.png" class="gallery-img" alt="logo 3"></td>
    <td><img src="assets/img/picture4.jpg" class="gallery-img" alt="logo 4"></td>
    <td><img src="assets/img/picture5.png" class="gallery-img" alt="logo 5"></td>
  </tr>
</table>
<!--- enfd of logo block -->




DRAFT AS AT 2025-10-10  
October 2025 




## Contributions

Page footers contain a feedback form like the example shown here for your contributions, corrections or comment on the direction of specific page content. We welcome your thoughts and enagement with the suggested topics.  

Additionally a broader, general [feedback page](feedback.md) offers further options to shape future CoE focus. 




<!--- feedback form only below here -->

<div class="feedback-section feedback-compact is-demo" id="sheets">
  <h2>Page feedback</h2>
  <form id="gs-form" data-disabled="true" aria-disabled="true">

    <input type="hidden" name="page" id="gs-page">
    <input type="text" name="hp_field" id="hp_field" style="display:none" tabindex="-1" autocomplete="off">

    <label for="mf-nature">Reflection on our thinking from this page</label>
    <select id="mf-nature">
      <option value="">— Select (optional) —</option>
      <option>I’m enthusiastic about this</option>
      <option>I’m unsure about this</option>
      <option>I disagree with this</option>
      <option>I have a general reflection on this</option>
      <option>I’ve identified a specific issue with this</option>
      <option>Other</option>
    </select>
    
    <label for="gs-summary" class="sr-only">Summary</label>
    <input type="text" name="summary" id="gs-summary" required minlength="5" placeholder="Brief summary (required)">

    <label for="gs-details" class="sr-only">Details</label>
    <textarea name="details" id="gs-details" rows="3" placeholder="Details (optional)"></textarea>

    <label for="mf-role">Your role <span class="req">*</span></label>
    <select id="mf-role" required>
      <option value="">— Select your role —</option>
      <option>Local authority data professional</option>
      <option>Local authority digital professional</option>
      <option>Local authority children’s social care professional</option>
      <option>Local authority leadership</option>
      <option>Central government data professional</option>
      <option>Central government digital professional</option>
      <option>Central government social care professional</option>
      <option>Central government leadership</option>
      <option>Other public sector professional role</option>
      <option>Data and digital supplier/partner</option>
      <option>Data and digital consultant</option>
      <option>Other private sector professional role</option>
      <option>Person (with current or previous social care involvement as a service user)</option>
      <option>Person (without current or previous social care involvement as a service user)</option>
    </select>

    <label for="mf-org">Your organisation (optional)</label>
    <input type="text" id="mf-org" placeholder="Organisation">

    <label for="mf-email">Your email (optional, for follow-up only)</label>
    <input type="email" id="mf-email" placeholder="you@example.org">

    <div class="feedback-actions">
      <button type="submit" class="md-button">Submit feedback</button>
    </div>

    <div class="feedback-success" id="gs-ok" hidden>Thanks — feedback received</div>
    <div class="feedback-error" id="gs-err" hidden>Sorry — something went wrong</div>
  </form>
</div>

