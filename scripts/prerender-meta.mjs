/**
 * Bake per-route metadata into static HTML after `vite build`.
 *
 * Why this exists
 * ---------------
 * This is a single-page app: one index.html, and SEO.jsx swaps the title and
 * meta tags in JavaScript once React mounts. Google executes JavaScript, so
 * search results are fine. Link-preview crawlers do not — iMessage, Slack,
 * WhatsApp, Facebook and LinkedIn fetch the HTML, read the tags that are
 * physically in it, and never run a line of script. So every shared link,
 * whatever page it pointed at, previewed as the homepage.
 *
 * What it does
 * ------------
 * For each route it copies dist/index.html to dist/<route>/index.html with the
 * title, description, OG and Twitter tags and canonical URL rewritten. The
 * static file wins over the SPA fallback in public/_redirects, so a cold
 * request for /about is served real HTML with real metadata; React then
 * hydrates and the router renders the same page. No behaviour changes for a
 * visitor, and the crawler finally sees the right thing.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const { PAGE_META, fullTitle, OG_IMAGE } = await import(
  join(ROOT, 'src/config/pageMeta.js')
);
const SITE_URL = 'https://mitez.org';

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[prerender-meta] dist/index.html not found — run vite build first.');
  process.exit(1);
}
const shell = await readFile(join(DIST, 'index.html'), 'utf8');

/** Replace an attribute's content, or report if the tag was not found. */
function setMeta(html, selectorAttr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${selectorAttr}="${key}"\\s+content=")[^"]*(")`,
    'i',
  );
  if (!re.test(html)) {
    console.warn(`[prerender-meta] no <meta ${selectorAttr}="${key}"> in shell`);
    return html;
  }
  return html.replace(re, `$1${value}$2`);
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

let written = 0;
for (const [route, meta] of Object.entries(PAGE_META)) {
  const title = esc(fullTitle(meta.title));
  const desc = esc(meta.description);
  const url = `${SITE_URL}${route === '/' ? '/' : route}`;

  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = setMeta(html, 'name', 'description', desc);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', desc);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:image', `${SITE_URL}${OG_IMAGE}`);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', desc);
  html = setMeta(html, 'name', 'twitter:image', `${SITE_URL}${OG_IMAGE}`);

  // Canonical: add if absent, replace if present.
  if (/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*(")/i,
      `$1${url}$2`,
    );
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${url}" />\n</head>`);
  }

  if (route === '/') {
    await writeFile(join(DIST, 'index.html'), html);
  } else {
    const dir = join(DIST, route.replace(/^\//, ''));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html);
  }
  written += 1;
  console.log(`[prerender-meta] ${route.padEnd(16)} ${fullTitle(meta.title)}`);
}
console.log(`[prerender-meta] wrote ${written} route(s).`);

/* ---------------------------------------------------------------------
 * Sitemap, generated from the same PAGE_META the routes and prerendering
 * use.
 *
 * It was previously a hand-maintained file in public/. That made four
 * places to remember when adding a route (the Route, PAGE_META,
 * _redirects and the sitemap), and the sitemap is the one nobody notices
 * has drifted, because nothing breaks visibly when it does.
 *
 * lastmod comes from each page's real last commit date rather than
 * today's, so a rebuild that changed nothing does not tell search
 * engines every page is new.
 * ------------------------------------------------------------------- */
import { execSync } from 'node:child_process';

// Rough priority by depth: the homepage first, then real pages, with the
// legal pages last since they are not what anyone is searching for.
const PRIORITY = { '/': '1.0', '/privacy': '0.4', '/safety': '0.7' };
const CHANGEFREQ = { '/': 'weekly', '/privacy': 'yearly', '/safety': 'monthly' };

// Explicit, because two components carry a "Page" suffix that no naming
// convention would infer (/how-it-works -> HowItWorksPage.jsx). Guessing
// here silently fell back to today's date for those two routes.
const ROUTE_FILES = {
  '/': 'src/pages/Home.jsx',
  '/about': 'src/pages/About.jsx',
  '/how-it-works': 'src/pages/HowItWorksPage.jsx',
  '/get-involved': 'src/pages/GetInvolvedPage.jsx',
  '/gainesville': 'src/pages/Gainesville.jsx',
  '/safety': 'src/pages/Safety.jsx',
  '/privacy': 'src/pages/Privacy.jsx',
  '/contact': 'src/pages/Contact.jsx',
};

function lastCommitDate(route) {
  const file = ROUTE_FILES[route];
  if (!file) {
    console.warn(`[prerender-meta] no component mapped for ${route}, using today`);
    return new Date().toISOString().slice(0, 10);
  }
  try {
    const d = execSync(`git log -1 --format=%ad --date=short -- "${file}"`, {
      cwd: ROOT, encoding: 'utf8',
    }).trim();
    if (d) return d;
  } catch {
    /* not a git checkout */
  }
  return new Date().toISOString().slice(0, 10);
}

const urls = Object.keys(PAGE_META)
  .map((route) => {
    const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastCommitDate(route)}</lastmod>`,
      `    <changefreq>${CHANGEFREQ[route] || 'monthly'}</changefreq>`,
      `    <priority>${PRIORITY[route] || '0.8'}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

await writeFile(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`[prerender-meta] sitemap.xml regenerated with ${Object.keys(PAGE_META).length} url(s).`);
