---
layout: page.njk
title: "Privacy Policy · Twine"
description: "How Twine handles your highlights, your devices and this website."
permalink: /privacy.html
draft: true # HUMAN-INPUT: the owner reviews this policy, then deletes this line.
---
# Privacy Policy

Effective {{ site.policyDate }}

## In short

- There is no Twine account. Twine never asks for your name, your email address or a password.
- Your highlights are stored on your devices and sync through your own private iCloud. {{ site.developer }} ("we") never receive them and can't read them.
- Twine has no analytics, advertising or tracking, in the app or on this website.
- AI features are optional. On-device AI context runs on your device. AI Access lets AI tools on your Mac read your highlights only after you turn it on, and those tools handle what they read under their own policies.
- To show a website's icon, Twine asks that website for it, and the website can see your IP address when that happens.
- You can delete your highlights at any time. See [Deleting your data](#deleting-your-data).

## Who we are

{{ site.developer }} publishes Twine. For any privacy question, email [{{ site.email }}](mailto:{{ site.email }}).

## What Twine saves

When you highlight text in Safari, Twine saves:

- the highlighted text, up to 5,000 characters;
- up to 500 characters of page text before it and 500 after it, so Twine can find the passage again;
- the page title, and the page address after removing user names and passwords, fragments, tracking parameters and credential-like parameters (other parts of the address can remain);
- the date and colour of the highlight;
- if you turn on AI context, the explanation Twine writes for the highlight.

Twine can't recognise a secret that is part of a page address's path, such as a one-time sign-in link, so avoid highlighting on pages like that. In Private Browsing windows Twine saves nothing.

## Where it is stored

- **On your devices.** Highlights live in a file in the app container that Twine and its Safari extension share. Twine also keeps a few automatic backup copies of that file on the device, so it can recover if the file is damaged, and removes them after up to 30 days. Website icons are cached for up to 30 days, and your settings, such as your shortcut and switches, are stored on the device.
- **In your private iCloud.** Twine syncs highlights, and AI context if you use it, through CloudKit into your private iCloud database. We have no access to that database, and Apple's terms and privacy policy apply to it. Twine also stores a small record that notes when its starter highlights were added.
- **In your keychain.** If you use AI Access, its access token stays in your device's keychain and never leaves the device.

## Safari extension

Twine's Safari extension reads the text of pages where you allow it, on your device, to highlight your selection and to find saved highlights again. It passes that text only to the Twine app on your device and makes no network requests.

Twine marks a highlight in a page with a `mark` element that carries a `data-twine-id` attribute. The page's own scripts can see that part of the page is marked, where, and the highlight's ID.

## Website icons

Twine shows each website's icon beside its highlights. To get it, Twine requests `https://<website>/favicon.ico` directly from that website when the website appears in your library, including for the starter highlights that come with Twine. It sends no cookies and no highlight data. The website can see your IP address, the time and the usual HTTP request headers. Icons are cached on your device for up to 30 days. There is no setting to turn this off.

## Spotlight, Siri and Shortcuts

Twine can add your highlights (their text, page title, website and link) to Spotlight's search index on your device and offer them to Shortcuts. It's on by default and controlled by one switch, **Show Highlights in Spotlight, Siri and Shortcuts**. Turning it off removes them. This uses Apple's on-device system features, and Twine doesn't send the index anywhere.

## AI features

**AI context** is optional and off by default. It uses Apple's on-device language model through the Foundation Models framework. Twine gives that model the highlight, the page title and website, and the text around the highlight, on your device. Twine never uses a server-based model for this. The result is saved with the highlight and syncs through iCloud.

**AI Access** is optional, off by default and available on the Mac. When you turn it on, Twine runs a local server that listens only on your Mac. A tool that has the access token can search and read your highlights: their text, page title, website, page address, link and date. It can't change them, and surrounding page text, AI context and colour aren't included. What a tool you connect does with that data is governed by that tool and its provider. Turn AI Access off, or regenerate the token, to cut a tool off.

{% if site.pricing %}
## Purchases

Twine Pro is an optional one-time purchase, made through the App Store once Twine is available. Apple handles the payment, and we never receive your payment details. Twine checks on your device, using Apple's StoreKit, whether Pro is unlocked, and it doesn't send that anywhere or keep a record of it. Twine has no purchase server. Apple also gives developers aggregated sales figures, which don't identify you.
{% endif %}

## What Apple tells us

Apple may give developers aggregated download figures. If you have chosen to share analytics with app developers in your device settings, Apple may also pass on crash and usage reports. These reports don't identify you.

## This website

This website uses no cookies, analytics, or third-party scripts, fonts or images, and it has no forms. It is hosted on GitHub Pages, which, like any web host, processes your IP address and request details to deliver pages and protect against abuse. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). If you email us, we use your address and message only to reply.

## Sharing

We don't sell your data, there are no ads, and we hold no data about you to share. Apple (iCloud and the App Store) and GitHub (this website) are the services involved in running Twine and this site.

## Deleting your data

- **A highlight.** Delete it in Twine, and iCloud removes it from your other devices.
- **Everything.** **Settings → Library → Reset Library…** deletes your highlights on every device that uses iCloud and replaces them with the starter set. Twine first keeps a backup copy on the device, which it removes after up to 30 days. Highlights that exist only in iCloud and have never reached a device can't be deleted this way and may come back.
- **The copy in iCloud.** Use your device's iCloud storage settings to delete the data Twine keeps in iCloud.
- **The app.** Removing Twine from an iPhone removes its data from that device. On a Mac, Twine's data folders stay in your Library folder after you remove the app, until you delete them.

## Your choices and rights

We hold no personal data about you, so there is nothing for us to access, correct or delete. Your data in iCloud is yours to manage through Apple. Contact us with any privacy question.

## Children

Twine isn't directed at children and doesn't collect personal information from anyone.

## Changes

If this policy changes, we'll update it here and change the effective date.

## Contact

{{ site.developer }}, [{{ site.email }}](mailto:{{ site.email }})
