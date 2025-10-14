# Feedback   

Thank you for contributing your thoughts towards any of the following.
Feedback is annonymous unless you optionally add your organisation/email. 

<!--- feedback form only below here -->
<div class="feedback-section feedback-main" id="main-feedback">
  <form id="main-form" novalidate>
    <!-- hidden -->
    <input type="hidden" id="mf-page" name="page">
    <input type="text" id="mf_hp" name="hp_field" style="display:none !important" tabindex="-1" autocomplete="off" aria-hidden="true">

    <fieldset>
      <legend></legend>

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

      <label for="mf-email">Your email (optional, for follow-up)</label>
      <input type="email" id="mf-email" placeholder="you@example.org">
    </fieldset>

    <fieldset>
      <legend>Please score our ideas by usefulness to the sector, if they were successfully achieved (1–5)</legend>
      <div id="usefulness-list" class="items-grid"></div>
    </fieldset>

    <fieldset>
      <legend>Please score our ideas by likelihood of your organisation directly using their outputs to achieve local service improvements  (1–5)</legend>
      <div id="likelihood-list" class="items-grid"></div>
    </fieldset>

    <fieldset>
      <legend>Please flag the items from our longlist of possible activities which you would most want a Centre of Excellence to explore further</legend>
      <p class="hint">Tick any that matter to you:</p>
      <div id="activities-list" class="items-grid"></div>
    </fieldset>


  <!-- HIDE ONLY ON MAIN FORM (still posts empty value) -->
    <!-- <fieldset>
      <legend>Reflections (optional)</legend>

      <label for="mf-section">Section to which your feedback relates</label>
      <select id="mf-section">
        <option value="">— Select (optional) —</option>
        <optgroup label="Something I think is missing">
          <option>…about how our system work</option>
          <option>…in the possible mechanisms for change</option>
          <option>…in the possible delivery models</option>
          <option>…in the engagement opportunities</option>
        </optgroup>
        <optgroup label="General feedback">
          <option>How our system works</option>
          <option>Possible mechanisms for change</option>
          <option>Models for delivery</option>
          <option>Engagement opportunities</option>
        </optgroup>
        <optgroup label="Specific feedback">
          <option>The context of the work</option>
          <option>The status of the work</option>
          <option>The value of the work</option>
          <option>The quality of the work</option>
          <option>The cost of the work</option>
          <option>Data tool collaboration</option>
          <option>Improving data quality</option>
          <option>Facilitating information sharing</option>
          <option>Making sense of case management systems</option>
          <option>Making sense of AI, RPA, and other advanced and integrative software</option>
          <option>Influencing technology markets</option>
          <option>Curating technical standards</option>
          <option>Advocacy across internal hierarchies</option>
          <option>Supporting professional development</option>
          <option>Helping leadership to expect excellence</option>
          <option>Redefining cross-sector collaboration</option>
          <option>Responding to large-scale change</option>
          <option>Discovering what works</option>
          <option>More on models for delivery</option>
          <option>Anything else</option>
        </optgroup>
      </select>
  -->


      <label for="mf-nature">Your reflections on specific areas of our thinking</label>
      <select id="mf-nature">
        <option value="">— Select (optional) —</option>
        <option>I’m enthusiastic about this</option>
        <option>I’m unsure about this</option>
        <option>I disagree with this</option>
        <option>I have a general reflection on this</option>
        <option>I’ve identified a specific issue with this</option>
        <option>Other</option>
      </select>

      <label for="mf-comments">Open feedback (free txt)</label>
      <textarea id="mf-comments" rows="5" placeholder="Your comments…"></textarea>
    </fieldset>

    <div class="feedback-actions">
      <button type="submit" class="md-button">Submit feedback</button>
    </div>

    <p class="feedback-success" id="mf-ok" hidden>Thanks — received</p>
    <p class="feedback-error" id="mf-err" hidden>Sorry — something went wrong</p>
  </form>
</div>



<div class="feedback-section feedback-main" id="email">
  <h2>Contact us</h2>
  <p>Contributions not covered by the above, or general queries.</p>
  <div class="feedback-actions">
    <a id="email-feedback" class="md-button" href="#">Email feedback or query</a>
  </div>
</div>

