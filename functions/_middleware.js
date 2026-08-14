const RECIPE_IMAGES = {
  "/recipe-apple-puff.html": ["/images/apple-puff.svg", "باف باستري بالتفاح والقرفة"],
  "/recipe-vanilla-cake.html": ["/images/vanilla-cake.svg", "كيكة الفانيليا المنزلية الهشة"],
  "/recipe-cheese-pies.html": ["/images/cheese-pies.svg", "فطائر الجبن السريعة في الفرن"],
  "/recipe-4.html": ["/images/home-bread.svg", "خبز منزلي طري"],
  "/recipe-roasted-potatoes.html": ["/images/roasted-potatoes.svg", "بطاطس بالفرن المقرمشة"],
  "/recipe-6.html": ["/images/roast-chicken.svg", "دجاج بالفرن بالخضار"],
  "/recipe-7.html": ["/images/apple-pie.svg", "فطيرة التفاح السهلة"],
  "/recipe-8.html": ["/images/creamy-pasta.svg", "مكرونة بالصلصة الكريمية"],
  "/recipe-9.html": ["/images/croissant.svg", "كرواسون منزلي مبسط"],
  "/recipe-10.html": ["/images/chocolate-cookies.svg", "كوكيز الشوكولاتة"],
};

const CSS = `<style>
.recipe-photo{display:block;max-width:920px;margin:24px auto 32px;border-radius:20px;overflow:hidden;background:#fffaf3;border:1px solid #eadbc9;box-shadow:0 12px 32px rgba(91,58,35,.12)}
.recipe-photo img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
@media(max-width:650px){.recipe-photo{margin:18px 0 24px;border-radius:15px}.recipe-photo img{aspect-ratio:4/3}}
</style>`;

class ImageHandler {
  constructor(src, alt) { this.src = src; this.alt = alt; }
  element(element) {
    element.replace(`<figure class="recipe-photo"><img src="${this.src}" alt="${this.alt}" width="1200" height="900" loading="eager" decoding="async"></figure>`, { html: true });
  }
}

class JsonLdHandler {
  constructor(imageUrl) { this.imageUrl = imageUrl; this.parts = []; }
  element(element) {
    element.onEndTag(() => {
      try {
        const data = JSON.parse(this.parts.join(""));
        if (data && (data["@type"] === "Recipe" || (Array.isArray(data["@type"]) && data["@type"].includes("Recipe")))) {
          data.image = [this.imageUrl];
          element.setInnerContent(JSON.stringify(data));
        }
      } catch (_) {}
      this.parts = [];
    });
  }
  text(text) { this.parts.push(text.text); }
}

export async function onRequest(context) {
  const response = await context.next();
  const url = new URL(context.request.url);
  const recipe = RECIPE_IMAGES[url.pathname];
  if (!recipe || !response.headers.get("content-type")?.includes("text/html")) return response;
  const imageUrl = new URL(recipe[0], url.origin).href;

  return new HTMLRewriter()
    .on("head", { element(element) {
      element.append(CSS, { html: true });
      element.append(`<meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${imageUrl}">`, { html: true });
    }})
    .on(".no-image", new ImageHandler(recipe[0], recipe[1]))
    .on('script[type="application/ld+json"]', new JsonLdHandler(imageUrl))
    .transform(response);
}
