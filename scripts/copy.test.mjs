import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

test("downloads launch without home-page pricing while retaining pricing FAQs and Pro docs", () => {
  const root = process.cwd();
  const store = "https://apps.apple.com/app/xcode/id497799835";
  for (const appStoreUrl of ["", store]) {
    const directory = mkdtempSync(join(tmpdir(), "twine-copy-"));
    try {
      for (const path of ["src", "package.json", "eleventy.config.js"]) cpSync(path, join(directory, path), { recursive: true });
      symlinkSync(resolve("node_modules"), join(directory, "node_modules"), "dir");
      mkdirSync(join(directory, "scripts"));
      cpSync("scripts/check-deploy.mjs", join(directory, "scripts/check-deploy.mjs"));
      const data = join(directory, "src/_data/site.js");
      writeFileSync(data, readFileSync(data, "utf8").replace(/appStoreUrl: "[^"]*"/, `appStoreUrl: "${appStoreUrl}"`).replace(/indexable: (?:true|false)/, "indexable: false"));
      execFileSync(process.execPath, [join(root, "node_modules/@11ty/eleventy/cmd.cjs"), "--quiet"], { cwd: directory });
      execFileSync(process.execPath, [join(directory, "scripts/check-deploy.mjs")], { cwd: directory });
      const home = readFileSync(join(directory, "_site/index.html"), "utf8");
      assert.match(home, /<meta name="robots" content="noindex, nofollow">/);
      assert.doesNotMatch(home, /\bid="(?:pricing|plan-free|plan-pro)"|href="[^"]*#pricing"/);
      assert.match(home, /What's the difference between Free and Pro\?/);
      const docs = readFileSync(join(directory, "_site/docs.html"), "utf8");
      const support = readFileSync(join(directory, "_site/support.html"), "utf8");
      assert.match(docs, /id="unlock-twine-pro"/);
      assert.match(docs, /href="#on-your-mac">Set up on Mac<\/a>[\s\S]*href="#on-your-iphone">Set up on iPhone<\/a>[\s\S]*class="toc"/);
      for (const id of ["on-your-mac", "on-your-iphone"]) assert.ok(docs.includes(`id="${id}"`));
      assert.match(home, /<figcaption>Highlight in Safari<\/figcaption>\s*<picture>[\s\S]*max-width: 38em[^>]*workflow-safari-mobile-[^>]+>[\s\S]*<figcaption>Find it in Twine<\/figcaption>/);
      assert.match(home, /Free:<\/strong> highlighting, search, iCloud sync and Markdown copy\.[\s\S]*Pro:<\/strong> local AI Access on Mac and on-device AI context\./);
      assert.match(home, /class="text-link" href="#features">Learn more<\/a>/);
      assert.match(home, /href="\/#ai-title">AI Access<\/a>/);
      assert.match(home, /Optional · Mac only · Off by default[\s\S]*id="ai-title"/);
      assert.match(home, /<nav class="nav"[\s\S]*href="\/privacy">Privacy<\/a>[\s\S]*?<\/nav>/);
      assert.match(home, /href="#privacy-title"[^>]*>[\s\S]*id="privacy-title"/);
      assert.match(support, /requires a GitHub account[\s\S]*public issue[\s\S]*class="button"[^>]*>Send feedback on GitHub/);
      if (appStoreUrl) {
        assert.doesNotMatch(home, /Coming soon|Pending App Store approval|<button[^>]*disabled/);
        assert.equal((home.match(new RegExp(`href="${store}"`, "g")) ?? []).length, 3);
        assert.equal((home.match(/class="app-store-badge"/g) ?? []).length, 1);
      } else {
        assert.match(home, /Coming soon to the App Store/);
        assert.match(home, /Pending App Store approval/);
        assert.equal((home.match(/<button[^>]*disabled/g) ?? []).length, 3);
        assert.doesNotMatch(home, /href="[^"]*apps\.apple\.com/);
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});
