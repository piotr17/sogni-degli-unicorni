/**
 * I strive to keep the `.eleventy.js` file clean and uncluttered. Most adjustments must be made in:
 *  - `./config/collections/index.js`
 *  - `./config/filters/index.js`
 *  - `./config/plugins/index.js`
 *  - `./config/shortcodes/index.js`
 *  - `./config/transforms/index.js`
 */

// get package.json
const packageVersion = require('./package.json').version;

// module import filters
const {
  limit,
  toHtml,
  where,
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  minifyJs,
  mdInline,
  relatedColoring,
  relatedStory,
  breadcrumbs,
  demoteHeadings,
  pageTitle,
  metaDescription,
  absoluteUrl,
  readingMinutes,
  plainText,
  relatedStories,
  storyNeighbours,
  nearbyColorings
} = require('./config/filters/index.js');

// module import shortcodes
const {
  imageShortcodePlaceholder,
  includeRaw,
  liteYoutube
} = require('./config/shortcodes/index.js');

// module import collections
const {disegniDaColorare, recensioni, storie, disegni, giochi} = require('./config/collections/index.js');

// plugins
const markdownLib = require('./config/plugins/markdown.js');
const {EleventyRenderPlugin} = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const {slugifyString} = require('./config/utils');
const {escape} = require('lodash');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const inclusiveLangPlugin = require('@11ty/eleventy-plugin-inclusive-language');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = eleventyConfig => {
  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');
  eleventyConfig.addWatchTarget('./utils/*.js');

  // --------------------- layout aliases -----------------------
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('home', 'home.njk');
  eleventyConfig.addLayoutAlias('blog', 'blog.njk');
  eleventyConfig.addLayoutAlias('post', 'post.njk');
  eleventyConfig.addLayoutAlias('review', 'review.njk');
  eleventyConfig.addLayoutAlias('reviews', 'reviews.njk');
  // 	---------------------  Custom filters -----------------------
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('stripHtml', stripHtml);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('cssmin', minifyCss);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', minifyJs);
  eleventyConfig.addFilter('md', mdInline);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('relatedColoring', relatedColoring);
  eleventyConfig.addFilter('relatedStory', relatedStory);
  eleventyConfig.addFilter('breadcrumbs', breadcrumbs);
  eleventyConfig.addFilter('demoteHeadings', demoteHeadings);
  eleventyConfig.addFilter('pageTitle', pageTitle);
  eleventyConfig.addFilter('metaDescription', metaDescription);
  eleventyConfig.addFilter('absUrl', absoluteUrl);
  eleventyConfig.addFilter('readingMinutes', readingMinutes);
  eleventyConfig.addFilter('plainText', plainText);
  eleventyConfig.addFilter('relatedStories', relatedStories);
  eleventyConfig.addFilter('storyNeighbours', storyNeighbours);
  eleventyConfig.addFilter('nearbyColorings', nearbyColorings);
  eleventyConfig.addFilter('entries', Object.entries);

  // 	--------------------- Custom shortcodes ---------------------
  eleventyConfig.addNunjucksAsyncShortcode('imagePlaceholder', imageShortcodePlaceholder);
  eleventyConfig.addShortcode('youtube', liteYoutube);
  // email protetta dallo spam: l'indirizzo intero non compare mai nell'HTML (vedi base.njk)
  eleventyConfig.addShortcode('email', (label = '') => {
    const [user, domain] = require('./src/_data/meta.js').authorEmail.split('@');
    const reversed = `${user}@${domain}`.split('').reverse().join('');
    const text = label || `${user} [at] ${domain}`;
    return `<a class="email" href="#" data-e="${reversed}" rel="nofollow">${text}</a>`;
  });
  eleventyConfig.addShortcode('include_raw', includeRaw);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`); // current year, stephanie eckles
  eleventyConfig.addShortcode('packageVersion', () => `v${packageVersion}`);

  // 	--------------------- Custom transforms ---------------------
  eleventyConfig.addPlugin(require('./config/transforms/html-config.js'));

  // 	--------------------- Custom Template Languages ---------------------
  eleventyConfig.addPlugin(require('./config/template-languages/css-config.js'));
  eleventyConfig.addPlugin(require('./config/template-languages/js-config.js'));

  // 	--------------------- Custom collections -----------------------
  eleventyConfig.addCollection('disegniDaColorare', disegniDaColorare);
  eleventyConfig.addCollection('storie', storie);
  eleventyConfig.addCollection('disegni', disegni);
  eleventyConfig.addCollection('recensioni', recensioni);
  eleventyConfig.addCollection('giochi', giochi);

  // 	--------------------- Plugins ---------------------
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  // 	--------------------- Passthrough File Copy -----------------------
  // same path
  ['src/assets/fonts/', 'src/assets/images/'].forEach(path =>
    eleventyConfig.addPassthroughCopy(path)
  );
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // i giochi della scuola degli unicorni sono pagine HTML autonome, copiate così come sono
  eleventyConfig.addPassthroughCopy('src/giochi-didattici/*/gioca.html');
  eleventyConfig.ignores.add('src/giochi-didattici/*/gioca.html');
  // social icons to root directory
  eleventyConfig.addPassthroughCopy({
    'src/assets/images/favicon/*': '/'
  });

  eleventyConfig.addPassthroughCopy({
    'src/assets/css/global.css': 'src/_includes/global.css'
  });

  // 	--------------------- general config -----------------------
  return {
    // Pre-process *.md, *.html and global data files files with: (default: `liquid`)
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // Optional (default is set): If your site deploys to a subdirectory, change `pathPrefix`, for example with with GitHub pages
    pathPrefix: '/',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
};
