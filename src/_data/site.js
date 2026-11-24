// Everything that changes at launch, or needs the owner, lives here. README.md says how.
export default {
  name: "Twine",
  description:
    "Highlight text in Safari and keep it in a searchable library with a link back to the source. No account. Synced through your private iCloud. Free, with a $4.99 one-time Pro upgrade for local AI access.",

  // The address the site is served from, with no trailing slash: GitHub Pages' address until a custom domain is attached, then the domain.
  // Its path (/TwineWebsite here) prefixes every link, so a domain of its own needs no path at all.
  url: "https://mubranch.github.io/TwineWebsite",
  // Owner-confirmed support mailbox; also used in AppLinks.swift as a mailto: link.
  email: "mustafa.branch@gmail.com",
  feedbackUrl: "https://github.com/mubranch/TwineWebsite/issues/new?template=feedback.yml",
  // The person or company that publishes Twine, as the privacy policy names it.
  developer: "Mustafa Branch",
  // Owner-confirmed date the privacy policy takes effect.
  policyDate: "14 November 2026",

  // The App Store address. Download buttons are visible but disabled while this is empty.
  appStoreUrl: "https://apps.apple.com/app/id6834881576",
  // Keeps pricing FAQs and Pro notes in docs/privacy; home-page plan cards are currently omitted.
  pricing: true,

  // Search indexing on by owner decision (24 November 2026), with every crawler welcome, AI training included.
  // While false, every page carries a robots noindex, nofollow tag and there is no sitemap.
  indexable: true,
  // Google Search Console ownership token for the URL-prefix property https://mubranch.github.io/TwineWebsite/ (public by design).
  googleSiteVerification: "Pykb3ScDSBM6f045RHGn4y7_jKAg2eItX0HjYigJVXs",

  // Minimum OS versions: keep them the same as the app's.
  macOS: "27",
  iOS: "27",
};
