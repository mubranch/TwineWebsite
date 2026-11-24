import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkDeployment } from "./check-deploy.mjs";
import site from "../src/_data/site.js";

// Apple's real Xcode product page is a URL-validation fixture, not Twine's launch URL.
const config = { ...site, indexable: true, appStoreUrl: "https://apps.apple.com/app/xcode/id497799835?mt=12&l=en" };

function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), "twine-launch-"));
  const write = (name, value) => writeFileSync(join(directory, name), value);
  const html = (page) => `<link rel="canonical" href="${site.url}/${page === "index" ? "" : page}">`;
  for (const page of ["index", "docs", "privacy", "support"]) write(`${page}.html`, html(page));
  const home = `${html("index")}<a class="app-store-badge" href="${config.appStoreUrl.replace(/&/g, "&amp;")}"><img src="/TwineWebsite/mac-app-store-badge.svg" alt=""></a>`;
  write("index.html", home);
  write("mac-app-store-badge.svg", "<svg></svg>");
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
  write("sitemap.xml", ["index", "docs", "privacy", "support"].map((page) => `<loc>${site.url}/${page === "index" ? "" : page}</loc>`).join("\n"));
  try {
    run({ directory, write, home, html });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("launch accepts a complete build and rejects unfinished copy or draft notices", () => {
  fixture(({ directory, write }) => {
    assert.deepEqual(checkDeployment(config, directory), []);
    write("site.css", '/* The Coming soon status is hidden at launch. */');
    assert.deepEqual(checkDeployment(config, directory), [], "CSS comments are not unfinished visible copy");
    for (const marker of ["HUMAN-INPUT", "TBD", "TODO", "Lorem ipsum", "Coming soon", "internal beta", "Available after App Store approval.", "Screenshot needed: hero", 'class="notice"', "https://example.invalid/privacy", "[effective date]"]) {
      write("privacy.html", `<link rel="canonical" href="${site.url}/privacy">${marker}`);
      assert.ok(checkDeployment(config, directory).length, `Must reject ${marker}`);
    }
  });
});

test("launch rejects invalid store URLs and stale or missing indexing output", () => {
  fixture(({ directory, write, home }) => {
    for (const appStoreUrl of ["", "http://apps.apple.com/app/id497799835", "https://example.com/app/id497799835", "https://apps.apple.com/", "not a URL"]) {
      assert.ok(checkDeployment({ ...config, appStoreUrl }, directory).length, appStoreUrl);
    }
    write("index.html", `${home}<meta name="robots" content="noindex">`);
    assert.match(checkDeployment(config, directory).join("\n"), /still noindex/);
    write("index.html", home.replace("app-store-badge", "missing-badge"));
    assert.match(checkDeployment(config, directory).join("\n"), /official primary badge/);
    write("index.html", home);
    write("robots.txt", "User-agent: *\nDisallow: /\n");
    assert.match(checkDeployment(config, directory).join("\n"), /robots.txt/);
    write("robots.txt", `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nUser-agent: *\nDisallow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
    assert.match(checkDeployment(config, directory).join("\n"), /robots.txt/);
    write("robots.txt", `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
    assert.doesNotMatch(checkDeployment(config, directory).join("\n"), /robots.txt/);
    write("sitemap.xml", `<loc>${site.url}/404</loc>`);
    assert.match(checkDeployment(config, directory).join("\n"), /sitemap.xml/);
    rmSync(join(directory, "sitemap.xml"));
    assert.match(checkDeployment(config, directory).join("\n"), /missing from launch build/);
  });
});

test("downloads can launch with indexing off without bypassing policy and placeholder checks", () => {
  fixture(({ directory, write, home, html }) => {
    const noindex = '<meta name="robots" content="noindex, nofollow">';
    for (const page of ["index", "docs", "privacy", "support"]) write(`${page}.html`, `${html(page)}${noindex}`);
    write("index.html", `${home}${noindex}`);
    write("robots.txt", "User-agent: *\nAllow: /\n");
    rmSync(join(directory, "sitemap.xml"));
    const privateLaunch = { ...config, indexable: false };
    assert.deepEqual(checkDeployment(privateLaunch, directory), []);
    for (const marker of ['class="notice"', "HUMAN-INPUT", "Coming soon", "TBD", "Screenshot needed: hero"]) {
      write("privacy.html", `${html("privacy")}${noindex}${marker}`);
      assert.ok(checkDeployment(privateLaunch, directory).length, `Must reject ${marker} even when indexing is off`);
    }
    write("privacy.html", `${noindex}<link rel="canonical" href="${site.url}/wrong">`);
    assert.match(checkDeployment(privateLaunch, directory).join("\n"), /canonical URL/);
    write("privacy.html", `${html("privacy")}${noindex}`);
    write("sitemap.xml", "<urlset></urlset>");
    assert.match(checkDeployment(privateLaunch, directory).join("\n"), /unexpected sitemap/);
  });
});

test("prelaunch permits an explicitly noindex draft but never owner-input markers", () => {
  fixture(({ directory, write }) => {
    rmSync(join(directory, "sitemap.xml"));
    write("robots.txt", "User-agent: *\nAllow: /\n");
    for (const page of ["index", "docs", "privacy", "support"]) write(`${page}.html`, '<meta name="robots" content="noindex, nofollow">');
    write("index.html", '<meta name="robots" content="noindex, nofollow"><p>Coming soon</p>');
    write("privacy.html", '<meta name="robots" content="noindex, nofollow"><p class="notice">Draft.</p>');
    assert.deepEqual(checkDeployment({ ...config, indexable: false, appStoreUrl: "" }, directory), []);
    write("privacy.html", "HUMAN-INPUT");
    assert.match(checkDeployment({ ...config, indexable: false, appStoreUrl: "" }, directory).join("\n"), /HUMAN-INPUT/);
  });
});
