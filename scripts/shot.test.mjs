import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import configure from "../eleventy.config.js";

let shot;
configure({
  addPlugin() {},
  addPassthroughCopy() {},
  amendLibrary() {},
  addShortcode(name, render) {
    if (name === "shot") shot = render;
  },
});

test("screenshot slots handle missing, paired and supplied captures", () => {
  const original = process.cwd();
  const directory = mkdtempSync(join(tmpdir(), "twine-shots-"));
  try {
    process.chdir(directory);
    mkdirSync("src/static/images", { recursive: true });

    const missing = shot("library-detail", "phone", "Details", 'Show the source & "Open in Safari".', false, "iPhone Duo · Details");
    assert.match(missing, /class="shot shot-phone"/);
    assert.match(missing, /class="shot-screen shot-placeholder" role="img"/);
    assert.match(missing, /Screenshot needed: library-detail/);
    assert.match(missing, /source &amp; &quot;Open in Safari&quot;/);
    assert.match(missing, /<figcaption>iPhone Duo · Details<\/figcaption>/);
    assert.doesNotMatch(missing, /<img/);

    // Only file discovery is under test; these aren't product images.
    writeFileSync("src/static/images/library.png", "");
    const library = shot("library", "phone", 'Library & "sources"', "", false, "iPhone Duo · Browse");
    assert.match(library, /src="\/images\/library.png"/);
    assert.match(library, /alt="Library &amp; &quot;sources&quot;"/);
    assert.match(library, /loading="lazy"/);
    assert.doesNotMatch(library, /shot-placeholder/);
    assert.match(shot("library-detail", "phone", "", "Details"), /shot-placeholder/);

    writeFileSync("src/static/images/hero.webp", "");
    writeFileSync("src/static/images/hero-mobile.png", "");
    const hero = shot("hero", "mac", "Mac library", "", true, "macOS <Library>");
    assert.match(hero, /class="shot shot-mac shot-has-mobile"/);
    assert.match(hero, /<picture><source media="\(max-width: 40em\)" srcset="\/images\/hero-mobile.png">/);
    assert.match(hero, /src="\/images\/hero.webp"/);
    assert.match(hero, /fetchpriority="high"/);
    assert.doesNotMatch(hero, /loading="lazy"/);
    assert.match(hero, /<figcaption>macOS &lt;Library><\/figcaption>/);
  } finally {
    process.chdir(original);
    rmSync(directory, { recursive: true, force: true });
  }
});
