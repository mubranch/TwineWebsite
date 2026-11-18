// A short, factual guide for AI assistants (the llmstxt.org format). Only written when site.indexable is true:
// llms.txt is a public file that any agent can fetch whatever the noindex tags say, so it launches with the site.
export default class {
  data() {
    return {
      permalink: (data) => (data.site.indexable ? "/llms.txt" : false),
      eleventyExcludeFromCollections: true,
    };
  }

  render({ site }) {
    const link = (path, label, about) => `- [${label}](${site.url}${path}): ${about}`;
    return `# Twine

> Twine is a private highlight library for Safari on Mac and iPhone. Highlight text on a web page in Safari and Twine saves it with the page title and a link back to the source, marks it again when you revisit the page while its text still matches, and syncs your library between your Mac and iPhone through your private iCloud, with no account.

Twine is made by ${site.developer}. It works in Safari only, on Mac with macOS ${site.macOS} and iPhone with iOS ${site.iOS}. Highlights are stored on your devices and in your private iCloud database; the developer has no access to that library, and there are no trackers, ads or developer-run analytics. Free includes highlighting, the library, search, iCloud sync, Markdown copy, Spotlight and Shortcuts. Pro is an optional one-time in-app purchase that adds AI Access, a local, read-only connection for compatible AI tools on your Mac, and on-device AI context. Chrome, other Chromium browsers and Firefox are not supported.

## Pages

${link("/", "Twine home", "What Twine is, how it works and common questions")}
${link("/docs", "Docs", "Setup, highlighting, the library, iCloud sync, Pro, connecting an AI tool and troubleshooting")}
${link("/privacy", "Privacy policy", "How Twine handles your highlights, your devices and this website")}
${link("/support", "Support", "Help, bug reports and how to contact the developer")}

## Optional

- [Public feedback](${site.feedbackUrl}): Request a feature or report a problem on GitHub
`;
  }
}
