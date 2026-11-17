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

test("screenshot slots preserve captures in official renders and select one responsive appearance", () => {
  const original = process.cwd();
  const directory = mkdtempSync(join(tmpdir(), "twine-shots-"));
  try {
    process.chdir(directory);
    mkdirSync("src/static/images", { recursive: true });

    const missing = shot("context", "phone", "Details", 'Show the source & "Open in Safari".', false, "iPhone · Details");
    assert.match(missing, /class="shot shot-phone"/);
    assert.match(missing, /class="device device-phone"/);
    assert.doesNotMatch(missing, /device-camera|device-base|device-art/);
    assert.match(missing, /class="shot-screen shot-placeholder" role="img"/);
    assert.match(missing, /Screenshot needed: context/);
    assert.match(missing, /source &amp; &quot;Open in Safari&quot;/);
    assert.match(missing, /<figcaption>iPhone · Details<\/figcaption>/);
    assert.doesNotMatch(missing, /<img/);

    // Only file discovery is under test; these aren't product images.
    writeFileSync("src/static/images/context.png", "");
    const context = shot("context", "phone", 'Details & "sources"', "", false, "iPhone · Context", 1206, 2622);
    assert.match(context, /src="\/images\/context.png"/);
    assert.match(context, /alt="Details &amp; &quot;sources&quot;"/);
    assert.match(context, /loading="lazy"/);
    assert.match(context, /class="device device-phone device-render"/);
    assert.match(context, /bezel-iphone-18-pro.webp/);
    assert.match(context, /width="1350" height="2760" alt=""/);
    assert.doesNotMatch(context, /shot-placeholder/);
    assert.throws(() => shot("context", "phone", "", "", false, "", 1000, 1000), /provide a new capture/);
    assert.throws(() => shot("context", "phone", "", ""), /needs dimensions/);
    assert.match(shot("library-duo", "duo", "", "Details"), /shot-placeholder/);

    writeFileSync("src/static/images/library-duo-light.png", "");
    writeFileSync("src/static/images/library-duo-dark.png", "");
    const duo = shot("library-duo", "duo", "Library and details", "", false, "Duo", 2000, 1407);
    assert.match(duo, /class="device device-duo device-render"/);
    assert.match(duo, /width="2000" height="1407"/);
    assert.equal((duo.match(/alt="Library and details"/g) || []).length, 1);
    assert.equal((duo.match(/<img /g) || []).length, 2, "One capture and one decorative bezel, not two capture panels");
    assert.match(duo, /srcset="\/images\/library-duo-dark.png 2000w"/);
    assert.match(duo, /bezel-iphone-duo.webp/);
    assert.doesNotMatch(duo, /device-phone|device-camera|device-base/);
    assert.throws(() => shot("library-duo", "duo", "", "", false, "", 2000, 1408), /provide a new capture/);

    writeFileSync("src/static/images/hero.webp", "");
    writeFileSync("src/static/images/hero-mobile.png", "");
    const hero = shot("hero", "mac", "Mac library", "", true, "macOS <Library>", 1960, 1280);
    assert.match(hero, /class="shot shot-mac"/);
    assert.match(hero, /class="device device-mac device-render"/);
    assert.match(hero, /class="shot-screen shot-populated"/);
    assert.match(hero, /<picture><source media="\(max-width: 40em\)" srcset="\/images\/hero-mobile.png">/);
    assert.match(hero, /src="\/images\/hero.webp" srcset="\/images\/hero.webp 1960w"/);
    assert.match(hero, /fetchpriority="high"/);
    assert.match(hero, /width="1960" height="1280"/);
    assert.doesNotMatch(hero, /loading="lazy"/);
    assert.match(hero, /<figcaption>macOS &lt;Library><\/figcaption>/);
    assert.match(hero, /<source media="\(min-width: 400px\) and \(min-width: 25em\)" srcset="\/devices\/bezel-macbook-air-m5.webp 3400w"/);
    assert.match(hero, /src="\/devices\/transparent.webp"/);
    assert.doesNotMatch(hero, /device-camera|device-base/);
    assert.throws(() => shot("hero", "mac", "", "", true, "", 1960, 1200), /provide a new capture/);
    assert.throws(() => shot("hero", "mac", "", "", true, "", 2560, 1600), /provide a new capture/);
    assert.doesNotThrow(() => shot("hero", "mac", "", "", true, "", 1856, 1214));
    assert.doesNotThrow(() => shot("capture", "mac", "", "", false, "", 2000, 1299));
    assert.throws(() => shot("capture", "mac", "", "", false, "", 1856, 1214), /provide a new capture/);
    const settings = shot("hero", "window", "Mac settings", "");
    assert.match(settings, /class="device device-window"/);
    assert.doesNotMatch(settings, /device-camera|device-base/);

    writeFileSync("src/static/images/hero-light.png", "");
    writeFileSync("src/static/images/hero-dark.png", "");
    const themed = shot("hero", "mac", "Mac library", "", false, "", 1960, 1280);
    assert.match(themed, /<img src="\/images\/hero-light.png"/);
    assert.match(themed, /<source media="\(prefers-color-scheme: dark\)" srcset="\/images\/hero-dark.png 1960w"/);
    assert.ok(themed.indexOf("hero-dark.png") < themed.indexOf("hero-mobile.png"), "Dark desktop capture must precede a light-only mobile crop");

    writeFileSync("src/static/images/capture-light.png", "");
    writeFileSync("src/static/images/capture-dark.png", "");
    const capture = shot("capture", "mac", "Twine library and selected passage", "A Mac library capture", false, "Mac · Your library, organized by source", 1960, 1280);
    assert.match(capture, /class="device device-mac device-render"/);
    assert.match(capture, /loading="lazy"/);
    assert.match(capture, /src="\/images\/capture-light.png"/);
    assert.match(capture, /srcset="\/images\/capture-dark.png 1960w"/);
    assert.match(capture, /<figcaption>Mac · Your library, organized by source<\/figcaption>/);

    writeFileSync("src/static/images/hero-mobile-light.png", "");
    writeFileSync("src/static/images/hero-mobile-dark.webp", "");
    const themedMobile = shot("hero", "mac", "Mac library", "", false, "", 1960, 1280);
    assert.match(themedMobile, /<source media="\(max-width: 40em\) and \(prefers-color-scheme: dark\)" srcset="\/images\/hero-mobile-dark.webp">/);
    assert.ok(themedMobile.indexOf("hero-mobile-dark.webp") < themedMobile.indexOf("hero-dark.png"));
    assert.match(themedMobile, /<source media="\(max-width: 40em\)" srcset="\/images\/hero-mobile-light.png">/);

    writeFileSync("src/static/images/hero-light.webp", "");
    writeFileSync("src/static/images/hero-light-480.webp", "");
    writeFileSync("src/static/images/hero-light-960.webp", "");
    const responsive = shot("hero", "mac", "Mac library", "", true, "", 1960, 1280);
    assert.match(responsive, /src="\/images\/hero-light.webp" srcset="\/images\/hero-light-480.webp 480w, \/images\/hero-light-960.webp 960w, \/images\/hero-light.webp 1960w"/);
    assert.doesNotMatch(responsive, /hero-light.png|hero-light-1440/);

    writeFileSync("src/static/images/hero-light.webp", "");
    writeFileSync("src/static/images/hero-dark.webp", "");
    const browserHero = shot("hero", "mac", "Safari with Twine highlights", "Apple Developer documentation capture", true, "Mac · Highlighted page in Safari", 2560, 1664);
    assert.match(browserHero, /class="device device-mac device-render"/);
    assert.match(browserHero, /fetchpriority="high"/);
    assert.match(browserHero, /src="\/images\/hero-light.webp"/);
    assert.match(browserHero, /srcset="\/images\/hero-dark.webp 2560w"/);
    assert.match(browserHero, /width="2560" height="1664"/);
    assert.match(browserHero, /<figcaption>Mac · Highlighted page in Safari<\/figcaption>/);
  } finally {
    process.chdir(original);
    rmSync(directory, { recursive: true, force: true });
  }
});
