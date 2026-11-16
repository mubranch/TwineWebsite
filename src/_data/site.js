// Everything that changes at launch, or needs the owner, lives here. README.md says how.
export default {
  name: "Twine",
  description:
    "Save Safari highlights on Mac and iPhone, keep their source links, and sync through your private iCloud. Connect compatible AI tools on your Mac with AI Access.",

  // The address the site is served from, with no trailing slash: GitHub Pages' address until a custom domain is attached, then the domain.
  // Its path (/TwineWebsite here) prefixes every link, so a domain of its own needs no path at all.
  url: "https://mubranch.github.io/TwineWebsite",
  // The address people write to; it also goes in AppLinks.swift as a mailto: link.
  email: "mustafa.branch@gmail.com",
  feedbackUrl: "https://github.com/mubranch/TwineWebsite/issues/new?template=feedback.yml",
  // The person or company that publishes Twine, as the privacy policy names it.
  developer: "Mustafa Branch",
  // The date the privacy policy takes effect.
  policyDate: "14 November 2026",

  // The App Store address. While it is empty, the site says "Coming soon" instead of showing download buttons.
  appStoreUrl: "",
  // Shows the Free and Pro pricing section and the Pro notes in the docs and privacy policy.
  pricing: true,

  // The launch switch. While false, every page carries a robots noindex, nofollow tag and there is no sitemap.
  // Set it to true at launch (see "When Twine launches" in README.md).
  indexable: false,

  // Minimum OS versions: keep them the same as the app's.
  macOS: "27",
  iOS: "27",
};
