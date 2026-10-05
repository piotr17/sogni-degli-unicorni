const lodash = require('lodash');
const dayjs = require('dayjs');
require('dayjs/locale/it');
const CleanCSS = require('clean-css');
const markdownLib = require('../plugins/markdown');
const site = require('../../src/_data/meta');
const {throwIfNotType} = require('../utils');
const md = require('markdown-it')();

/** Returns the first `limit` elements of the the given array. */
const limit = (array, limit) => {
  if (limit < 0) {
    throw new Error(`Negative limits are not allowed: ${limit}.`);
  }
  return array.slice(0, limit);
};

/** Returns all entries from the given array that match the specified key:value pair. */
const where = (arrayOfObjects, keyPath, value) =>
  arrayOfObjects.filter(object => lodash.get(object, keyPath) === value);

/** Converts the given markdown string to HTML, returning it as a string. */
const toHtml = markdownString => {
  return markdownLib.renderInline(markdownString);
};

/** Removes all tags from an HTML string. */
const stripHtml = str => {
  throwIfNotType(str, 'string');
  return str.replace(/<[^>]+>/g, '');
};

/** Formats the given string as an absolute url. */
const toAbsoluteUrl = url => {
  throwIfNotType(url, 'string');
  // Replace trailing slash, e.g., site.com/ => site.com
  const siteUrl = site.url.replace(/\/$/, '');
  // Replace starting slash, e.g., /path/ => path/
  const relativeUrl = url.replace(/^\//, '');

  return `${siteUrl}/${relativeUrl}`;
};

/** Converts the given date string to ISO8610 format. */
const toISOString = dateString => dayjs(dateString).toISOString();

/** Formats a date using dayjs's conventions: https://day.js.org/docs/en/display/format */
const formatDate = (date, format) => dayjs(date).locale(site.lang || 'it').format(format);

const minifyCss = code => new CleanCSS({}).minify(code).styles;

const minifyJs = async (code, ...rest) => {
  const callback = rest.pop();
  const cacheKey = rest.length > 0 ? rest[0] : null;

  try {
    if (cacheKey && jsminCache.hasOwnProperty(cacheKey)) {
      const cacheValue = await Promise.resolve(jsminCache[cacheKey]); // Wait for the data, wrapped in a resolved promise in case the original value already was resolved
      callback(null, cacheValue.code); // Access the code property of the cached value
    } else {
      const minified = esbuild.transform(code, {
        minify: true
      });
      if (cacheKey) {
        jsminCache[cacheKey] = minified; // Store the promise which has the minified output (an object with a code property)
      }
      callback(null, (await minified).code); // Await and use the return value in the callback
    }
  } catch (err) {
    console.error('jsmin error: ', err);
    callback(null, code); // Fail gracefully.
  }
};

/**
 * Render content as inline markdown if single line, or full
 * markdown if multiline. for md in yaml
 * @param {string} [content]
 * @param {import('markdown-it').Options} [opts]
 * @return {string|undefined}
 */

const mdInline = (content, opts) => {
  if (!content) {
    return;
  }

  if (opts) {
    md.set(opts);
  }

  let inline = !content.includes('\n');

  // If there's quite a bit of content, we want to make sure
  // it's marked up for readability purposes
  if (inline && content.length > 200) {
    inline = false;
  }

  return inline ? md.renderInline(content) : md.render(content);
};

const COLORING_SUFFIX = '-da-colorare';

const hasTag = (item, tag) => [].concat(item.data.tags || []).includes(tag);

/** Legacy key: the title-based slug the layouts used before the explicit link. */
const titleKey = title =>
  String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[\s'’:,-]+/g, '');

/** Key of the story a coloring page belongs to: `storia` front matter, else its file slug without the suffix. */
const coloringStoryKey = item =>
  item.data.storia || item.fileSlug.replace(new RegExp(`${COLORING_SUFFIX}$`), '');

/** Finds the coloring page of a story (explicit `storia` link, then file slug, then title). */
const relatedColoring = (items, story) => {
  const colorings = items.filter(item => hasTag(item, 'unicornidacolorare'));
  return (
    colorings.find(item => coloringStoryKey(item) === story.fileSlug) ||
    colorings.find(item => titleKey(item.data.title) === titleKey(story.data.title))
  );
};

/** Finds the story a coloring page was drawn from (explicit `storia` link, then file slug, then title). */
const relatedStory = (items, coloring) => {
  const stories = items.filter(item => item.data.layout === 'post');
  const key = coloringStoryKey(coloring);
  return (
    stories.find(item => item.fileSlug === key) ||
    stories.find(item => titleKey(item.data.title) === titleKey(coloring.data.title))
  );
};

// ------------------------------------------------------------------ SEO

const SITE_NAME = site.siteName;

/** Plain text on one line: no tags, no markdown emphasis, collapsed whitespace. */
const plainText = value =>
  String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_#`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Cuts at a word boundary, adding an ellipsis only when something was removed. */
const clip = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length).replace(/[,.;:]$/, '') + '…';
};

/**
 * <title>: the SEO title of the page (metatitle) or its title, with the site name when the whole
 * stays within ~60 characters. A longer metatitle is kept whole: Google shortens it on display,
 * cutting it here would only drop keywords.
 */
