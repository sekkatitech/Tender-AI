import { useMemo, useState } from "react"
import { ArrowLeft, BookOpen, Mail, MessageCircleQuestion, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NAV_MODULES } from "@/config/navigation"
import { HELP_ARTICLES, type HelpArticle } from "@/config/help-articles"
import { searchHelpArticles } from "@/features/help/lib/search"
import { cn } from "@/lib/utils"

const ICON_BY_MODULE = new Map(NAV_MODULES.map((m) => [m.id, m.icon]))

function iconFor(article: HelpArticle) {
  return (article.moduleId && ICON_BY_MODULE.get(article.moduleId)) || BookOpen
}

export function HelpWidget() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const results = useMemo(
    () => (query.trim() ? searchHelpArticles(query, HELP_ARTICLES) : HELP_ARTICLES),
    [query]
  )

  const selectedArticle = selectedId ? HELP_ARTICLES.find((a) => a.id === selectedId) : null

  function close() {
    setOpen(false)
    setSelectedId(null)
    setQuery("")
  }

  return (
    <>
      {open && (
        <div className="fixed right-6 bottom-24 z-50 flex max-h-[32rem] w-96 flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a2a4e]/92 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75),0_0_40px_-12px_hsl(195_100%_60%/0.35)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            {selectedArticle ? (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : (
              <p className="text-sm font-semibold text-foreground">Help Center</p>
            )}
            <Button variant="ghost" size="icon" aria-label="Close help" onClick={close}>
              <X className="size-4" />
            </Button>
          </div>

          {selectedArticle ? (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <h3 className="text-base font-semibold text-foreground">{selectedArticle.title}</h3>
              <div className="mt-3 flex flex-col gap-3">
                {selectedArticle.body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/85">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question or search for help…"
                    className="pl-8"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No articles match "{query}" — try different words, or email support below.
                  </p>
                )}
                {results.map((article) => {
                  const Icon = iconFor(article)
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedId(article.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-muted/60"
                      )}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{article.title}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <div className="border-t border-border px-4 py-3">
            <a
              href="mailto:support@tenderpilot.ai"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
            >
              <Mail className="size-3.5" />
              Still stuck? Email support@tenderpilot.ai
            </a>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close help" : "Open help"}
        className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full p-0 shadow-[0_8px_24px_-4px_hsl(195_100%_60%/0.45)]"
      >
        {open ? <X className="size-5" /> : <MessageCircleQuestion className="size-5" />}
      </Button>
    </>
  )
}
