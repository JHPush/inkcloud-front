export function getSortedReviews(reviews, sort) {
  if (sort === "rating") {
    // 별점 높은 순
    return [...reviews].sort((a, b) => b.rating - a.rating);
  }
  if (sort === "like") {
    // 좋아요 많은 순
    return [...reviews].sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
  }
  // 최신순 (updatedAt, createdAt 기준)
  return [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });
}