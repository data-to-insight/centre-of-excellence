export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let data;
    try { data = await request.json(); } catch { return new Response("Bad Request", { status: 400 }); }

    const { page, value, comments = "" } = data || {};
    const title = `Feedback: ${page || "unknown page"}`;
    const body = `**Page:** ${page}\n**Rating:** ${value}\n\n**Comments:**\n${comments}\n\nUA: ${request.headers.get("User-Agent")}`;

    const ghResp = await fetch(`https://api.github.com/repos/ORG/docs-feedback-private/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GH_TOKEN}`,   // add as Worker secret
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        labels: ["feedback","docs"]
      })
    });

    const ok = ghResp.ok;
    const text = await ghResp.text();
    return new Response(ok ? '{"ok":true}' : text, {
      status: ok ? 200 : ghResp.status,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
