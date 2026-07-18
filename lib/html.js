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

/**
 * Unwrap TipTap-style nested paragraphs inside list items:
 * <li><p>text</p></li> → <li>text</li>
 */
function unwrapListItemParagraphs(html) {
  return String(html || "").replace(
    /<li([^>]*)>\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>\s*<\/li>/gi,
    "<li$1>$2</li>",
  );
}

/** True when a section is the curriculum / core modules block. */
export function isModulesSection(section) {
  const heading = String(section?.heading || "").toLowerCase();
  return heading.includes("module");
}

/**
 * Match public certification page order: every section first, core modules last.
 */
export function orderCertificationSections(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return sections || [];
  const rest = [];
  const modules = [];
  for (const section of sections) {
    if (isModulesSection(section)) modules.push(section);
    else rest.push(section);
  }
  return [...rest, ...modules];
}

/**
 * Normalize certification module HTML into card-friendly blocks:
 *   <div class="module"><h6>Title</h6><ul>...</ul></div>
 *
 * The public curriculum layout styles only direct `.module` children. The
 * admin rich-text editor often strips custom classes and rewrites titles as
 * plain paragraphs — this restores a consistent card layout either way.
 */
export function formatCertificateModules(html) {
  if (typeof html !== "string" || !html.trim()) return "";
  const src = unwrapListItemParagraphs(balanceHtml(normalizeText(html)));

  // Already structured with module cards — keep them, just clean list items.
  if (/class=["']module["']/i.test(src)) {
    return unwrapListItemParagraphs(src);
  }

  // TipTap / plain format: <p|h*>Module N: Title</p|h*> + following <ul>
  const re =
    /<(?:p|h[1-6])(?:\s[^>]*)?>\s*(Module\s+\d+\s*:[^<]*?)\s*<\/(?:p|h[1-6])>\s*(<ul[\s\S]*?<\/ul>)/gi;
  const parts = [];
  let match;
  while ((match = re.exec(src)) !== null) {
    const title = match[1].replace(/\s+/g, " ").trim();
    const list = unwrapListItemParagraphs(match[2]);
    parts.push(`<div class="module"><h6>${title}</h6>${list}</div>`);
  }

  if (parts.length > 0) return parts.join("\n");
  return src;
}
