import type { HelpArticle } from "@/config/help-articles"

/**
 * Small dependency-free relevance scorer — the knowledge base is ~17 static
 * articles, not enough to justify a fuzzy-search library. Title matches
 * outrank keyword matches, which outrank a plain body substring match.
 */
export function searchHelpArticles(query: string, articles: HelpArticle[]): HelpArticle[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)

  if (terms.length === 0) return []

  const scored = articles
    .map((article) => {
      const title = article.title.toLowerCase()
      const keywords = article.keywords.map((k) => k.toLowerCase())
      const body = article.body.toLowerCase()

      let score = 0
      for (const term of terms) {
        if (title.includes(term)) score += 10
        if (keywords.some((k) => k.includes(term))) score += 6
        if (body.includes(term)) score += 2
      }
      return { article, score }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.map((r) => r.article)
}
