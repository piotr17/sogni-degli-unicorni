/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
  const projects = collection.getFilteredByGlob('./src/posts/*.md');
  return projects.reverse();
};

/**
 * Returns all reviews as a collection.
*/
const getAllReviews = collection => {
  const recensioni = collection.getFilteredByGlob('./src/recensioni/*.md');
  return recensioni.reverse(); 
}
const getAllUnicorniDaColorare = collection => {
  const unicornidacolorare = collection.getFilteredByGlob('../src/unicorni-da-colorare/*.md');
  return unicornidacolorare.reverse(); 
}

module.exports = {
  getAllReviews,
  getAllUnicorniDaColorare,
  getAllPosts
};
