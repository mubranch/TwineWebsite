// Fails the deployment while the built site still has placeholders or a draft page, so they can't go live by accident.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import site from "../src/_data/site.js";

const OUTPUT = "_site";
const TEXT = new Set([".html", ".xml", ".txt", ".css", ".svg", ".json"]);
const blocked = [
  [/\.invalid\b/, "a placeholder address (the email in src/_data/site.js)"],
  [/\[(?:developer name|effective date)\]/, "a placeholder (developer or policyDate in src/_data/site.js)"],
  [/HUMAN-INPUT/, "a HUMAN-INPUT marker"],
];
// A draft notice is fine while the whole site is noindex, but not once it can be indexed.
if (site.indexable) blocked.push([/class="notice"/, "a draft notice (delete draft: true from the page's front matter once it has been reviewed)"]);

function* files(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

const problems = [];
try {
  for (const file of files(OUTPUT)) {
    if (!TEXT.has(extname(file))) continue;
    const text = readFileSync(file, "utf8");
    for (const [pattern, meaning] of blocked) {
      if (pattern.test(text)) problems.push(`${file}: ${meaning}`);
    }
  }
} catch (error) {
  console.error(`Can't read ${OUTPUT}. Run "npm run build" first. (${error.message})`);
  process.exit(1);
}

if (problems.length) {
  console.error("Not publishing: the built site still has owner inputs to fill in.\n");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log("No placeholders or drafts in the built site.");
