// Only built when site.indexable is true: a site that asks crawlers not to index it shouldn't hand them a sitemap.
export default class {
  data() {
    return {
      permalink: (data) => (data.site.indexable ? "/sitemap.xml" : false),
      eleventyExcludeFromCollections: true,
    };
  }

  render({ site, collections }) {
    const urls = collections.all
      .filter((entry) => !entry.data.draft && !entry.data.noindex)
      .map((entry) => `  <url><loc>${site.url}${entry.url.replace(".html", "")}</loc></url>`);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  }
}
