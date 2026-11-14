// Everything that changes at launch, or needs the owner, lives here. README.md says how.
export default {
  name: "Twine",
  description:
    "Twine saves the passages you highlight in Safari, with their sources, and lets the AI tools on your Mac search and read them. For Mac and iPhone.",

  // The address the site is served from, with no trailing slash: GitHub Pages' address until a custom domain is attached, then the domain.
  // Its path (/TwineWebsite here) prefixes every link, so a domain of its own needs no path at all.
  url: "https://mubranch.github.io/TwineWebsite",
  // HUMAN-INPUT: the address people write to; it also goes in AppLinks.swift as a mailto: link. Delete this line afterwards.
  email: "support@example.invalid",
  // HUMAN-INPUT: the person or company that publishes Twine, as the privacy policy should name it. Delete this line afterwards.
  developer: "[developer name]",
  // HUMAN-INPUT: the date the privacy policy takes effect, for example "1 December 2026". Delete this line afterwards.
  policyDate: "[effective date]",

  // The App Store address. While it is empty, the site says "Coming soon" instead of showing download buttons.
  appStoreUrl: "",

  // Minimum OS versions: keep them the same as the app's.
  macOS: "27",
  iOS: "27",
};
