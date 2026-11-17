import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

test("the download launch removes pending copy and activates both plans without enabling indexing", () => {
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
      writeFileSync(data, readFileSync(data, "utf8").replace(/appStoreUrl: "[^"]*"/, `appStoreUrl: "${appStoreUrl}"`));
      execFileSync(process.execPath, [join(root, "node_modules/@11ty/eleventy/cmd.cjs"), "--quiet"], { cwd: directory });
      execFileSync(process.execPath, [join(directory, "scripts/check-deploy.mjs")], { cwd: directory });
      const home = readFileSync(join(directory, "_site/index.html"), "utf8");
      assert.match(home, /<meta name="robots" content="noindex, nofollow">/);
      assert.match(home, /href="\/TwineWebsite\/docs#unlock-twine-pro"/);
      assert.match(readFileSync(join(directory, "_site/docs.html"), "utf8"), /id="unlock-twine-pro"/);
      if (appStoreUrl) {
        assert.doesNotMatch(home, /Coming soon|Pending App Store approval|<button[^>]*disabled/);
        assert.equal((home.match(new RegExp(`href="${store}"`, "g")) ?? []).length, 4);
        assert.equal((home.match(/class="app-store-badge"/g) ?? []).length, 1);
      } else {
        assert.match(home, /Coming soon to the App Store/);
        assert.match(home, /Pending App Store approval/);
        assert.equal((home.match(/<button[^>]*disabled/g) ?? []).length, 4);
        assert.doesNotMatch(home, /href="[^"]*apps\.apple\.com/);
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});
