import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Site from "./Site";

// Built for Node by `npm run build`, and used once by scripts/prerender.mjs to write every page's HTML and <head>.
export { routes } from "./Site";
export { headFor, llmsText, notFoundHead } from "./seo";
export { guides } from "./guides";

export function render(path) {
  return renderToString(<StrictMode><Site path={path} /></StrictMode>);
}
