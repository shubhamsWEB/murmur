import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Site, { pathOf } from "./Site";
import "./styles.css";

// Each page arrives already rendered (scripts/prerender.mjs), so React takes over the HTML that's there. In
// development the page is empty and React renders it.
const root = document.getElementById("root");
const site = (
  <StrictMode>
    <Site path={pathOf(window.location.pathname)} />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, site);
else createRoot(root).render(site);
