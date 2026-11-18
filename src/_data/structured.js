import site from "./site.js";

// Schema.org data for the home page, written only when site.indexable is true (see base.njk).
// Only facts the page and the privacy policy already state: no ratings, reviews, download counts or availability.
// The App Store address and a free Offer are added only once appStoreUrl is set, because the app isn't downloadable before then.
// FAQPage is deliberately not used: Google no longer shows FAQ rich results for most sites, and a copy of the visible FAQ adds nothing.
const home = `${site.url}/`;
const app = {
  "@type": "SoftwareApplication",
  "@id": `${home}#app`,
  name: "Twine",
  alternateName: "Twine: private highlight library for Safari on Mac and iPhone",
  url: home,
  description:
    "Highlight text in Safari on Mac and iPhone and keep it in a private, searchable library with a link back to the source. No account. Synced through your private iCloud.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: ["macOS", "iOS"],
  softwareRequirements: `Safari on Mac with macOS ${site.macOS} or later, or on iPhone with iOS ${site.iOS} or later`,
  inLanguage: ["en", "de", "es", "fr", "ru"],
  featureList: [
    "Highlight text in Safari on Mac and iPhone",
    "Highlights are marked again when you revisit a page, while its text still matches",
    "One library synced through your private iCloud, with no account",
    "Search the library, copy text, a link or Markdown, and open the source page",
    "Find highlights in Spotlight and use them in Shortcuts",
    "Pro: local, read-only AI Access for compatible AI tools on your Mac",
  ],
  author: { "@id": `${home}#developer` },
  publisher: { "@id": `${home}#developer` },
};
if (site.appStoreUrl) {
  app.downloadUrl = site.appStoreUrl;
  app.offers = { "@type": "Offer", price: "0", priceCurrency: "USD" };
}

export default {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${home}#website`,
      name: "Twine",
      url: home,
      description: "Twine is a private highlight library for Safari on Mac and iPhone.",
      inLanguage: "en",
      publisher: { "@id": `${home}#developer` },
    },
    { "@type": "Person", "@id": `${home}#developer`, name: site.developer },
    app,
  ],
};
