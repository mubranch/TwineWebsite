// The whole public site as one Markdown file for AI assistants and answer engines (llms-full.txt, the
// companion to llms.txt). Built from the same sources as the pages, so it can't drift from them:
// the home-page FAQ, then Docs, Privacy Policy and Support. Only written when site.indexable is true.
import { readFileSync } from "node:fs";
import nunjucks from "nunjucks";

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader("src/_includes"), { autoescape: false });

// Front matter off, Nunjucks variables and conditions rendered with the site data.
function page(file, site) {
  const source = readFileSync(`src/${file}`, "utf8").replace(/^---\n[\s\S]*?\n---\n/, "");
  return env.renderString(source, { site });
}

// Site-relative links become absolute, and the few raw HTML links become Markdown links.
function absolute(markdown, site, path) {
  return markdown
    .replace(/<nav\b[\s\S]*?<\/nav>/g, "")
    .replace(/<kbd>([\s\S]*?)<\/kbd>/g, "`$1`")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/\]\(#/g, `](${site.url}${path}#`)
    .replace(/\]\(\//g, `](${site.url}/`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Each <details> question on the home page as a "### question" heading and a plain answer.
function faq(site) {
  const source = readFileSync("src/index.njk", "utf8").match(/<section class="faq"[\s\S]*?<\/section>/)?.[0] ?? "";
  const section = env.renderString(source, { site, page: { url: "/" } });
  return [...section.matchAll(/<details\b[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
    .map(([, question, answer]) => {
      const text = answer
        .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
        .replace(/<\/p>\s*<p>/g, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/[ \t]+/g, " ")
        .trim();
      return `## ${question.trim()}\n\n${absolute(text, site, "/")}`;
    })
    .join("\n\n");
}

export default class {
  data() {
    return {
      permalink: (data) => (data.site.indexable ? "/llms-full.txt" : false),
      eleventyExcludeFromCollections: true,
    };
  }

  render({ site }) {
    const parts = [
      ["Questions about Twine", `${site.url}/`, faq(site)],
      ["Docs", `${site.url}/docs`, absolute(page("docs.md", site), site, "/docs")],
      ["Privacy Policy", `${site.url}/privacy`, absolute(page("privacy.md", site), site, "/privacy")],
      ["Support", `${site.url}/support`, absolute(page("support.md", site), site, "/support")],
    ];
    const body = parts
      .map(([title, url, text]) => `## ${title}\n\nSource: ${url}\n\n${text.replace(/^# .*\n+/, "").replace(/^(#{1,5}) /gm, "#$1 ")}`)
      .join("\n\n");
    return `# Twine\n\n> ${site.description}\n\nApp Store: ${site.appStoreUrl}\nWebsite: ${site.url}/\n\n${body}\n`;
  }
}
