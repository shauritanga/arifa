/**
 * Pure HTML helpers for CMS fragments. Kept free of Prisma so they can be
 * imported from both server pages and client components.
 */

/**
 * Browsers normalize \r\n → \n when HTML is parsed into the DOM. CMS content
 * (especially Windows-seeded HTML) often stores CRLF, which then fails React
 * hydration against dangerouslySetInnerHTML.
 */
export function normalizeText(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

const VOID_HTML_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Close unclosed tags so CMS HTML cannot break out of its container.
 * Unbalanced markup (e.g. a missing </div>) causes the browser to reparent
 * following React siblings during parse, which shows up as a hydration error.
 */
export function balanceHtml(html) {
  if (typeof html !== "string" || !html) return html || "";
  const str = normalizeText(html);
  const stack = [];
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
  let match;

  while ((match = tagRe.exec(str)) !== null) {
    const full = match[0];
    const name = match[1].toLowerCase();
    if (VOID_HTML_TAGS.has(name) || full.endsWith("/>")) continue;

    if (full.startsWith("</")) {
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i] === name) {
          stack.splice(i);
          break;
        }
      }
    } else {
      stack.push(name);
    }
  }

  if (stack.length === 0) return str;
  return str + stack.reverse().map((tag) => `</${tag}>`).join("");
}
