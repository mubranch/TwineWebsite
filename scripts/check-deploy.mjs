import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import site from "../src/_data/site.js";

const TEXT = new Set([".html", ".xml", ".txt", ".css", ".svg", ".json"]);
const PAGES = ["index", "docs", "privacy", "support"];
const BADGE = "mac-app-store-badge.svg";

function* files(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

export function checkDeployment(config = site, output = "_site") {
  const problems = [];
  const blocked = [
    [/\.invalid\b/i, "a placeholder address"],
    [/\[(?:developer name|effective date)\]/i, "a developer or policy-date placeholder"],
    [/HUMAN-INPUT/i, "a HUMAN-INPUT marker"],
  ];
  const launchBlocked = [
    [/class=["'][^"']*\bnotice\b[^"']*["']/i, "a draft notice; approve the policy before removing draft: true"],
    [/\b(?:coming soon|TBD|TODO|FIXME|lorem ipsum|internal beta)\b/i, "unfinished launch copy"],
    [/Screenshot (?:needed|placeholder):/i, "a missing product capture"],
  ];
  if (config.indexable) {
    if (!config.appStoreUrl) problems.push("src/_data/site.js: launch needs the real appStoreUrl");
  } else if (config.appStoreUrl) {
    problems.push("src/_data/site.js: appStoreUrl is set but the reviewed launch activation is missing (indexable is false)");
  }
  if (config.appStoreUrl) {
    let valid = false;
    try {
      const url = new URL(config.appStoreUrl);
      valid = url.protocol === "https:" && url.hostname === "apps.apple.com" && !url.port &&
        !url.username && !url.password && !/[<>"'\s]/.test(config.appStoreUrl) &&
        /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?app\/(?:[^/]+\/)?id[1-9]\d{5,19}\/?$/i.test(url.pathname);
    } catch {
      valid = false;
    }
    if (!valid) problems.push("src/_data/site.js: appStoreUrl must be an HTTPS apps.apple.com product URL");
  }
  for (const file of files(output)) {
    if (!TEXT.has(extname(file))) continue;
    const text = readFileSync(file, "utf8");
    const patterns = config.indexable && extname(file) === ".html" ? [...blocked, ...launchBlocked] : blocked;
    for (const [pattern, meaning] of patterns) {
      if (pattern.test(text)) problems.push(`${file}: ${meaning}`);
    }
  }
  const read = (file) => readFileSync(join(output, file), "utf8");
  const home = read("index.html");
  const badgeLinks = [...home.matchAll(/<a\b[^>]*class="app-store-badge"[^>]*href="([^"]+)"/g)];
  const badgeImages = [...home.matchAll(/<img\b[^>]*src="[^"]*\/mac-app-store-badge\.svg"/g)];
  if (config.appStoreUrl && (badgeLinks.length !== 1 || badgeLinks[0][1].replace(/&amp;/g, "&") !== config.appStoreUrl ||
    badgeImages.length !== 1 || !existsSync(join(output, BADGE)))) {
    problems.push("index.html: needs one official primary badge linked to the configured App Store URL");
  }
  if (!config.appStoreUrl && (badgeLinks.length || badgeImages.length)) {
    problems.push("index.html: a download badge is visible without an App Store URL");
  }
  const robots = read("robots.txt");
  if (config.indexable) {
    for (const page of PAGES) {
      const html = read(`${page}.html`);
      if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) {
        problems.push(`${page}.html: a launch page is still noindex`);
      }
      const canonical = `${config.url}/${page === "index" ? "" : page}`;
      if (!html.includes(`<link rel="canonical" href="${canonical}">`)) {
        problems.push(`${page}.html: canonical URL must be ${canonical}`);
      }
    }
    if (!robots.includes(`Sitemap: ${config.url}/sitemap.xml`) || /^Disallow:\s*\/\s*$/im.test(robots)) {
      problems.push("robots.txt: launch must allow crawling and advertise the canonical sitemap");
    }
    if (!existsSync(join(output, "sitemap.xml"))) problems.push("sitemap.xml: missing from launch build");
    else {
      const locations = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
      const expected = PAGES.map((page) => `${config.url}/${page === "index" ? "" : page}`).sort();
      if (JSON.stringify(locations) !== JSON.stringify(expected)) problems.push("sitemap.xml: must list exactly the four public canonical pages, without drafts or the 404");
    }
  } else {
    for (const page of PAGES) {
      if (!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(read(`${page}.html`))) {
        problems.push(`${page}.html: prelaunch pages must remain noindex`);
      }
    }
    if (/^Sitemap:/im.test(robots) || existsSync(join(output, "sitemap.xml"))) {
      problems.push("prelaunch build: unexpected sitemap; remove stale build output and rebuild with indexable: false");
    }
  }
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const problems = checkDeployment();
    if (problems.length) {
      console.error("Not publishing: the built site has unresolved launch requirements.\n");
      for (const problem of problems) console.error(`  ${problem}`);
      process.exitCode = 1;
    } else console.log(site.indexable ? "Launch build: download, policy and indexing checks passed." : "Prelaunch build: download remains disabled; a noindex draft policy is allowed.");
  } catch (error) {
    console.error(`Can't check _site. Run "npm run build" first. (${error.message})`);
    process.exitCode = 1;
  }
}
