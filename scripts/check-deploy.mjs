import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import site from "../src/_data/site.js";

const TEXT = new Set([".html", ".xml", ".txt", ".css", ".svg", ".json"]);
const PAGES = ["index", "docs", "privacy", "support"];
const BADGE = "app-store-badge.svg";

function* files(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

export function checkDeployment(config = site, output = "_site") {
  const problems = [];
  const launch = Boolean(config.appStoreUrl) || config.indexable;
  const blocked = [
    [/\.invalid\b/i, "a placeholder address"],
    [/\[(?:developer name|effective date)\]/i, "a developer or policy-date placeholder"],
    [/HUMAN-INPUT/i, "a HUMAN-INPUT marker"],
  ];
  const launchBlocked = [
    [/class=["'][^"']*\bnotice\b[^"']*["']/i, "a draft notice; approve the policy before removing draft: true"],
    [/\b(?:coming soon|TBD|TODO|FIXME|lorem ipsum|internal beta|available after App Store approval)\b/i, "unfinished launch copy"],
    [/Screenshot (?:needed|placeholder):/i, "a missing product capture"],
  ];
  if (config.indexable && !config.appStoreUrl) problems.push("src/_data/site.js: launch needs the real appStoreUrl");
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
    const patterns = launch && extname(file) === ".html" ? [...blocked, ...launchBlocked] : blocked;
    for (const [pattern, meaning] of patterns) {
      if (pattern.test(text)) problems.push(`${file}: ${meaning}`);
    }
  }
  const read = (file) => readFileSync(join(output, file), "utf8");
  const home = read("index.html");
  const badgeLinks = [...home.matchAll(/<a\b[^>]*class="app-store-badge"[^>]*href="([^"]+)"/g)];
  const badgeImages = [...home.matchAll(/<img\b[^>]*src="[^"]*\/app-store-badge\.svg"/g)];
  if (config.appStoreUrl && (badgeLinks.length !== 1 || badgeLinks[0][1].replace(/&amp;/g, "&") !== config.appStoreUrl ||
    badgeImages.length !== 1 || !existsSync(join(output, BADGE)))) {
    problems.push("index.html: needs one official primary badge linked to the configured App Store URL");
  }
  if (!config.appStoreUrl && (badgeLinks.length || badgeImages.length)) {
    problems.push("index.html: a download badge is visible without an App Store URL");
  }
  const robots = read("robots.txt");
  for (const page of PAGES) {
    const html = read(`${page}.html`);
    const noindex = /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
    if (config.indexable && noindex) problems.push(`${page}.html: an indexable page is still noindex`);
    if (!config.indexable && !noindex) problems.push(`${page}.html: pages must remain noindex when indexable is false`);
    const canonical = `${config.url}/${page === "index" ? "" : page}`;
    if (launch && !html.includes(`<link rel="canonical" href="${canonical}">`)) {
      problems.push(`${page}.html: canonical URL must be ${canonical}`);
    }
  }
  if (config.indexable) {
    if (!robots.includes(`Sitemap: ${config.url}/sitemap.xml`) || blocksEveryone(robots)) {
      problems.push("robots.txt: launch must allow crawling and advertise the canonical sitemap");
    }
    if (!existsSync(join(output, "sitemap.xml"))) problems.push("sitemap.xml: missing from launch build");
    else {
      const locations = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
      const expected = PAGES.map((page) => `${config.url}/${page === "index" ? "" : page}`).sort();
      if (JSON.stringify(locations) !== JSON.stringify(expected)) problems.push("sitemap.xml: must list exactly the four public canonical pages, without drafts or the 404");
    }
  } else {
    if (/^Sitemap:/im.test(robots) || existsSync(join(output, "sitemap.xml"))) {
      problems.push("non-indexable build: unexpected sitemap; remove stale build output and rebuild with indexable: false");
    }
  }
  return problems;
}

// Machine-readable metadata: every public page describes itself, and the crawler-facing files exist only at launch.
export function checkMetadata(config = site, output = "_site") {
  const problems = [];
  const read = (file) => readFileSync(join(output, file), "utf8");
  const meta = (html, attribute, name) => html.match(new RegExp(`<meta\\b[^>]*${attribute}="${name}"[^>]*content="([^"]*)"`, "i"))?.[1];
  const titles = new Map();
  const descriptions = new Map();
  for (const page of PAGES) {
    const file = `${page}.html`;
    const html = read(file);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
    const description = meta(html, "name", "description")?.trim();
    if (!/<html lang="en">/.test(html)) problems.push(`${file}: needs <html lang="en">`);
    if (!title) problems.push(`${file}: missing title`);
    else if (titles.has(title)) problems.push(`${file}: title duplicates ${titles.get(title)}`);
    else titles.set(title, file);
    if (!description || description.length < 40 || description.length > 320) problems.push(`${file}: needs a meta description of 40 to 320 characters`);
    else if (descriptions.has(description)) problems.push(`${file}: description duplicates ${descriptions.get(description)}`);
    else descriptions.set(description, file);
    for (const [attribute, name] of [["property", "og:title"], ["property", "og:description"], ["property", "og:url"], ["property", "og:image"], ["name", "twitter:card"], ["name", "twitter:title"], ["name", "twitter:description"]]) {
      if (!meta(html, attribute, name)) problems.push(`${file}: missing ${name}`);
    }
    if (!/<link rel="canonical" href="[^"]+">/.test(html)) problems.push(`${file}: missing canonical link`);
    const blocks = [...html.matchAll(/<script\b[^>]*>/g)].map((match) => match[0]);
    const describedby = /<link rel="describedby" href="[^"]*\/llms\.txt" type="text\/markdown">/.test(html);
    if (!config.indexable) {
      if (blocks.length || describedby) problems.push(`${file}: crawler-facing metadata (JSON-LD or the llms.txt link) must wait for launch`);
    } else {
      if (!describedby) problems.push(`${file}: launch pages must link llms.txt with rel="describedby"`);
      const expected = page === "index" ? 1 : 0;
      if (blocks.length !== expected || blocks.some((tag) => !/type="application\/ld\+json"/.test(tag))) {
        problems.push(`${file}: expected ${expected} JSON-LD block and no other script`);
      }
    }
  }
  const llms = existsSync(join(output, "llms.txt")) ? read("llms.txt") : null;
  if (!config.indexable) {
    if (llms !== null) problems.push("llms.txt: must not be published until launch");
    return problems;
  }
  if (llms === null) problems.push("llms.txt: missing from launch build");
  else {
    if (!llms.startsWith("# Twine\n")) problems.push('llms.txt: must start with the "# Twine" heading');
    if (!/^> .+/m.test(llms)) problems.push("llms.txt: needs a summary blockquote");
    for (const page of PAGES) {
      const url = `${config.url}/${page === "index" ? "" : page}`;
      if (!llms.includes(`](${url})`)) problems.push(`llms.txt: must link ${url}`);
    }
    for (const [, url] of llms.matchAll(/\]\((https?:[^)]+)\)/g)) {
      if (!url.startsWith(config.url) && url !== config.feedbackUrl) problems.push(`llms.txt: unexpected link ${url}`);
    }
  }
  const match = read("index.html").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let data;
  try {
    data = JSON.parse(match?.[1] ?? "");
  } catch {
    problems.push("index.html: JSON-LD is missing or is not valid JSON");
    return problems;
  }
  const graph = data["@graph"] ?? [];
  const types = graph.map((node) => node["@type"]).sort().join(",");
  if (data["@context"] !== "https://schema.org" || types !== "Person,SoftwareApplication,WebSite") {
    problems.push("index.html: JSON-LD must be a schema.org graph of WebSite, Person and SoftwareApplication");
  }
  const text = JSON.stringify(data);
  if (/aggregateRating|ratingValue|"review"|ratingCount/i.test(text)) problems.push("index.html: JSON-LD must not contain ratings or reviews");
  const application = graph.find((node) => node["@type"] === "SoftwareApplication") ?? {};
  if (Boolean(config.appStoreUrl) !== Boolean(application.downloadUrl || application.offers)) {
    problems.push("index.html: JSON-LD downloadUrl and offers belong only to a build with a real appStoreUrl");
  }
  if (application.downloadUrl && application.downloadUrl !== config.appStoreUrl) problems.push("index.html: JSON-LD downloadUrl must match appStoreUrl");
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const problems = [...checkDeployment(), ...checkMetadata()];
    if (problems.length) {
      console.error("Not publishing: the built site has unresolved launch requirements.\n");
      for (const problem of problems) console.error(`  ${problem}`);
      process.exitCode = 1;
    } else if (site.indexable) console.log("Launch build: download, policy and indexing checks passed.");
    else console.log(site.appStoreUrl ? "Download-ready build: launch checks passed; search indexing remains off." : "Staged build: downloads disabled; search indexing remains off.");
  } catch (error) {
    console.error(`Can't check _site. Run "npm run build" first. (${error.message})`);
    process.exitCode = 1;
  }
}

// True when the group for every crawler (User-agent: *) disallows the whole site. Groups for named
// crawlers, such as the AI training opt-outs, may disallow everything without blocking search.
function blocksEveryone(robots) {
  let agents = [];
  let inRules = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [field, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (/^user-agent$/i.test(field.trim())) {
      if (inRules) { agents = []; inRules = false; }
      agents.push(value);
    } else {
      inRules = true;
      if (/^disallow$/i.test(field.trim()) && value === "/" && agents.includes("*")) return true;
    }
  }
  return false;
}
