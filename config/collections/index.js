/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
  const projects = collection.getFilteredByGlob('./src/posts/*.md');
  return projects.reverse();
};

/**
 * Returns all reviews as a collection.
*/
const getAllReviews = collection => {
  const projects = collection.getFilteredByGlob('./src/recensioni/*.md');
  return projects.reverse(); 
}


module.exports = {
  getAllReviews,
  getAllPosts
};
