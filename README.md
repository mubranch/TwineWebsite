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
| Screenshots | `src/static/images/` (see [Screenshots](#screenshots)) |

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

## Screenshots

The home page uses static product captures, not recordings or staged chat demos. No product screenshots are included yet: each missing capture has an intentional, labelled slot. Create `src/static/images/` and add a WebP, PNG or JPG with the exact base name below; the next build replaces that slot automatically. All six captures are needed for the complete page.

Use starter or public content only, never private pages. Conceal access tokens, personal account details and notifications. Keep text readable, use the same content and appearance across related captures, and export Mac images at about 2× (1600 to 2400 px wide). Images fit inside their frames without cropping.

| Page slot | Layout / asset name | Best screen to capture and why |
| --- | --- | --- |
| Hero | macOS, 16:10 · `hero` | Twine's main library with the website/page sidebar, a populated highlight list and one selected passage's details. This gives the clearest overview of the product and its source-first organization. |
| Highlight in Safari | macOS, 16:10 · `capture` | Safari on a public article with one or two Twine highlights still visible. It shows the core capture result without needing a recording, keyboard overlay or fleeting Undo message. |
| Find any passage, first phone | iPhone Duo, 1320 × 2868 · `library` | The iPhone library with several saved highlights, website icons and page titles. Show browsing on the go, not a settings page. |
| Find any passage, second phone | iPhone Duo, 1320 × 2868 · `library-detail` | Open one of the exact passages visible on the first phone, with its source and **Open in Safari** action visible. Together the pair tells a browse → open → return-to-source story; these are two views of one iPhone workflow, not another platform. |
| AI tools | macOS, 16:10 · `ai-access` | **Settings → AI → AI Access**, enabled, with local connection controls visible and the access token concealed. This shows Twine's real integration surface without implying a built-in chat or manufacturing an AI answer. |
| See how a passage fits | iPhone, 1320 × 2868 · `context` | A highlight's details with a completed on-device AI context explanation. Choose a passage with enough surrounding text, and show the result rather than a loading/unavailable state. |

`hero-mobile` is optional: a portrait (4:5) crop of the **same Mac library view**, with the selected passage and its source still visible. It replaces `hero` below 40em. Keep the same subject so the shared alt text stays accurate; don't substitute an iPhone here. All other slots keep their captures at every width, and the iPhone Duo stacks below 30em so each phone stays readable.

Each `shot` call in `src/index.njk` supplies its base name, frame (`mac` or `phone`), alt text, missing-capture brief, eager-loading flag and visible caption. Update the alt text (third argument) to match the actual capture when adding it. The two Duo images load independently, so adding one never hides the other missing capture.

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
- [ ] Add the screenshots above.
- [ ] Check `macOS` and `iOS` in `site.js` against the app's minimum OS versions.
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
