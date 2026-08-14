const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://raehat-al-furn.pages.dev/</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipes.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-apple-puff.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-vanilla-cake.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-cheese-pies.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-4.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-roasted-potatoes.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-6.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-7.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-8.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-9.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/recipe-10.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/about.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/contact.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/privacy.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/cookies.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/terms.html</loc><lastmod>2026-08-14</lastmod></url>
  <url><loc>https://raehat-al-furn.pages.dev/disclaimer.html</loc><lastmod>2026-08-14</lastmod></url>
</urlset>`;

export function onRequest() {
  return new Response(SITEMAP, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
