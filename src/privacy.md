---
layout: page.njk
title: "Privacy Policy · Twine for Safari on Mac and iPhone"
description: "How Twine handles your highlights, your devices and this website."
permalink: /privacy.html
---
# Privacy Policy

Effective {{ site.policyDate }}

## In short

- There is no Twine account. The app doesn't ask for your name, email address or a password.
- Your highlights are stored on your devices and sync through your own private iCloud. The app doesn't send your library to {{ site.developer }} ("we"). If you send material with a support request, we receive what you choose to send.
- Twine has no advertising, tracking or developer-run analytics, in the app or on this website. Apple's optional diagnostic reports are described below.
- AI features are optional. On-device AI context runs on your device. AI Access lets AI tools on your Mac read your highlights only after you turn it on, and those tools handle what they read under their own policies.
- To show a website's icon and name, Twine asks that website for them, and the website can see your IP address when that happens.
- You can delete your highlights at any time. See [Deleting your data](#deleting-your-data).

## Who we are

{{ site.developer }} publishes Twine. For any privacy question, email [{{ site.email }}](mailto:{{ site.email }}).

## What Twine saves

When you highlight text in Safari, Twine saves:

- the highlighted text, up to 5,000 characters;
- up to 500 characters of page text before it and 500 after it, so Twine can find the passage again;
- the page title, and the page address after removing user names and passwords, fragments, tracking parameters and credential-like parameters (other parts of the address can remain);
- the date and colour of the highlight;
- a highlight identifier and its position on the page;
- if you turn on AI context, the explanation Twine writes for the highlight.

Twine can't recognise a secret that is part of a page address's path, such as a one-time sign-in link, so avoid highlighting on pages like that. In Private Browsing windows Twine saves nothing.

## Where it is stored

- **On your devices.** Highlights live in a file in the app container that Twine and its Safari extension share. Twine keeps automatic local backup copies so it can recover if the file is damaged. It attempts to remove copies older than 30 days during storage maintenance; a copy can remain longer if Twine isn't running or removal fails. Website icons and names are cached locally. Successful entries normally become due for refresh after 30 days; an older cached value can remain if a refresh can't replace it. Settings, such as your shortcut and switches, are also stored on the device. Twine stores sync state and an iCloud account identifier locally to keep libraries separate when the account changes.
- **In your private iCloud.** Twine syncs highlights, and AI context if you use it, through CloudKit into your private iCloud database. We have no access to that database, and Apple's terms and privacy policy apply to it. Twine also stores a small record that notes when its starter highlights were added.
- **In your keychain.** If you use AI Access, Twine generates and stores its access token in your Mac's keychain, without syncing it to iCloud. You can copy it to connect an AI tool, as described below.

## Safari extension

Twine's Safari extension reads the text of pages where you allow it, on your device, to highlight your selection and to find saved highlights again. The extension and app exchange highlight data through local messaging and shared storage. The Safari extension makes no network requests of its own.

Twine marks a highlight in a page with a `mark` element that carries a `data-twine-id` attribute. The page's own scripts can see that part of the page is marked, where, and the highlight's ID.

## Website icons

Twine shows each website's icon beside its highlights. To get it, Twine requests `https://<website>/favicon.ico` directly from that website when the website appears in your library, including for the starter highlights that come with Twine. It sends no cookies and no highlight data. The website can see your IP address, the time and the usual HTTP request headers. Icons are cached on your device and normally become due for refresh after 30 days; an older icon can remain if a refresh fails. There is no setting to turn this off.

Twine also fetches a highlighted site's home page over HTTPS to read its display name. It reads at most 256 KB, sends no cookies or highlight text, and caches the name on the device. The site can see your IP address and request time. There is no setting to turn this lookup off.

## Spotlight, Siri and Shortcuts

Twine can add your highlights (their text, page title, website and link) to Spotlight's search index on your device and offer them to Shortcuts. It's on by default and controlled by one switch, **Show Highlights in Spotlight, Siri and Shortcuts**. Turning it off removes them. This uses Apple's on-device system features, and Twine doesn't send the index anywhere.

## AI features

**AI context** is optional and off by default. It uses Apple's on-device language model through the Foundation Models framework. Twine gives that model the highlight, the page title and website, and the text around the highlight, on your device. Twine never uses a server-based model for this. The result is saved with the highlight and syncs through iCloud.

**AI Access** is optional, off by default and available on the Mac. When you turn it on, Twine runs a local server that listens only on your Mac. A tool that has the access token can search and read your highlights: their identifier, text, page title, website, page address, link and date. It can't change them, and surrounding page text, AI context and colour aren't included. What a tool you connect does with that data is governed by that tool and its provider. Turn AI Access off to stop the server, or regenerate the token to revoke existing tools' access.

**Copy Access Token** and **Copy Connection Settings** put the token on your Mac's clipboard so you can paste it into a tool. Twine marks this copy as sensitive and Mac-only, so it isn't sent through Universal Clipboard. While running, Twine clears its copy after about a minute and when it quits, without replacing something you've copied since. If Twine is force-quit first, its copy can remain until you next open Twine. A tool you give the token to may store it under its own policies. Keep it private.

{% if site.pricing %}
## Purchases

Twine Pro is an optional one-time in-app purchase through the App Store. Apple handles the payment, and we don't receive your payment details. On your device, Apple's StoreKit provides signed transaction information that Twine checks to decide whether Pro is unlocked. Twine has no developer-run purchase server. Apple's own purchase records and privacy policy apply.
{% endif %}

## What Apple tells us

Apple may give developers aggregated download and sales figures. If you choose to share analytics with app developers in your device settings, Apple may also provide crash and usage reports containing technical and device diagnostics. Apple's privacy policy and your sharing settings govern these reports. Twine doesn't add its own analytics service.

On your device, Twine logs diagnostic delivery times and counts of crashes, hangs and related performance issues. It doesn't retain or export MetricKit payloads or call stacks.

## This website

This website uses no cookies or analytics. It uses system fonts, serves images and stylesheets from this site, and loads no third-party scripts. There are no on-site forms. It is hosted on GitHub Pages, which processes your IP address and request details to deliver pages and protect against abuse. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

The feedback link opens a GitHub-hosted issue form. GitHub requires sign-in, and issues you submit there are public. Don't include private highlights, access tokens or other sensitive material.

If you email us, we receive your address, message and any attachments you send. We use them to handle your request and keep correspondence for as long as needed to resolve it and meet legal obligations. Email is also processed by the email providers involved. You can contact us about deleting support correspondence.

## Sharing

We don't sell personal data or use it for advertising. Apple provides iCloud sync, system features and App Store purchases; GitHub hosts this website and the public feedback form. Websites you highlight receive the icon and display-name requests described above. A connected AI tool receives the highlights it reads with your access token under its own policies. Support correspondence is handled as described above; we don't operate a server holding your highlight library.

## Deleting your data

- **A highlight.** Delete it in Twine. The deletion reaches your other devices when Twine syncs with iCloud.
- **Resetting the library.** **Settings → Library → Reset Library…** replaces your local library with the starter set and queues deletions for the highlights on that device. Those changes reach other devices through iCloud. Twine first keeps a local recovery copy, with the maintenance-based cleanup described above. Highlights that exist only in iCloud and have never reached a device can't be deleted this way and may come back.
- **The copy in iCloud.** Use your device's iCloud storage settings to delete the data Twine keeps in iCloud.
- **The app.** Removing Twine from an iPhone removes its data from that device. On a Mac, Twine's data folders stay in your Library folder after you remove the app, until you delete them.

## Your choices and rights

Your rights depend on where you live. You can contact us to request access to, correction of or deletion of personal data we hold, such as support correspondence. Your highlight library stays on your devices and in your private iCloud, rather than a developer-run server. Manage that data in Twine and through Apple's iCloud settings. Contact us with any privacy question.

## Children

Twine isn't directed at children. The app doesn't ask for a name, email address or age. If you believe a child has sent personal information through support or public feedback, contact us so we can address the request.

## Changes

If this policy changes, we'll update it here and change the effective date.

## Contact

{{ site.developer }}, [{{ site.email }}](mailto:{{ site.email }})