const pageTitle = (data, isHome = false) => {
  if (isHome) return plainText(data.seo?.title || data.metatitle || `${SITE_NAME}: storie della buonanotte e disegni da colorare`);
  const name = plainText(data.title);
  // stories and drawings get a consistent, descriptive pattern: the generated metatitles were
  // often off-topic ("Guida Completa e Interpretazioni") and identical between story and drawing
  if (data.layout === 'post') return fit([`${name}: fiaba della buonanotte`, `${name}: fiaba`, name]);
  if (data.layout === 'pagina-da-colorare') return fit([`${name} da colorare: disegno gratis`, `${name} da colorare`, name]);
  const base = plainText(data.seo?.title || data.metatitle || data.title || SITE_NAME);
  const branded = `${base} | ${SITE_NAME}`;
  return base.includes(SITE_NAME) || branded.length > 62 ? base : branded;
};

/**
 * Most descriptive variant that fits in 62 characters: keywords first, the site name only
 * when there is room for it.
 */
const fit = variants => {
  for (const variant of variants) {
    if (`${variant} | ${SITE_NAME}`.length <= 62) return `${variant} | ${SITE_NAME}`;
    if (variant.length <= 62) return variant;
  }
  return variants[variants.length - 1];
};

/** Headings inside a page body start at h2: the layout already prints the only h1. */
const demoteHeadings = html => String(html || '').replace(/<(\/?)h1(\b[^>]*)>/g, '<$1h2$2>');

/** Meta description: 150-160 characters, from the page or a sensible fallback. */
const metaDescription = (description, fallback) => {
  const text = plainText(description);
  // a few generated descriptions are five words long: the fallback says more
  const chosen = text.length >= 70 || !fallback ? text || plainText(fallback) : plainText(fallback);
  return clip(chosen || plainText(site.siteDescription), 158);
};

/** Absolute, encoded URL (paths with apostrophes and accents are valid in og:image and sitemaps). */
const absoluteUrl = url => {
  if (!url) return '';
  if (/^https?:/.test(url)) return url;
  const base = site.url.replace(/\/$/, '');
  return encodeURI(`${base}${url.startsWith('/') ? '' : '/'}${url}`).replace(/'/g, '%27');
};

/** Minutes to read a story aloud to a child (~130 words a minute). */
const readingMinutes = content => Math.max(1, Math.round(plainText(content).split(' ').length / 130));

// ------------------------------------------------------------------ linking interno

const isStory = item => item.data.layout === 'post';

/** Stories close to this one: shared tags first, then nearest by date. Deterministic. */
const relatedStories = (items, url, limit = 3) => {
  const stories = items.filter(isStory);
  const index = stories.findIndex(item => item.url === url);
  if (index < 0) return stories.slice(-limit).reverse();
  const generic = new Set(['posts', 'unicorni', 'storia per bambini']);
  const tags = new Set([].concat(stories[index].data.tags || []).map(t => String(t).toLowerCase()).filter(t => !generic.has(t)));
  return stories
    .map((item, i) => ({
      item,
      shared: [].concat(item.data.tags || []).filter(t => tags.has(String(t).toLowerCase())).length,
      distance: Math.abs(i - index)
    }))
    .filter(entry => entry.item.url !== url)
    .sort((a, b) => b.shared - a.shared || a.distance - b.distance)
    .slice(0, limit)
    .map(entry => entry.item);
};

/** Previous and next story by date. */
const storyNeighbours = (items, url) => {
  const stories = items.filter(isStory);
  const index = stories.findIndex(item => item.url === url);
  return {prev: index > 0 ? stories[index - 1] : null, next: index >= 0 ? stories[index + 1] || null : null};
};

/** Other coloring pages around this one (by date), for the "altri disegni" block. */
const nearbyColorings = (items, url, limit = 6) => {
  const colorings = items.filter(item => hasTag(item, 'unicornidacolorare'));
  const index = Math.max(0, colorings.findIndex(item => item.url === url));
  return colorings
    .filter(item => item.url !== url)
    .sort((a, b) => Math.abs(colorings.indexOf(a) - index) - Math.abs(colorings.indexOf(b) - index))
    .slice(0, limit);
};

/** Breadcrumb trail of a page, shared by the visible breadcrumb and the BreadcrumbList schema. */
const breadcrumbs = (data, url) => {
  const home = {name: 'Home', url: '/'};
  const title = plainText(data.title);
  if (url === '/' || !title) return [];
  if (data.layout === 'post') return [home, {name: 'Storie', url: '/storie/'}, {name: title, url}];
  if (data.layout === 'pagina-da-colorare')
    return [home, {name: 'Disegni da colorare', url: '/unicorni-da-colorare/'}, {name: `${title} da colorare`, url}];
  if (data.layout === 'review') return [home, {name: 'Recensioni', url: '/recensioni/'}, {name: title, url}];
  if (data.layout === 'gioco') return [home, {name: 'Giochi per la scuola', url: '/giochi-didattici/'}, {name: title, url}];
  return [home, {name: title, url}];
};

module.exports = {
  demoteHeadings,
  breadcrumbs,
  pageTitle,
  metaDescription,
  absoluteUrl,
  readingMinutes,
  plainText,
  relatedStories,
  storyNeighbours,
  nearbyColorings,
  relatedColoring,
  relatedStory,
  limit,
  toHtml,
  where,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  minifyJs,
  mdInline
};
