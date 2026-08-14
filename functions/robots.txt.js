const ROBOTS = `User-agent: *
Allow: /

Sitemap: https://raehat-al-furn.pages.dev/sitemap.xml
`;

export function onRequest() {
  return new Response(ROBOTS, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
