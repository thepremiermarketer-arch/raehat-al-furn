const SITE = "https://raehat-al-furn.pages.dev";

const RECIPES = {
  "recipe-apple-puff.html": {
    name: "باف باستري بالتفاح والقرفة",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apple_pie_with_puff_pastry.jpg",
  },
  "recipe-vanilla-cake.html": {
    name: "كيكة الفانيليا المنزلية",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Vanilla_Cake.jpg",
  },
  "recipe-cheese-pies.html": {
    name: "فطائر الجبن السريعة",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mugabbana_Cheese_Pies.jpg",
  },
  "recipe-4.html": {
    name: "خبز منزلي طري",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Homemade_bread.jpg",
  },
  "recipe-roasted-potatoes.html": {
    name: "بطاطس بالفرن",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Roasted_potatoes.jpg",
  },
  "recipe-6.html": {
    name: "دجاج بالفرن بالخضار",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Baked_chicken_and_veggies.jpg",
  },
  "recipe-7.html": {
    name: "فطيرة التفاح السهلة",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apple_pie.jpg",
  },
  "recipe-8.html": {
    name: "مكرونة بالصلصة الكريمية",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pasta_with_cream_sauce_bacon_and_mushroom.jpg",
  },
  "recipe-9.html": {
    name: "كرواسون منزلي مبسط",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Croissant.jpg",
  },
  "recipe-10.html": {
    name: "كوكيز الشوكولاتة",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chocolate_chip_cookie.jpg",
  },
};

const HOME_IMAGES = [
  RECIPES["recipe-apple-puff.html"],
  RECIPES["recipe-vanilla-cake.html"],
  RECIPES["recipe-cheese-pies.html"],
  RECIPES["recipe-4.html"],
  RECIPES["recipe-roasted-potatoes.html"],
  RECIPES["recipe-6.html"],
  RECIPES["recipe-7.html"],
  RECIPES["recipe-8.html"],
  RECIPES["recipe-9.html"],
];

const LIST_IMAGES = [
  RECIPES["recipe-apple-puff.html"],
  RECIPES["recipe-vanilla-cake.html"],
  RECIPES["recipe-cheese-pies.html"],
  RECIPES["recipe-4.html"],
  RECIPES["recipe-roasted-potatoes.html"],
  RECIPES["recipe-6.html"],
  RECIPES["recipe-7.html"],
  RECIPES["recipe-8.html"],
  RECIPES["recipe-9.html"],
  RECIPES["recipe-10.html"],
];

function filename(pathname) {
  const value = pathname.split("/").filter(Boolean).pop();
  return value || "index.html";
}

function absoluteImage(path) {
  return /^https?:\/\//i.test(path) ? path : `${SITE}${path}`;
}

class JsonLdRecipeHandler {
  constructor(imageUrl, state) {
    this.imageUrl = imageUrl;
    this.state = state;
    this.buffer = "";
    this.isRecipeScript = false;
  }

  element(element) {
    if (this.state.recipeScriptSeen) {
      this.isRecipeScript = false;
      return;
    }
    this.isRecipeScript = true;
    this.state.recipeScriptSeen = true;
    this.buffer = "";
  }

  text(text) {
    if (!this.isRecipeScript) return;

    this.buffer += text.text;

    if (!text.lastInTextNode) {
      text.remove();
      return;
    }

    try {
      const data = JSON.parse(this.buffer);
      if (data && data["@type"] === "Recipe") {
        data.image = absoluteImage(this.imageUrl);
        text.replace(JSON.stringify(data));
      } else {
        text.replace(this.buffer);
      }
    } catch {
      text.replace(this.buffer);
    }

    this.buffer = "";
    this.isRecipeScript = false;
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const file = filename(url.pathname);

  const response = await env.ASSETS.fetch(request);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    return response;
  }

  const recipe = RECIPES[file];
  const isHome = file === "index.html";
  const isRecipeList = file === "recipes.html";

  if (!recipe && !isHome && !isRecipeList) {
    return response;
  }

  const state = { recipeScriptSeen: false };
  const rewriter = new HTMLRewriter();

  if (recipe) {
    rewriter
      .on(".no-image", {
        element(element) {
          const imageUrl = absoluteImage(recipe.image);
          element.replace(
            `<img src="${imageUrl}" alt="${recipe.name}" class="recipe-cover" loading="eager" width="1200" height="800" style="display:block;width:100%;max-width:900px;aspect-ratio:3/2;object-fit:cover;border-radius:20px;margin:20px 0 28px;box-shadow:0 12px 30px rgba(70,45,28,.12)">`,
            { html: true },
          );
        },
      })
      .on("head", {
        element(element) {
          const imageUrl = absoluteImage(recipe.image);
          element.append(
            `<link rel="preload" as="image" href="${imageUrl}"><meta property="og:image" content="${imageUrl}"><meta property="og:image:alt" content="${recipe.name}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${imageUrl}">`,
            { html: true },
          );
        },
      })
      .on('script[type="application/ld+json"]', new JsonLdRecipeHandler(recipe.image, state));
  }

  if (isHome) {
    let index = 0;
    rewriter.on(".pic", {
      element(element) {
        const item = HOME_IMAGES[index++] || HOME_IMAGES[0];
        const imageUrl = absoluteImage(item.image);
        element.setInnerContent(
          `<img src="${imageUrl}" alt="${item.name}" loading="lazy" width="1200" height="800" style="width:100%;height:100%;object-fit:cover;display:block">`,
          { html: true },
        );
      },
    });
    rewriter.on("head", {
      element(element) {
        const imageUrl = absoluteImage(HOME_IMAGES[0].image);
        element.append(`<meta property="og:image" content="${imageUrl}">`, { html: true });
      },
    });
  }

  if (isRecipeList) {
    let index = 0;
    rewriter.on(".pic", {
      element(element) {
        const item = LIST_IMAGES[index++] || LIST_IMAGES[0];
        const imageUrl = absoluteImage(item.image);
        element.setInnerContent(
          `<img src="${imageUrl}" alt="${item.name}" loading="lazy" width="1200" height="800" style="width:100%;height:100%;object-fit:cover;display:block">`,
          { html: true },
        );
      },
    });
  }

  return rewriter.transform(response);
}
