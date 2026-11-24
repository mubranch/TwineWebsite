import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { checkDeployment, checkMetadata } from "./check-deploy.mjs";
import site from "../src/_data/site.js";

const store = "https://apps.apple.com/app/xcode/id497799835";

// Builds the real site in a temporary copy with launch switches set only there.
function build(settings, run) {
  const directory = mkdtempSync(join(tmpdir(), "twine-meta-"));
  try {
    for (const path of ["src", "package.json", "eleventy.config.js"]) cpSync(path, join(directory, path), { recursive: true });
    symlinkSync(resolve("node_modules"), join(directory, "node_modules"), "dir");
    const data = join(directory, "src/_data/site.js");
    let source = readFileSync(data, "utf8");
    for (const [key, value] of Object.entries(settings)) {
      source = source.replace(new RegExp(`${key}: (?:"[^"]*"|true|false)`), `${key}: ${JSON.stringify(value)}`);
    }
    writeFileSync(data, source);
    execFileSync(process.execPath, [join(process.cwd(), "node_modules/@11ty/eleventy/cmd.cjs"), "--quiet"], { cwd: directory });
    run(join(directory, "_site"), { ...site, ...settings });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("a staged build has complete page metadata and publishes nothing for crawlers", () => {
  build({ indexable: false, appStoreUrl: "" }, (output, config) => {
    assert.deepEqual(checkMetadata(config, output), []);
    const home = readFileSync(join(output, "index.html"), "utf8");
    assert.doesNotMatch(home, /<script|describedby/);
    assert.throws(() => readFileSync(join(output, "llms.txt")), /ENOENT/);
  });
});

test("a launch build adds llms.txt, a describedby link and valid JSON-LD without ratings or invented facts", () => {
  build({ indexable: true, appStoreUrl: store }, (output, config) => {
    assert.deepEqual(checkMetadata(config, output), []);
    assert.deepEqual(checkDeployment(config, output), []);
    const llms = readFileSync(join(output, "llms.txt"), "utf8");
    assert.match(llms, /^# Twine\n\n> /);
    assert.match(llms, /Safari only|Safari only,/);
    assert.match(llms, /developer has no access/);
    const home = readFileSync(join(output, "index.html"), "utf8");
    const data = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const app = data["@graph"].find((node) => node["@type"] === "SoftwareApplication");
    assert.equal(app.downloadUrl, store);
    assert.deepEqual(app.offers, { "@type": "Offer", price: "0", priceCurrency: "USD" });
    assert.doesNotMatch(JSON.stringify(data), /aggregateRating|ratingValue|review/i);
    for (const page of ["docs", "privacy", "support"]) {
      assert.doesNotMatch(readFileSync(join(output, `${page}.html`), "utf8"), /ld\+json/);
    }
  });
});

test("the metadata check fails loudly when structured data or crawler files are wrong", () => {
  build({ indexable: true, appStoreUrl: store }, (output, config) => {
    const home = join(output, "index.html");
    const original = readFileSync(home, "utf8");
    writeFileSync(home, original.replace('"@type": "Offer"', '"aggregateRating": {"ratingValue": 5}, "@type": "Offer"'));
    assert.ok(checkMetadata(config, output).some((problem) => /ratings or reviews/.test(problem)));
    writeFileSync(home, original.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">{oops</script>'));
    assert.ok(checkMetadata(config, output).some((problem) => /not valid JSON/.test(problem)));
    writeFileSync(home, original);
    writeFileSync(join(output, "llms.txt"), "Twine\n");
    assert.ok(checkMetadata(config, output).some((problem) => /"# Twine" heading/.test(problem)));
    assert.ok(checkMetadata({ ...config, appStoreUrl: "" }, output).some((problem) => /downloadUrl and offers/.test(problem)));
  });
  build({ indexable: false, appStoreUrl: "" }, (output, config) => {
    writeFileSync(join(output, "llms.txt"), "# Twine\n");
    assert.ok(checkMetadata(config, output).some((problem) => /must not be published until launch/.test(problem)));
    const docs = join(output, "docs.html");
    writeFileSync(docs, readFileSync(docs, "utf8").replace("</head>", '<script type="application/ld+json">{}</script></head>'));
    assert.ok(checkMetadata(config, output).some((problem) => /must wait for launch/.test(problem)));
  });
});

test("every page has a unique title and description that names Twine and Safari", () => {
  build({}, (output) => {
    const seen = new Set();
    for (const page of ["index", "docs", "privacy", "support"]) {
      const html = readFileSync(join(output, `${page}.html`), "utf8");
      const title = html.match(/<title>([^<]+)<\/title>/)[1];
      assert.match(title, /Twine/);
      assert.match(title, /Safari/);
      assert.ok(!seen.has(title), `duplicate title ${title}`);
      seen.add(title);
    }
  });
});
