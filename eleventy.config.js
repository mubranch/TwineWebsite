import { existsSync } from "node:fs";
import { HtmlBasePlugin } from "@11ty/eleventy";
import site from "./src/_data/site.js";

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// The site is served from site.url. Its path prefixes every link: "/TwineWebsite/" on github.io, "/" on a domain of its own.
const pathPrefix = new URL(site.url).pathname.replace(/\/?$/, "/");

// The file for a screenshot name, once someone has added it.
const imageFile = (name) =>
  ["webp", "png", "jpg"].map((type) => `${name}.${type}`).find((file) => existsSync(`src/static/images/${file}`));

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Markdown headings get an id made from their text, so pages can link to a section.
  eleventyConfig.amendLibrary("md", (md) => {
    md.core.ruler.push("heading_ids", ({ tokens }) => {
      tokens.forEach((token, index) => {
        if (token.type !== "heading_open") return;
        const text = tokens[index + 1].children.map((child) => child.content).join("");
        token.attrSet("id", text.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
      });
    });
  });

  // {% shot "name", "mac" or "phone", "alt text", "capture brief", eager, "caption" %}
  // Shows src/static/images/<name>.webp, .png or .jpg once it exists (and <name>-mobile.* on small screens),
  // and a labelled placeholder until then.
  eleventyConfig.addShortcode("shot", (name, shape, alt, needs, eager = false, caption = "") => {
    const file = imageFile(name);
    const credit = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
    if (!file) {
      return `<figure class="shot shot-${shape}"><div class="shot-screen shot-placeholder" role="img" aria-label="Screenshot placeholder: ${escapeHtml(needs)}"><p><strong>Screenshot needed: ${escapeHtml(name)}</strong>${escapeHtml(needs)}</p></div>${credit}</figure>`;
    }
    const mobile = imageFile(`${name}-mobile`);
    const image = `<img src="/images/${file}" alt="${escapeHtml(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    const picture = mobile ? `<picture><source media="(max-width: 40em)" srcset="/images/${mobile}">${image}</picture>` : image;
    return `<figure class="shot shot-${shape}${mobile ? " shot-has-mobile" : ""}"><div class="shot-screen">${picture}</div>${credit}</figure>`;
  });

  return {
    pathPrefix,
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
