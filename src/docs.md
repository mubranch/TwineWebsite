---
layout: page.njk
title: "Docs · Twine"
description: "Highlight in Safari on Mac and iPhone, sync your library, connect compatible AI tools, and troubleshoot Twine."
permalink: /docs.html
nav: docs
---
# Docs

Save your first Safari highlight, sync your library, or connect an AI tool.

Twine needs macOS {{ site.macOS }} on Mac or iOS {{ site.iOS }} on iPhone. The app is available in English, German, Spanish, French and Russian.

<nav class="toc" aria-label="On this page">

- [Get started](#get-started)
- [Highlighting in Safari on your Mac](#highlighting-in-safari-on-your-mac)
- [Highlighting in Safari on your iPhone](#highlighting-in-safari-on-your-iphone)
- [Other browsers](#other-browsers)
- [Your library](#your-library)
- [Sync with iCloud](#sync-with-icloud)
- [Connect an AI tool](#connect-an-ai-tool)
- [On-device AI context](#on-device-ai-context)
- [Troubleshooting](#troubleshooting)

</nav>

## Get started

### On your Mac

1. Open Twine. The welcome tour walks you through setup, and you can reopen it from **Settings → Safari → Show Welcome Tour…**.
2. Turn on the extension. Choose **Open Extension Settings** (in the tour, or in **Settings → Safari**), or open Safari, choose **Safari → Settings → Extensions** and turn on **Twine**.
3. Allow Twine on the sites where you read. Safari asks the first time you use Twine on a site, and **Edit Websites…** in Safari's extension settings lets you set each site yourself.
4. Select text on a page and press <kbd>⌃⇧H</kbd>. Twine highlights it and saves it with the page title and a link back.

Twine also adds a menu-bar icon that lists your recent highlights. Closing its window doesn't quit it.

### On your iPhone

1. Open Twine. Check that your iPhone uses the same Apple Account for iCloud as your Mac.
2. Turn on the Safari extension to save highlights and see them again on the page. Choose **Open Extension Settings** in Twine's settings, or go to **Settings → Apps → Safari → Extensions → Twine** and turn on **Allow Extension**.
3. Allow Twine on the sites where you read when Safari asks.
4. Select text in Safari, open the page menu and tap **Twine**.
5. Open Twine to see the new highlight in your library and let it upload to iCloud.

Menu names change between OS versions, and **Open Extension Settings** always takes you to the right place. Apple's guides cover [Safari extensions on Mac](https://support.apple.com/en-us/102343) and [on iPhone](https://support.apple.com/guide/iphone/iphab0432bf6/ios).

## Highlighting in Safari on your Mac
- **Highlight:** select text and press <kbd>⌃⇧H</kbd>. Change the shortcut in **Settings → Safari → Highlight Shortcut**.
- **Auto-highlight:** click Twine's button in Safari's toolbar to highlight every selection as you read. Click it again to turn it off.
- **Remove:** Option-click a highlight, or use the Remove Highlight shortcut <kbd>⌃⇧U</kbd>.
- **Undo:** after you remove a highlight, the page shows an **Undo** message for about 15 seconds.
- **Come back:** highlights return whenever you visit the page, as long as its text is still there. A link to a highlight opens the page scrolled to it.
- **Private Browsing:** Twine doesn't save, show or remove highlights in Private Browsing windows.

## Highlighting in Safari on your iPhone

- **Highlight:** select text, open Safari's page menu and tap **Twine**. No text selected? Select the passage first, then open Twine from the page menu again.
- **Remove:** double-tap a saved highlight on the page. Tap **Undo** in the message to restore it. Safari may also zoom if the page uses double-tap to zoom.
- **With VoiceOver or Switch Control:** delete from Twine's library instead. The extension doesn't use double-tap removal with these features.
- **Sync:** open Twine after highlighting so the new highlights can upload to iCloud.
- **Private Browsing:** Twine doesn't save, show or remove highlights there.

On both devices, a highlight can be up to 5,000 characters, a page can hold 500 highlights, and Twine saves up to 30 new highlights a minute. Auto-highlight is Mac-only and skips selections over 1,000 characters. Twine works on web pages (http and https) and leaves text fields alone.

## Other browsers

Safari is the supported browser for this release. Chrome, Chromium-based browsers and Firefox extensions aren't available to install. Safari highlighting is part of Free on Mac and iPhone.

## Your library

Open Twine to browse everything you've saved.

- **Browse** by website and page in the sidebar. The included starter library gives you examples to explore.
- **Search** the words in your highlights, page titles and websites. Narrow a search by website, page or period: Today, Past Week or Past Month.
- **Sort** by Newest First, Oldest First, Page Order, Source A to Z or Text A to Z.
- **Details** show the source, when you added the highlight and its word count, plus **More from This Page**. Open the source in Safari, copy the text or a link, copy as Markdown, share, or delete. If AI context is on, its explanation appears under **Background**.
- **Menu bar:** recent highlights appear under Twine's menu-bar icon. Choose how many in **Settings → General**.
- **Spotlight and Shortcuts:** while **Show Highlights in Spotlight, Siri and Shortcuts** is on, highlights appear in Spotlight and the **Open Highlight** action in Shortcuts opens one. The switch is in **Settings → Library** on Mac and in the Spotlight section of Settings on iPhone.
- **Spotlight results:** in the same section of Settings, choose whether a result opens in Safari or shows its highlight in Twine.

## Sync with iCloud

Twine syncs your highlights through your private iCloud database. There's no Twine account.

- Sign in to iCloud with the same Apple Account on each device.
- **From Mac:** Safari saves the highlight locally. It reaches iCloud **while Twine is running on your Mac**. Closing the window leaves Twine running. Choose **Quit** from the menu-bar icon to stop it, or turn on **Launch at Login** in **Settings → General** to start it with your Mac.
- **From iPhone:** open Twine after highlighting in Safari. The extension can't upload to iCloud by itself, and a new highlight waits on that device until you open the app.
- Deletions and library resets reach your other devices when Twine syncs. A reset covers highlights already stored on this device; the [privacy policy](/privacy#deleting-your-data) explains the limits.

## Connect an AI tool

AI Access lets compatible AI tools on your Mac search and read your highlights. It's off until you turn it on, read-only, and reachable only from your Mac. Twine runs a local [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server. Your tool needs support for local MCP servers over HTTP and bearer-token authentication.

{% if site.pricing %}
AI Access is part of Twine Pro. Until Pro is unlocked, **Settings → AI** shows **Unlock** and **Restore Purchases** in place of the AI Access switch.
{% endif %}

1. On your Mac, open **Settings → AI → AI Access** and turn on **Allow AI Tools to Read Highlights**.
2. Twine shows the **Server URL**, `http://127.0.0.1:<port>/mcp`. It starts on port 47631 and reuses the last port it used. If that port is taken, it tries the next ones. Settings always shows the current address.
3. Add the server to your AI tool with that address and the access token, sent as `Authorization: Bearer <token>`. **Copy Server URL**, **Copy Access Token** and **Copy Connection Settings** put each on your clipboard. The connection settings are JSON, ready to paste into tools that use a config file:

```json
{
  "mcpServers": {
    "twine": {
      "type": "http",
      "url": "http://127.0.0.1:47631/mcp",
      "headers": { "Authorization": "Bearer <your access token>" }
    }
  }
}
```

4. Ask your tool something, for example "Find my highlights about onboarding and group them by theme."

Good to know:

- Twine must be running. Quitting Twine, or turning AI Access off, stops the server. Closing the window doesn't.
- A copied token or set of connection settings stays on this Mac's clipboard, not Universal Clipboard, and is marked concealed for clipboard managers that honor that marker. Twine clears it after about a minute or on normal quit, unless you've copied something else. After a crash, it may remain until Twine opens again.
- If the port changes, Twine also creates a new access token and tells you to update your tool.
- **Regenerate Token…** cuts off every tool that still uses the old one.
- Keep the token private: anything that has it can read your whole library.
- Chat services that run in the cloud can't reach an address on your Mac. Use a tool that runs on your Mac and supports local MCP servers.

### What your tool can do

| Tool | What it does |
| --- | --- |
| `search_highlights` | Searches the words in highlights, titles and websites, and narrows by `domain`, `source_url` and `period` |
| `list_recent_highlights` | Lists the newest highlights |
| `get_highlight` | Reads one highlight by `id`, with a link that opens its page at the passage |
| `list_sources` | Lists pages, with their highlight counts |
| `list_domains` | Lists websites, with their page and highlight counts |
| `export_highlights` | Exports highlights as Markdown, plain text or JSON, by `ids` or by the same filters as search |

Results are newest first and paged: 25 a call by default and at most 100, with `next_offset` for the next page. Each highlight includes its text, page title, website, page address, a link back and the date it was saved. Surrounding page text, AI context and colour aren't included. Highlights and pages are also available as MCP resources, `twine://highlight/{id}` and `twine://source/{encoded page address}`.

Highlight text comes from web pages you don't control. Twine tells connected tools to treat it as quoted data, but treat what comes back like any web content. What your AI tool does with the highlights it reads is up to that tool and its provider. To check your setup, point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at the server URL with the bearer header.

## On-device AI context

Twine can write a short note explaining how a highlight fits into the text around it, using Apple Intelligence on your device. It's off by default.

{% if site.pricing %}
On-device AI context is part of Twine Pro. Unlock it, or restore an earlier purchase, in the **Twine Pro** section of Settings.
{% endif %}

- Turn it on in **Settings → AI** on Mac, or **Settings → AI Context** on iPhone.
- Open a highlight's details and read **Background**. **Refresh** writes a new explanation.
- The explanation is saved with the highlight and syncs through iCloud. A device that can't run Apple Intelligence can still display a saved explanation. It isn't shared with AI tools through AI Access.
- Writing or refreshing needs Apple Intelligence available and turned on, a supported language, and enough saved surrounding text. Settings and the details explain what's missing.
- Turning AI context off hides the explanation without deleting it.

## Troubleshooting

### Twine doesn't highlight

- Check that the extension is on. **Settings → Safari** shows its status, and **Open Extension Settings** opens Safari's settings for Twine.
- Allow Twine on the site. Reload the page and allow it when Safari asks, or set the site in Safari's extension settings.
- Nothing is saved in Private Browsing windows.
- Twine needs selectable text on a web page. Text fields are left alone, and the limits above apply.

### A highlight doesn't come back

Twine finds a highlight again from its text and the text around it. If the page has changed, or a very short highlight no longer matches its surroundings, Twine leaves it hidden rather than guess. It's still in your library, and **Open in Safari** opens the page.

### Highlights from my Mac don't reach my iPhone

- Is Twine running on your Mac? Safari highlights reach iCloud only while it is. Open it, and consider **Launch at Login**.
- Are both devices signed in to iCloud with the same Apple Account, and online?
- Open Twine on your iPhone and give it a moment to catch up.

If highlights made on your iPhone don't reach your Mac, open Twine on your iPhone first. Safari keeps the new highlights locally until the app can upload them.

### My AI tool can't connect

- Twine must be running with **AI Access** on. **Settings → AI → AI Access** shows the current address.
- Use the current token. If you regenerated it, or Twine switched ports, update your tool: Settings shows a notice when that happens.
- The tool must support MCP servers over HTTP and send the token as a bearer token.
- Cloud-hosted chat services can't reach an address on your Mac.
- A 401 response means the token is missing or wrong. A 403 means the request used a host or origin that isn't local.

### AI context isn't available

Settings and the highlight's **Background** section explain the reason: the device doesn't support Apple Intelligence, it isn't turned on, the model is still getting ready, the language isn't supported, or it isn't available right now. A saved explanation can still be displayed on a device that can't generate one.

### I want to start over

**Settings → Library → Reset Library…** replaces your local library with the starter set and queues deletions for the highlights on this device. These changes reach your other devices through iCloud. Highlights that exist only in iCloud and haven't reached this device can return. There is no Undo command; Twine keeps a local recovery copy as described in the [privacy policy](/privacy#deleting-your-data).

{% if site.pricing %}
### Twine Pro isn't unlocked

If you've already bought Pro, open the **Twine Pro** section of Settings and choose **Restore Purchases**. For a purchase that won't restore, [contact support](/support).
{% endif %}

### Still stuck?

[Contact support](/support).
