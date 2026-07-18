/**
 * Renders CMS HTML after line-ending + tag-balance repair so fragments cannot
 * break surrounding React layout (a common hydration failure mode).
 */
import { balanceHtml, normalizeText } from "@/lib/html";

export default function SafeHtml({ html, className, as: Tag = "div" }) {
  const repaired = balanceHtml(normalizeText(html || ""));
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: repaired }}
      suppressHydrationWarning
    />
  );
}
