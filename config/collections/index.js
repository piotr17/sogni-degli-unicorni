/** Latest coloring pages, used for the cross links under each story. */
const disegniDaColorare = collectionApi =>
  collectionApi.getFilteredByTag('unicornidacolorare').reverse().slice(0, 10);

/** Reviews in src/recensioni, newest first. */
const recensioni = collectionApi =>
  collectionApi
    .getAll()
    .filter(item => item.inputPath.includes('/recensioni/') && item.data.layout === 'review')
    .sort((a, b) => b.date - a.date);

module.exports = {
  disegniDaColorare,
  recensioni
};
