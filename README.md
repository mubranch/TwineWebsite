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

GitHub Pages has no per-pull-request previews, so preview on your machine. A pull request only checks that the site builds.

```sh
npm install
npm start          # http://localhost:8080/TwineWebsite/ and reloads as you save
npm run build      # writes the finished site to _site/ (not committed)
```

Needs Node 22 or later. Every link follows the path in `url` in `src/_data/site.js`, which is why the preview is under `/TwineWebsite/`. `npm start` listens on every network interface (Eleventy's default), so stop it when you're done on a network you don't trust.

## Screenshots

Until a file exists, the page shows a labelled placeholder. Add a PNG or WebP with exactly one of these names to `src/static/images/` and the next build uses it. Use starter or public content only, never private pages, and export at about 2× (1600 to 2400 px wide for the Mac shots).

| Name | Shape | It should show |
| --- | --- | --- |
| `hero` | Mac window, 16:10 | The library: a sidebar of websites and pages, a list of highlights, and the details pane open on one |
| `hero-mobile` (optional) | 4:5 | A tighter crop of that window, or an iPhone, shown instead of `hero` on phones |
| `capture` | Mac window, 16:10 | Safari on a public article with one highlighted passage and Twine's Undo message |
| `library` | iPhone, 1320 × 2868 | The library list with website icons and page titles |
| `ai-access` | Mac window, 16:10 | An AI tool answering from Twine highlights, with source links, beside the AI Access settings |
| `context` | Mac window, 16:10 | A highlight's details with the AI context section filled in |

Write the alt text in `src/index.njk`, in each `shot` call (its third argument).

## Publishing

`.github/workflows/site.yml` builds the site and publishes it with GitHub's official Pages actions on GitHub-hosted runners. A push to `main`, or **Actions → Site → Run workflow**, builds, runs `npm run check:deploy`, and only then uploads and deploys. Pull requests only build.

**The deployment check is what keeps unfinished content off the internet.** It fails, and nothing publishes, while the built site still has a placeholder address, name or date, a draft notice, or a `HUMAN-INPUT` marker. Fill in the owner inputs below and the next push deploys.

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

- [ ] `src/_data/site.js`: fill in `email`, `developer` and `policyDate` (each marked `HUMAN-INPUT`). Change `url` when a custom domain is attached.
- [ ] Read `src/privacy.md` against the app, then delete `draft: true` from its front matter. Check especially the Apple analytics paragraph, the iCloud deletion wording, the note about a Mac's data folders and the children sentence. While `draft: true` is there the page says it's a draft, is marked `noindex`, is left out of the sitemap, and blocks deployment.
- [ ] Add the screenshots above.
- [ ] Check `macOS` and `iOS` in `site.js` against the app's minimum OS versions.
- [ ] In the Twine app, set `privacyPolicy`, `supportURL` and `contactEmail` in `AppLinks.swift` to `<site url>/privacy`, `<site url>/support` and `mailto:<email>`. Use the same two addresses in App Store Connect, with the home page as the marketing URL.
- [ ] Leave analytics off. The Content-Security-Policy would block a script anyway.

## When Twine launches

Set `appStoreUrl` in `src/_data/site.js`. The "Coming soon" status in the header, hero and closing panel becomes a download button.

## Notes

- `src/404.md` builds `404.html`, which GitHub Pages serves for any address that doesn't exist.
- GitHub Pages serves `privacy.html` at `/privacy` and at `/privacy.html`. The canonical tag names the short form.
