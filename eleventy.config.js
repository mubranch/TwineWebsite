import { existsSync } from "node:fs";
import { HtmlBasePlugin } from "@11ty/eleventy";
import site from "./src/_data/site.js";

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// The site is served from site.url. Its path prefixes every link: "/TwineWebsite/" on github.io, "/" on a domain of its own.
const pathPrefix = new URL(site.url).pathname.replace(/\/?$/, "/");

// The file for a screenshot name, once someone has added it.
const imageFile = (name, directory = "images") =>
  ["webp", "png", "jpg"].map((type) => `${name}.${type}`).find((file) => existsSync(`src/static/${directory}/${file}`));

const responsiveSet = (file, width, directory = "images") => {
  if (!width) return `/${directory}/${file}`;
  const name = file.replace(/\.[^.]+$/, "");
  const variants = [480, 960, 1440].filter((size) => size < width)
    .map((size) => {
      const variant = imageFile(`${name}-${size}`, directory);
      return variant && `/${directory}/${variant} ${size}w`;
    }).filter(Boolean);
  return [...variants, `/${directory}/${file} ${width}w`].join(", ");
};

const bezels = {
  phone: { name: "bezel-iphone-18-pro", width: 1350, height: 2760, screenWidth: 1206, screenHeight: 2622 },
  duo: { name: "bezel-iphone-duo", width: 3093, height: 2247, screenWidth: 2853, screenHeight: 2007 },
  mac: { name: "bezel-macbook-air-m5", width: 3400, height: 2240, screenWidth: 2560, screenHeight: 1664 },
};

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

  // Full-resolution captures and smaller lossless encodings share the same base name.
  eleventyConfig.addShortcode("shot", (name, shape, alt, needs, eager = false, caption = "", width, height) => {
    const file = imageFile(`${name}-light`) || imageFile(name);
    const credit = caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "";
    const bezel = file && bezels[shape];
    // The owner approved a 0.46875% height correction for these existing Mac captures only.
    const approvedMacFit = shape === "mac" && ["hero", "capture"].includes(name) && width === 1960 && height === 1280;
    if (bezel && (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 ||
      (!approvedMacFit && Math.abs(height * bezel.screenWidth / width - bezel.screenHeight) > 0.5))) {
      throw new Error(`Screenshot ${name} needs dimensions matching the official ${shape} screen; provide a new capture instead of cropping or stretching it.`);
    }
    const loading = eager ? 'fetchpriority="high"' : 'loading="lazy"';
    const figureSizes = eager ? "min(66rem, 100vw - 2 * clamp(1.25rem, 4vw, 2.5rem))"
      : shape === "phone" ? "min(19rem, 100vw - 2.5rem)"
      : shape === "duo" ? "(max-width: 384px) 100vw, (max-width: 24em) 100vw, (max-width: 52em) 92vw, 39.375rem"
      : "(max-width: 52em) 92vw, 39.375rem";
    const deviceSources = bezel && responsiveSet(`${bezel.name}.webp`, bezel.width, "devices");
    const artwork = bezel ? `<picture class="device-art">${shape === "mac" ? `<source media="(min-width: 400px) and (min-width: 25em)" srcset="${deviceSources}" sizes="${figureSizes}">` : ""}<img src="/devices/${shape === "mac" ? "transparent" : bezel.name}.webp"${shape === "mac" ? "" : ` srcset="${deviceSources}" sizes="${figureSizes}"`} width="${bezel.width}" height="${bezel.height}" alt="" ${loading} decoding="async"></picture>` : "";
    const frame = (screen) => `<figure class="shot shot-${shape}"><div class="device device-${shape}${bezel ? " device-render" : ""}">${screen}${artwork}</div>${credit}</figure>`;
    if (!file) {
      return frame(`<div class="shot-screen shot-placeholder" role="img" aria-label="Screenshot placeholder: ${escapeHtml(needs)}"><p><strong>Screenshot needed: ${escapeHtml(name)}</strong>${escapeHtml(needs)}</p></div>`);
    }
    const dark = imageFile(`${name}-dark`);
    const mobile = imageFile(`${name}-mobile-light`) || imageFile(`${name}-mobile`);
    const mobileDark = imageFile(`${name}-mobile-dark`);
    const sizes = shape === "mac" ? `(max-width: 400px) 92vw, (max-width: 25em) 92vw, ${eager ? "min(49.7rem, 70vw)" : "(max-width: 52em) 70vw, 29.65rem"}`
      : shape === "window" ? "(max-width: 52em) 92vw, 30rem" : figureSizes;
    const sources = [
      mobileDark && `<source media="(max-width: 40em) and (prefers-color-scheme: dark)" srcset="/images/${mobileDark}">`,
      dark && `<source media="(prefers-color-scheme: dark)" srcset="${responsiveSet(dark, width)}" sizes="${sizes}">`,
      mobile && `<source media="(max-width: 40em)" srcset="/images/${mobile}">`,
    ].filter(Boolean).join("");
    const dimensions = width && height ? ` width="${width}" height="${height}"` : "";
    const image = `<img src="/images/${file}" srcset="${responsiveSet(file, width)}" sizes="${sizes}" alt="${escapeHtml(alt)}"${dimensions} ${loading} decoding="async">`;
    const picture = `<picture>${sources}${image}</picture>`;
    return frame(`<div class="shot-screen shot-populated">${picture}</div>`);
  });

  return {
    pathPrefix,
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
