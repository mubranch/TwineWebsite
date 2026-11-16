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
| App branding and the bottom banner's extension icon | `src/static/icon.png`, `src/static/icon-64.png`, `src/static/icon-extension.png` (see [Branding](#branding)) |
| Screenshots | `src/static/images/` (see [Screenshots](#screenshots)) |
| Public feedback form | `.github/ISSUE_TEMPLATE/feedback.yml`; its link is `feedbackUrl` in `src/_data/site.js` |

- A page's `title` and `description` are in its front matter.
- Markdown headings become link targets from their text: `## Connect an AI tool` is `/docs#connect-an-ai-tool`. Other pages link to several of them, so search for an anchor before you rename its heading.
- `privacy.html` and `support.html` are the addresses for the app and App Store Connect. Keep those file names.
- If what Twine collects or sends changes, change `src/privacy.md` in the same pull request.
- Search for `HUMAN-INPUT` to find what still needs the owner.

## Preview

GitHub Pages has no per-pull-request previews, so preview on your machine. A pull request runs the screenshot rendering tests and checks that the site builds.

```sh
npm install
npm start          # http://localhost:8080/TwineWebsite/ and reloads as you save
npm test           # checks screenshot placeholders, supplied files and mobile variants
npm run build      # writes the finished site to _site/ (not committed)
```

Needs Node 22 or later. Every link follows the path in `url` in `src/_data/site.js`, which is why the preview is under `/TwineWebsite/`. `npm start` listens on every network interface (Eleventy's default), so stop it when you're done on a network you don't trust.

## Branding

Use the blue Twine app logo for site branding: `icon.png` (256 × 256) supplies the favicon, touch icon and social image, while `icon-64.png` (64 × 64) supplies the header. Resize proportionally from the supplied app artwork and retain its transparency. The bottom yellow banner intentionally keeps the black extension icon in `icon-extension.png`; do not replace that separate asset with the app logo.

App icon URLs in `src/_includes/base.njk` carry a cache version (`v=blue-app`) so cached extension artwork is not reused as app branding. Bump that version when replacing the app artwork again.

## Copy and product facts

Keep the voice plainspoken, calm and specific, following the voice definition in Twine's `WebsiteCopy.md`. Use **highlight** for a saved item, **passage** for its quoted text, **library** for the collection, **AI Access** for the Mac's MCP connection, and **AI context** for the on-device feature. **Background** is the label shown above that feature's explanation in highlight details; it is not a second feature.

The copy was checked against `mubranch/Twine` main at `0b61156694`. Safari capture is implemented on Mac and iPhone. Chromium and Firefox packaging is merged and Pro-gated, but `BrowserExtensionIdentity.chromeExtensionID` is empty and the app hides browser setup until it is configured. The Pro value proposition and feedback options identify those Mac extensions as **Coming soon**, as requested by the owner. Do not describe them as available or add store links before that release decision. The app and Safari extension target iPhone, not iPad, despite an iPad mention in the beta release notes.

Keep launch switches and the draft privacy policy under owner control. The current privacy draft needs review for website-name lookups as well as favicon requests; it must not be treated as approved merely because the product copy has been updated.

## Feedback

The header's **Feedback (GitHub)** button and the Support page open a GitHub-hosted issue form for bug reports, feature requests and general feedback. Reporters choose the Mac app, iPhone app, Safari extension on Mac or iPhone, upcoming Chrome/Chromium or Firefox extensions on Mac, or the website. Upcoming extensions are explicitly marked **Coming soon**. Extension reports ask for browser and extension versions when available. Submission requires GitHub sign-in and creates a public issue in `mubranch/TwineWebsite`; private support stays on email. No backend endpoint, token or on-site form is needed, and the site's Content-Security-Policy stays unchanged.

GitHub recognizes issue forms only after their YAML configuration lands on the repository's default branch (`main`). Keep Issues enabled in the repository settings. A local preview or feature-branch build cannot activate the form: after merging, follow the button while signed in and verify the form fields appear. Submit only when you intend to create a real public issue.

## Screenshots

The home page uses the supplied light and dark product captures, not recordings or staged chat demos. All five slots are filled. Assets live in `src/static/images/` as `<name>-light.png` and `<name>-dark.png`; the browser chooses the dark version with `prefers-color-scheme: dark`, matching the stylesheet without JavaScript. Images retain their actual proportions, including the portrait-shaped Mac settings window, with explicit dimensions to reserve space before loading.

Device shells are stylized CSS illustrations, not exact or official hardware replicas: MacBook-inspired frames for wide Mac captures, an iPhone 18s-inspired portrait frame, and one open Duo frame. The portrait Mac settings capture stays in a compact window frame rather than being letterboxed inside a laptop. Only the hardware bezel surrounds each image; the screen takes its size from the capture, with no fixed-aspect letterboxing or stretching.

The Duo presentation uses the supplied authentic 2000 × 1407 landscape capture in each appearance, unchanged. Each is one continuous screen with the library and selected highlight's details visible together within the outer device frame. No gap, hinge, divider or separate inner frames are added; the app's own column separator remains part of the capture. The earlier joined panels, top/bottom composite and portrait iPhone pair are not used. The other slots retain their existing light/dark captures.

| Page slot | Layout / asset name / dimensions | Included screen |
| --- | --- | --- |
| Hero | MacBook-style · `hero` · 1960 × 1280 | Main library with its website sidebar, saved passages and selected Wikipedia training-cost highlight, AI context and source: the product overview. |
| Highlight in Safari | MacBook-style · `capture` · 1960 × 1280 | Wikipedia's large language model article with the training-cost passage highlighted: the saved result, without a fleeting Undo message. |
| Find any passage | Open Duo · `library-duo` · 2000 × 1407 | One authentic landscape capture showing All Highlights on the left and the selected passage's details on the right. |
| AI tools | Mac window · `ai-access` · 1040 × 1436 | AI settings with AI Access enabled and connection controls visible. No access token value is displayed; this is Twine's integration surface, not a built-in chat. |
| See how a passage fits | iPhone-style · `context` · 1206 × 2622 | The highlight's details with its completed on-device AI context explanation and source. |

For replacements, use starter or public content only; conceal access tokens, personal account details and notifications. Keep light/dark dimensions and subjects matched, and update the alt text and width/height in the corresponding `shot` call in `src/index.njk`.

The shortcode also accepts unthemed `<name>.webp`, `.png` or `.jpg` as a fallback, and shows a labelled placeholder if neither a light nor an unthemed capture exists. Optional `<name>-mobile-light` (or `<name>-mobile`) and `<name>-mobile-dark` variants replace the main capture below 40em. If only a light mobile crop exists, dark mode keeps the full dark capture instead of showing the light crop. Mobile variants must retain the same subject for the shared alt text; none are currently needed.

Each `shot` call supplies its base name, frame (`mac`, `phone`, `duo` or `window`), alt text, missing-capture brief, eager-loading flag, visible caption, width and height. The hero loads eagerly; other captures load lazily. Decorative camera and laptop-base elements are hidden from assistive technology.

## Publishing

`.github/workflows/site.yml` tests and builds the site and publishes it with GitHub's official Pages actions on GitHub-hosted runners. A push to `main`, or **Actions → Site → Run workflow**, tests, builds, runs `npm run check:deploy`, and only then uploads and deploys. Pull requests test and build without deploying.

**The deployment check is what keeps unfinished content off the internet.** It fails, and nothing publishes, while the built site still has a placeholder address, name or date, or a `HUMAN-INPUT` marker, or, once `indexable` is `true`, a draft notice. Draft pages may be published while the site is not indexable.

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

- [x] `src/_data/site.js`: `email`, `developer` and `policyDate` are filled in. Change `url` when a custom domain is attached.
- [ ] Read `src/privacy.md` against the app, then delete `draft: true` from its front matter. Check especially the Apple analytics paragraph, the iCloud deletion wording, the note about a Mac's data folders and the children sentence. While `draft: true` is there the page says it's a draft and is marked `noindex`. It blocks the switch below: the deploy check fails if `indexable` is `true` while a draft notice remains.
- [x] Add the screenshots above in light and dark appearances.
- [x] Checked `macOS` and `iOS` in `site.js` against Twine main `0b61156694`: `Twine/Twine/Config.xcconfig` and `TwineKit/Package.swift` both require macOS 27 and iOS 27.
- [ ] In the Twine app, set `privacyPolicy`, `supportURL` and `contactEmail` in `AppLinks.swift` to `<site url>/privacy`, `<site url>/support` and `mailto:<email>`. Use the same two addresses in App Store Connect, with the home page as the marketing URL.
- [ ] Leave analytics off. The Content-Security-Policy would block a script anyway.

## Not indexable yet

`indexable: false` in `src/_data/site.js` keeps the whole site out of search results. Every page gets `<meta name="robots" content="noindex, nofollow">`, `robots.txt` has no `Sitemap` line, and no `sitemap.xml` is built. GitHub Pages can't send an `X-Robots-Tag` header, so the meta tag is the mechanism.

`robots.txt` deliberately doesn't `Disallow` anything: a crawler blocked by `robots.txt` never fetches the page, so it never sees the `noindex` tag, and the address can still be listed from links elsewhere. Choose `noindex`, not `Disallow`, to stay out of search.

## When Twine launches

1. Set `appStoreUrl` in `src/_data/site.js`. The "Coming soon" status in the header, hero and closing panel becomes a download button.
2. Review the privacy policy and delete `draft: true` from `src/privacy.md`.
3. Set `indexable: true`. The `noindex` tags go, `sitemap.xml` is built and `robots.txt` lists it. Then, in Google Search Console and Bing Webmaster Tools, submit the sitemap.

## Notes

- `package-lock.json` is written by npm 10.9, the npm that ships with Node 22, on purpose. A lockfile written by npm 11 listed `fsevents`, which installs only on macOS, as a hard dependency, and `npm ci` then failed on the Linux runner with `EBADPLATFORM`. When you update dependencies, run `npx npm@10 install`, and check that `grep -c extraneous package-lock.json` prints 0.
- `src/404.md` builds `404.html`, which GitHub Pages serves for any address that doesn't exist.
- GitHub Pages serves `privacy.html` at `/privacy` and at `/privacy.html`. The canonical tag names the short form.
