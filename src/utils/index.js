// Mirrors Base44's createPageUrl: turns a page name (optionally with a query
// string) into a router path, e.g.
//   createPageUrl("Properties")            -> "/Properties"
//   createPageUrl("PropertyDetail?id=123") -> "/PropertyDetail?id=123"
export function createPageUrl(pageName) {
  if (!pageName) return "/";
  const [name, query] = pageName.split("?");
  const path = "/" + name.trim();
  return query ? `${path}?${query}` : path;
}
