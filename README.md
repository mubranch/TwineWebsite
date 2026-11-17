# Twine website

The public website for Twine: Home, Docs, Privacy Policy and Support. [Eleventy](https://www.11ty.dev) turns Markdown and a few templates into plain HTML and one stylesheet, and GitHub Actions publishes it to GitHub Pages. The pages load no scripts, fonts, analytics or other third-party content, and a Content-Security-Policy meta tag makes the browser enforce that.

Once published it lives at <https://mubranch.github.io/TwineWebsite/>. Nothing is published until the [deployment check](#publishing) passes.

## Edit the site

| To change | Edit |
| --- | --- |
| The home page: hero, features, privacy callout, FAQ, closing panel | `src/index.njk` |
| Docs, Privacy Policy, Support (Markdown) | `src/docs.md`, `src/privacy.md`, `src/support.md` |
| Contact email, developer name, policy date, site address, launch switch | `src/_data/site.js` |
| The header, footer and page head (title, description, social tags, security policy) | `src/_includes/base.njk` |
| Colours, type and layout | `src/static/site.css` |
| App branding and the bottom banner's extension icon | `src/static/icon.png`, `src/static/icon-64.webp`, `src/static/icon-extension.webp` (see [Branding](#branding)) |
| Screenshots and official device renders | `src/static/images/`, `src/static/devices/` (see [Screenshots](#screenshots)) |
| Public feedback form | `.github/ISSUE_TEMPLATE/feedback.yml`; its link is `feedbackUrl` in `src/_data/site.js` |

- A page's `title` and `description` are in its front matter.
- Markdown headings become link targets from their text: `## Connect an AI tool` is `/docs#connect-an-ai-tool`. Other pages link to several of them, so search for an anchor before you rename its heading.
- Keep the generated `privacy.html` and `support.html` file names. Use their extensionless canonical URLs in the app and App Store Connect, as listed in the [launch runbook](#app-store-connect-urls).
- If what Twine collects or sends changes, change `src/privacy.md` in the same pull request.
- Search for `HUMAN-INPUT` to find what still needs the owner.

## Preview

GitHub Pages has no per-pull-request previews, so preview on your machine. A pull request runs the screenshot rendering tests and checks that the site builds.

```sh
npm install
npm start          # http://localhost:8080/TwineWebsite/ and reloads as you save
npm test           # checks screenshot placeholders, official frames and responsive appearance sources
npm run build      # writes the finished site to _site/ (not committed)
```

Needs Node 22 or later. Every link follows the path in `url` in `src/_data/site.js`, which is why the preview is under `/TwineWebsite/`. `npm start` listens on every network interface (Eleventy's default), so stop it when you're done on a network you don't trust.

## Branding

Use the blue Twine app logo for site branding: `icon.png` (256 × 256) supplies the favicon, touch icon and social image, while `icon-64.webp` (64 × 64) supplies the header. Resize proportionally from the supplied app artwork and retain its transparency. The bottom yellow banner intentionally keeps the black extension icon in `icon-extension.webp`; do not replace that separate asset with the app logo. The WebP versions retain the original PNG pixels, alpha and color profiles.

App icon URLs in `src/_includes/base.njk` carry a cache version (`v=blue-app`) so cached extension artwork is not reused as app branding. Bump that version when replacing the app artwork again.

## Copy and product facts

Keep the voice plainspoken, calm and specific, following the voice definition in Twine's `WebsiteCopy.md`. Use **highlight** for a saved item, **passage** for its quoted text, **library** for the collection, **AI Access** for the Mac's MCP connection, and **AI context** for the on-device feature. **Background** is the label shown above that feature's explanation in highlight details; it is not a second feature.

Position Twine as a web knowledge base built from saved passages and source links. Keep that phrase for the main positioning rather than repeating it through the feature copy; use library, highlights, passages and sources for concrete actions.

The launch copy was rechecked against `mubranch/Twine` main at `a5f51e72e87361f1dba34c8382b68332c5e6d147`. Safari capture is implemented on Mac and iPhone. Chromium and Firefox packaging is merged and Pro-gated, but `BrowserExtensionIdentity.chromeExtensionID` is empty and the app hides browser setup until it is configured. Those extensions are not advertised as a launch benefit; the external feedback form still labels its future-browser options **Coming soon**. Do not describe them as available or add store links before that release decision. The app and Safari extension target iPhone, not iPad.

Keep launch switches and the draft privacy policy under owner control. The owner-approved website-name lookup paragraph is included alongside favicon requests, but the policy still needs a complete owner review; it must not be treated as approved for publication merely because that paragraph or the product copy has been updated.

## Feedback

The header's **Feedback (GitHub)** button and the Support page open a GitHub-hosted issue form for bug reports, feature requests and general feedback. Reporters choose the Mac app, iPhone app, Safari extension on Mac or iPhone, upcoming Chrome/Chromium or Firefox extensions on Mac, or the website. Upcoming extensions are explicitly marked **Coming soon**. Extension reports ask for browser and extension versions when available. Submission requires GitHub sign-in and creates a public issue in `mubranch/TwineWebsite`; private support stays on email. No backend endpoint, token or on-site form is needed, and the site's Content-Security-Policy stays unchanged.

GitHub recognizes issue forms only after their YAML configuration lands on the repository's default branch (`main`). Keep Issues enabled in the repository settings. A local preview or feature-branch build cannot activate the form: after merging, follow the button while signed in and verify the form fields appear. Submit only when you intend to create a real public issue.

## Screenshots

The home page uses the supplied light and dark product captures, not recordings or staged chat demos. All five slots are filled. Full-resolution, lossless assets live in `src/static/images/` as `<name>-light.webp` and `<name>-dark.webp`. A `picture` element chooses the appearance with `prefers-color-scheme: dark`; `srcset` chooses one suitable resolution without downloading both appearances. Explicit dimensions reserve space before loading.

The CSS-drawn hardware has been replaced with the official Apple PNG artwork, encoded losslessly with its transparency intact: iPhone 18 Pro in Black, iPhone Duo in Night Sky with its Inner Open Landscape display, and one 13-inch MacBook Air M5 in Silver for both wide Mac slots. The iPhone 18 pack is the source, not an unofficial "18s" illustration. The portrait Mac settings capture keeps its existing compact window treatment.

The iPhone capture exactly matches its 1206 × 2622 display opening. The Duo uses the supplied authentic 2000 × 1407 capture as one continuous screen; it matches the artwork's 2853 × 2007 opening within subpixel resize-rounding precision. No center gap, hinge, divider or joined panels are added. Display masks follow the real artwork's alpha opening, including its rounded corners and camera cutouts.

The owner approved fitting the existing 1960 × 1280 Mac captures to the Air's 2560 × 1664 screen: the displayed height is reduced by **0.46875%** relative to uniform width scaling. No source pixels are changed and no `cover` cropping or letterboxing is used. This exception is limited to the existing `hero` and `capture` dimensions; new mismatched captures fail the build. Native 2560 × 1664 replacements would remove the correction.

Below **400 CSS px**, the Air artwork is not shown or downloaded: each Mac capture appears alone at its original proportions. Larger browser font defaults raise that breakpoint to 25em. This keeps the physical device from falling below Apple's 200px minimum. At 400px with default text size, the Air's body is over 204px tall. The Duo uses the full viewport width through at least 384px (or 24em with larger browser fonts), keeping its body above 200px even at 320px. Images have no added shadows, glare, transforms or animations; the window treatment is not a hardware illustration.

| Page slot | Layout / asset name / dimensions | Included screen |
| --- | --- | --- |
| Hero | MacBook Air M5 · `hero` · 1960 × 1280 | Main library with its website sidebar, saved passages and selected Wikipedia training-cost highlight, AI context and source: the product overview. |
| Add a passage. Keep its source. | MacBook Air M5 · `capture` · 1960 × 1280 | Wikipedia's large language model article with the training-cost passage highlighted: the saved result, without a fleeting Undo message. |
| Find what you kept. | iPhone Duo · `library-duo` · 2000 × 1407 | One authentic landscape capture showing Wikipedia highlights on the left and the selected training-cost passage, source and actions on the right. No Background explanation is shown. |
| Let AI tools search your saved passages. | Mac window · `ai-access` · 1040 × 1436 | AI settings with AI Access enabled and connection controls visible. No access token value is displayed; this is Twine's integration surface, not a built-in chat. |
| Keep the passage in context. | iPhone 18 Pro · `context` · 1206 × 2622 | The highlight's details with its completed on-device AI context explanation and source. |

The Duo's light/dark pair comes from `screenshots/iphone-duo/1-library-details-*.png` in the supplied review package. Its full-resolution WebP files decode to exactly the supplied pixels; the image is not split or composited. The other four slots and every app/extension icon are unchanged. The package's 2560 × 1600 Mac captures do not fit the Air's 2560 × 1664 opening: they would need a new, unapproved 4% height stretch. Keep the existing Mac assets until native 2560 × 1664 replacements are supplied. The existing iPhone context capture also remains in place.

For replacements, use starter or public content only; conceal access tokens, personal account details and notifications. Keep light/dark dimensions and subjects matched, and update the alt text and width/height in the corresponding `shot` call in `src/index.njk`.

Keep the exact base-name workflow: give replacement originals names such as `hero-light.png` and `hero-dark.png`, then run the optimizer below. It writes the matching WebP files automatically. The shortcode also accepts unthemed `<name>.webp`, `.png` or `.jpg` and shows a labelled, device-free placeholder when a capture is missing. WebP takes precedence, so regenerate it after replacing an original.

Optional `<name>-mobile-light` (or `<name>-mobile`) and `<name>-mobile-dark` captures still replace the main capture below 40em. Dark mode does not fall back to a light-only mobile variant. Such captures must retain the same subject, proportions and hardware fit; no alternate crops are used by the current site.

Each `shot` call supplies its base name, frame (`mac`, `phone`, `duo` or `window`), alt text, missing-capture brief, eager-loading flag, caption, width and height. Dimensions must match the actual capture and are required for a hardware frame. The hero is eager with high fetch priority; below-fold captures, renders and the closing icon are lazy. Device artwork has empty alt text; the single product capture retains its descriptive alt text.

### Regenerate lossless images

Only asset regeneration needs Python 3 and Pillow with WebP support; normal builds and CI do not install image-processing dependencies. Keep originals in a separate input folder, not in the published `src/static` tree.

```sh
python3 scripts/optimize-images.py /path/to/captures
python3 -m unittest discover -s scripts -p '*_test.py'
npm test
npm run build
npm run check:deploy
```

Individual source paths also work. Every full-resolution output is decoded and compared against the original's RGBA bytes, including RGB under transparent pixels, and its ICC profile is preserved. The script fails if either differs. Unsupported bit depth, animation, EXIF rotation or explicit gamma/chromaticity without an ICC profile is rejected before writing. No lossy or near-lossless encoding is used. The compatibility favicon/touch/social PNG is retained when a new lossless PNG would be larger.

Smaller 480, 960 and 1440px-wide candidates are resized with Lanczos, then encoded losslessly against that resized bitmap. They are not claimed to be pixel-identical to the full-resolution original; the native, pixel-identical file is always the largest candidate. Downscaling UI can create more colors and cost more bytes than the native image, so the script discards a candidate whenever a larger one is cheaper. Do not recreate those discarded files by hand.

Current full-resolution measurements, in bytes:

| Asset | Original PNG | Lossless served file |
| --- | ---: | ---: |
| Hero, light | 525,888 | 199,988 |
| Hero, dark | 575,244 | 221,244 |
| Safari, light | 424,381 | 128,528 |
| Safari, dark | 413,875 | 128,072 |
| Duo, light | 713,687 | 357,128 |
| Duo, dark | 682,577 | 347,066 |
| AI Access, light | 224,966 | 63,340 |
| AI Access, dark | 241,552 | 61,618 |
| iPhone context, light | 359,561 | 88,054 |
| iPhone context, dark | 356,065 | 82,840 |
| Header app icon | 5,149 | 3,972 |
| Closing extension icon | 38,940 | 18,658 |
| Favicon, touch and social PNG | 32,655 | 32,655 |
| iPhone 18 Pro artwork | 447,742 | 229,014 |
| iPhone Duo artwork | 795,922 | 425,538 |
| MacBook Air M5 artwork | 539,634 | 294,118 |
| **Total** | **6,377,838** | **2,681,833** |

These 16 native-resolution files are 58.0% smaller in total, including the artwork. The refreshed Duo pair uses 704,194 bytes at native resolution, down from 978,150 bytes for the previous pair (28.0% less). Its supplied PNGs total 1,396,264 bytes; the served pair is 49.6% smaller without changing their pixels. Resized candidates are additional files; a visitor does not download the whole set. The optimizer prints a JSON report with each file's size, retained variants and pixel/profile hashes.

Cold-cache Chromium measurements after scrolling the complete home page, including selected captures, artwork, masks and icons, but excluding HTTP headers and browser-UI favicons:

| Viewport and density | Appearance | Before Duo refresh | After Duo refresh | Reduction |
| --- | --- | ---: | ---: | ---: |
| 390px at 2x | Light | 852,648 | 816,572 | 4.2% |
| 390px at 2x | Dark | 895,972 | 833,866 | 6.9% |
| 1440px at 1x | Light | 764,478 | 728,402 | 4.7% |
| 1440px at 1x | Dark | 824,166 | 762,060 | 7.5% |

These are complete-page totals, not just first-paint savings. Both columns include the official hardware; only the Duo captures changed between measurements. The three generated display masks and transparent fallback add 2,612 bytes across the asset set. Chromium and WebKit checks cover both appearances at 320, 390, 768, 1024 and 1440px at 1x and 2x, plus both sides of the 399/400px Air breakpoint; they confirm a single appearance, adequate selected resolution, fitted screens, no overflow and physical device heights of at least 200px. The earlier Chromium device-size checks also passed at 12 viewport widths with browser font defaults of 12, 14 and 24px.

### Apple artwork sources and publication

The owner accepted Apple's terms. Obtain the PNG originals through [Apple Design Resources](https://developer.apple.com/design/resources/#product-bezels):

- [iPhone 18 pack](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-18.dmg): `iPhone 18 Pro - Black - Portrait.png`, renamed `bezel-iphone-18-pro.png`.
- [iPhone Duo pack](https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-Duo.dmg): `iPhone Duo - Night Sky - Inner Open Landscape.png`, renamed `bezel-iphone-duo.png`.
- [MacBook Air M5 pack](https://devimages-cdn.apple.com/design/resources/download/Bezel-MacBook-Air-M5.dmg): `MacBook Air M5 13-inch Silver.png`, renamed `bezel-macbook-air-m5.png`.

Process those renamed PNGs with the same optimizer. It also derives the small display-opening masks and the transparent fallback used to avoid a hidden Mac image download. Commit only the optimized assets used by the site, never DMGs or PSDs. This is proprietary Apple artwork, not a general-purpose asset library; do not extract or redistribute it as stock artwork.

Follow the bundled Apple licenses and [Marketing Resources and Identity Guidelines](https://developer.apple.com/app-store/marketing/guidelines/). Keep the whole supplied image, including its transparent margins; do not crop, rotate, mirror or add effects. Show real app content, not a blank screen. Use full network/Wi-Fi and battery indicators in supplied captures; do not paint them into a screenshot. A desktop presentation needs the app's Dock icon and matching menu titles. Current captures show the app or page, not a staged desktop. When grouping devices, maintain their relative physical scale.

The footer includes one international trademark credit using [Apple's trademark list](https://www.apple.com/legal/intellectual-property/trademark/appletmlist.html), with separate attribution for unregistered marks and Cisco's iOS mark. Apple's marketing artwork terms cover App Store promotion, while Twine is still marked Coming soon: the owner must resolve publication eligibility before shipping the artwork. A local preview is not deployment authorization.

## Publishing

`.github/workflows/site.yml` tests and builds the site and publishes it with GitHub's official Pages actions on GitHub-hosted runners. A push to `main`, or **Actions → Site → Run workflow**, tests, builds, runs `npm run check:deploy`, and only then uploads and deploys. Pull requests test and build without deploying.

**`npm run check:deploy` is the publication gate.** It always rejects placeholder addresses, owner-name/date placeholders and `HUMAN-INPUT` in built text. With `indexable: true`, it also rejects draft notices, missing screenshot slots, `Coming soon`, `TBD`, `TODO`, `FIXME`, Lorem Ipsum and internal-beta copy in HTML; a missing or invalid App Store product URL; missing/duplicate primary badges; noindex launch pages; wrong canonicals; and missing, stale or incorrect robots/sitemap output. HTML copy checks do not mistake the unused status styles for visible launch copy. These cases have focused tests in `scripts/check-deploy.test.mjs`.

A prelaunch build must stay noindex, with no sitemap or active download badge. A draft policy is permitted in that state, but **is not a final policy suitable for App Review**. The success message distinguishes that state from the fully activated launch checks. These checks cannot approve policy text, verify a mailbox, prove a product is available in the App Store, or verify App Store Connect's privacy answers.

- Pages must deploy from **GitHub Actions**: **Settings → Pages → Build and deployment → Source**. Check it there if a run ever fails because Pages isn't enabled.
- Until a custom domain is attached the site is at <https://mubranch.github.io/TwineWebsite/>, and every link carries the `/TwineWebsite/` prefix from `url`.
- Don't add self-hosted runners to this public repository: anyone's pull request could then run code on them.
- Dependabot opens a pull request each month for the pinned actions and the npm packages. Actions are pinned to full commit SHAs, so review those updates before merging.
- GitHub Pages can't set HTTP headers, so the security policy is a `<meta>` tag, placed first in `<head>` so it covers everything after it. A meta tag can't enforce `frame-ancestors` (other sites could frame these pages), `report-uri` or `sandbox`. The referrer policy is a `<meta name="referrer">` tag. If the site ever sits behind something that can set headers, send the same policy as a header.

## Custom domain

1. **Settings → Pages → Custom domain**: enter the domain and save. Do this before changing DNS, and verify the domain first (**your profile Settings → Pages → Add a domain**) so nobody else can claim it.
2. At your DNS provider:
   - An apex domain such as `example.com`: A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus AAAA records to `2606:50c0:8000::153` through `2606:50c0:8003::153`. Or one `ALIAS` or `ANAME` record to `mubranch.github.io`.
   - A subdomain such as `www.example.com`: a CNAME record to `mubranch.github.io`.
   - Don't use wildcard records. DNS changes can take up to 24 hours.
3. Once GitHub's DNS check passes, tick **Enforce HTTPS** (it can take up to 24 hours to appear).
4. Set `url` in `src/_data/site.js` to `https://<domain>`, with no path. The `/TwineWebsite/` prefix disappears from every link on the next deploy.

With Actions publishing, GitHub ignores any `CNAME` file. The domain lives in the Pages settings. A file in `src/static/` is still copied to the site root if you add one. If the domain's DNS is on Cloudflare, leave the Pages records DNS-only (grey cloud) so GitHub can issue the certificate.

## A support address

- **Cloudflare Email Routing** works for any domain whose DNS is on Cloudflare, whoever hosts the site. Open **Email Routing** in the Cloudflare dashboard, onboard the domain, add and verify a destination address, and create a rule from `support` to it. It only forwards mail you receive, so to reply from the support address use your mail app's "send as" option.
- **iCloud+ custom email domain** gives you an address at your own domain in iCloud Mail. It needs an iCloud+ subscription and DNS records at your registrar. See [Apple's guide](https://support.apple.com/en-us/102540).

Put the address in `email` in `src/_data/site.js`.

## Before the site goes public

- [x] `src/_data/site.js`: contact, developer and policy-date fields are populated. Change `url` if a custom domain is attached.
- [ ] Owner confirms that `mustafa.branch@gmail.com` is the monitored support mailbox and that the stated response expectations are accurate. A populated address is not proof of ownership or delivery.
- [x] Re-audit the policy against app source, including site-name/icon requests, account-specific sync state, backup/cache retention, token copying, on-device context and StoreKit.
- [ ] Owner approves the separately supplied proposed policy, its effective date and children/support-retention wording, then removes `draft: true`. The approved display-name lookup paragraph must remain verbatim. Source review is not policy approval.
- [ ] Owner confirms App Store Connect privacy answers against the final binary, Apple's collection definition and any optional support/diagnostic submissions. The manifests alone do not verify a "Data Not Collected" label.
- [x] Add the screenshots above in light and dark appearances.
- [x] Recheck `macOS` and `iOS` against `Twine/Twine/Config.xcconfig` at `a5f51e72`: both require version 27.
- [x] Stage the official conditional Mac App Store badge, accessible name, clear space and launch-copy branches.
- [ ] Owner confirms the marketing-artwork license and that the download link is for an app actually available to download, not only a preorder or unavailable listing. Device-render and badge rights are tied to App Store availability.
- [ ] Owner confirms whether to show pricing and the actual US Pro price. `pricing: true` is unchanged. The source's local StoreKit configuration says $4.99 and non-consumable, but it does not verify the live IAP price or review status. Prefer hiding pricing at first launch unless those are confirmed; that decision belongs in the reviewed activation changes, not an automatic toggle.
- [ ] In the Twine app, set `privacyPolicy`, `supportURL` and `contactEmail` in `AppLinks.swift` to `<site url>/privacy`, `<site url>/support` and `mailto:<email>`. Use the same two addresses in App Store Connect, with the home page as the marketing URL.
- [x] Leave analytics off. No website scripts, tracking cookies or third-party assets are added, and the CSP stays unchanged.
- [ ] Owner approves search indexing for public launch, and the final linked App Store product and Pro purchase/restore flow are checked on the release build.

## App Store badge

The hero marker mirrors Twine's renderer at `a5f51e72` (`Twine/TwineExtension/Resources/content.js`): default yellow `#ffe600`, black text, 85% ink in light appearance and 92% in dark, rounded per-line bars and the same small overhang. Its 120ms fade respects reduced motion. The closing panel and other brand colors are unchanged.

The hero is the sole primary badge placement: Apple's guidance says **one badge per layout**. Header and closing downloads remain text links to the same product. With an empty `appStoreUrl`, all three placements show native disabled download buttons and the hero explains that availability follows App Store approval. No dummy link is used. Setting the real URL enables the links and replaces the hero's text button with the official badge.

`src/static/mac-app-store-badge.svg` is the official preferred black Mac badge linked in Apple's current [Marketing Resources download section](https://developer.apple.com/app-store/marketing/guidelines/), from [this Apple-hosted SVG](https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg). Only inter-element whitespace was removed (12,064 to 11,596 bytes). Artwork paths, colors, lettering, border and proportions are unchanged; no archive is committed.

The badge is 48px tall with at least 12px clear space on every side, exceeding the 40px minimum and meeting the quarter-height rule. It has an explicit link name, retains the site's keyboard-focus outline and uses the same unaltered black artwork in both appearances. The footer conditionally credits the Apple logo and Mac App Store as well as the existing marks. "Mac App Store" matches the Mac download action; general cross-platform purchase copy uses "App Store".

## Not indexable yet

`indexable: false` in `src/_data/site.js` keeps the whole site out of search results. Every page gets `<meta name="robots" content="noindex, nofollow">`, `robots.txt` has no `Sitemap` line, and no `sitemap.xml` is built. GitHub Pages can't send an `X-Robots-Tag` header, so the meta tag is the mechanism.

`robots.txt` deliberately doesn't `Disallow` anything: a crawler blocked by `robots.txt` never fetches the page, so it never sees the `noindex` tag, and the address can still be listed from links elsewhere. Choose `noindex`, not `Disallow`, to stay out of search.

## When Twine launches

### Owner review comes first

The preparation commit leaves `appStoreUrl: ""`, `indexable: false`, `pricing: true` and the draft policy unchanged. The separately supplied **`app-review-policy.patch`** proposes the final policy and removes its draft marker; it is not approved text. After owner sign-off, it can be committed and published while the site is still noindex, so Apple has a final live policy before the app is released.

The separate **`app-review-indexing.patch`** turns indexing on for public launch. Alternatively, **`app-review-activation.patch`** combines the policy and indexing changes; use either the combined patch or the two component patches, not both. None supplies an App Store URL or changes pricing or the policy date. Review the patches, settle the checklist above and apply only the approved changes. Never publish the indexing activation alone: the deployment check intentionally rejects it until the real store link is set.

### The final link change

Once the approved launch changes are staged locally, the last site-data edit is **`appStoreUrl` in `src/_data/site.js`**. Paste the real HTTPS `apps.apple.com` product URL. Confirm it opens Twine for the supported platforms and is available to download. Do not commit a rehearsal URL.

```sh
git fetch origin main
git merge-base --is-ancestor origin/main HEAD
git log --oneline origin/main..HEAD  # only reviewed release commits
npm test && npm run build && npm run check:deploy
git diff --check
```

Check the full launch build at 320, 390 and 1440px in light and dark: the official badge, all download links, privacy/support/docs, focus, images and 404; no draft/placeholder copy, overflow, console or CSP errors. Check that the four public canonical pages have no noindex tag, `robots.txt` names the sitemap, and `sitemap.xml` includes those four pages but not 404. The 404 intentionally stays noindex.

Only when authorized, commit the real link and push the approved fast-forward release through the existing Pages flow:

```sh
git add -- src/_data/site.js
git commit -m "Set Twine's App Store download link"
git push origin HEAD:main
gh run list --workflow site.yml --branch main --limit 1
gh run watch RUN_ID --exit-status
```

If main has advanced or the push is rejected, integrate and rerun checks; never force-push. After Pages succeeds, verify the **public** URLs below, badge/product links, policy text, robots/sitemap, all image appearances and icons. Submit the sitemap to search engines at public launch, not merely for App Review.

### App Store Connect URLs

| Field | Exact value |
| --- | --- |
| Marketing URL | `https://mubranch.github.io/TwineWebsite/` |
| Support URL | `https://mubranch.github.io/TwineWebsite/support` |
| Privacy Policy URL | `https://mubranch.github.io/TwineWebsite/privacy` |
| Developer contact | `mailto:mustafa.branch@gmail.com` (owner must confirm the mailbox) |
| Optional terms | Apple's [standard EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) applies if no custom EULA is supplied; this one-time IAP is not a subscription. Owner confirms any additional terms. |

Use the exact same privacy/support/mailto values in the app's `Twine/Twine/Settings/AppLinks.swift`. At source revision `a5f51e72`, those three values still point at `example.invalid`; this website does not fix them. The app needs its own change and rebuilt release.

Before submission, check the final live policy, monitored support contact, accurate shipped features, final app-side links, App Store privacy answers, IAP attachment/approval and purchase restoration on a device. A website preview does not verify the submitted binary, App Store Connect configuration, CloudKit production schema or clean-install behavior.

## Notes

- `package-lock.json` is written by npm 10.9, the npm that ships with Node 22, on purpose. A lockfile written by npm 11 listed `fsevents`, which installs only on macOS, as a hard dependency, and `npm ci` then failed on the Linux runner with `EBADPLATFORM`. When you update dependencies, run `npx npm@10 install`, and check that `grep -c extraneous package-lock.json` prints 0.
- `src/404.md` builds `404.html`, which GitHub Pages serves for any address that doesn't exist.
- GitHub Pages serves `privacy.html` at `/privacy` and at `/privacy.html`. The canonical tag names the short form.
