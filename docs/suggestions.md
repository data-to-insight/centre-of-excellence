# Suggest a change

Click button below. Opens pre-filled Git form (opens new tab)

<a id="suggestion-btn" class="md-button" href="#" target="_blank" rel="noopener">
  Submit suggestion
</a>

<script>
  (function () {
    // this not yet what we want as not-anon.... tbc
    const repo = "data-to-insight/centre-of-excellence"; 
    const template = "suggestion.yml";
    const here = window.location.href;
    const title = encodeURIComponent("Suggestion: ");
    const page  = encodeURIComponent(here);
    // Pre-fill form title and page field (Issue Form accept GET params)
    const url = `https://github.com/${repo}/issues/new` +
      `?title=${title}` +
      `&template=${encodeURIComponent(template)}` +
      `&page=${page}`;
    document.getElementById("suggestion-btn").href = url;
  })();
</script>
