# REGAMSA Website

Static marketing site for REGAMSA Medical (hospital gas-medical equipment). No build system, package manager, tests, or lint.

## Run / verify
- No build/test/lint commands. Preview changes by opening `index.html` in a browser.
- Shipped site is exactly the root files: `index.html`, `styles.css`, `app.js`. Edit those for any live-site change.

## Structure
- `assets/` holds images; filenames contain spaces, so URLs must be percent-encoded (`%20`) in HTML/JS. Product images are now `.webp` (logos/certs remain `.png`); paths are case-sensitive on GitHub Pages. All pages must be saved UTF-8 without BOM.
- `Pruebas de concepto/1` and `/2` are design prototypes/reference fragments. Product cards (concepto 1) and the catalog rotator (concepto 2) are integrated into `index.html` + `styles.css`. The monitoring panel and NFPA badge from concepto 2 were removed; the catalog rotator cards now link to separate pages (`catalogo-columnas.html`, `catalogo-paneles.html`, `catalogo-alarmas.html`) instead of in-page views. Prototype CSS was merged into `styles.css` (single CSS file); global/alternate design systems (nav, footer, resets) were not imported to avoid conflicts.

## Code quirks
- Image gallery logic lives in `app.js` (`galleries` object + `showImage()`). `panels`/`columns` galleries are prefixed with `base='assets/Secciones de Productos/'`; the `catalog` gallery is special-cased to use a full `assets/...` path. Follow that pattern when adding a gallery.
- Product detail (3rd level) is `producto.html?id=<product-id>`, data in `productos.js` (`window.PRODUCTS`). Add new products there and link cards via `producto.html?id=...`. All product cards share the same style/structure.
- UI/content is in Spanish; keep files UTF-8.

## Git
- Active branch is `develop` (ahead of `main`).
- Commit messages use prefixes like `feat:`, `style:`, `cleanup:`.