/** Latest coloring pages, used for the cross links under each story. */
const disegniDaColorare = collectionApi =>
  collectionApi.getFilteredByTag('unicornidacolorare').reverse().slice(0, 10);

/** Reviews in src/recensioni, newest first. */
const recensioni = collectionApi =>
  collectionApi
    .getAll()
    .filter(item => item.inputPath.includes('/recensioni/') && item.data.layout === 'review')
    .sort((a, b) => b.date - a.date);

/** Every story (layout post), oldest first. */
const storie = collectionApi => collectionApi.getAll().filter(item => item.data.layout === 'post' && item.url).sort((a, b) => a.date - b.date);

/** Every coloring page, oldest first. */
const disegni = collectionApi => collectionApi.getFilteredByTag('unicornidacolorare');

/** Games and tools of La scuola degli unicorni (layout gioco), oldest first. */
const giochi = collectionApi =>
  collectionApi.getAll().filter(item => item.data.layout === 'gioco' && item.url).sort((a, b) => a.date - b.date);

module.exports = {
  disegniDaColorare,
  recensioni,
  storie,
  disegni,
  giochi
};
