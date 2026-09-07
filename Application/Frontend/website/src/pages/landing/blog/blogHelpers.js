export function formatDisplayDate(article) {
  if (!article) return 'Recent';
  if (article.publishedAt?.toDate) {
    return article.publishedAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (article.publishedAt) {
    const d = new Date(article.publishedAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  if (article.createdAt?.toDate) {
    return article.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (article.createdAt) {
    const d = new Date(article.createdAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  return article.date || 'Recent';
}

export function getArticleTimestamp(article) {
  if (!article) return 0;
  if (article.publishedAt?.toMillis) return article.publishedAt.toMillis();
  if (article.publishedAt) {
    const t = new Date(article.publishedAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (article.createdAt?.toMillis) return article.createdAt.toMillis();
  if (article.createdAt) {
    const t = new Date(article.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (article.date) {
    const t = new Date(article.date).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}
