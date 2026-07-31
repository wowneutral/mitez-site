import { useEffect } from 'react';
import { SITE_URL } from '../config/forms.js';
import { PAGE_META, SITE_NAME, DEFAULT_TITLE } from '../config/pageMeta.js';

/**
 * Per-route document title, description, canonical URL, and OG/Twitter
 * tags. Written without react-helmet on purpose — this is the only place
 * on the site that needs it, and one small effect avoids pulling in a
 * dependency (and its own peer-dependency chain) for one job.
 *
 * Why this exists at all: index.html only ships one static <title> and
 * one static <meta name="description">. That's fine for a single-page
 * site, but this is a 5-route React Router app — without this, every
 * route (About, How It Works, Get Involved, Contact) shares the exact
 * same title and description in search results, which reads as thin,
 * undifferentiated content to Google rather than five distinct pages.
 */
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setRobots(content) {
  setMeta('name', 'robots', content);
}

/**
 * `title` and `description` are optional. When omitted they are read from
 * PAGE_META using `path`, which is the same map scripts/prerender-meta.mjs
 * bakes into the static HTML at build time. Sharing one source means the tags
 * a crawler reads and the tags the browser ends up with cannot drift apart.
 */
export default function SEO({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const meta = PAGE_META[path] || {};
    const t = title !== undefined ? title : meta.title;
    const d = description !== undefined ? description : meta.description;

    const fullTitle = t ? `${t} | ${SITE_NAME}` : DEFAULT_TITLE;
    document.title = fullTitle;

    const description_ = d;
    setMeta('name', 'description', description_);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description_);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description_);

    const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
    setCanonical(canonical);
    setMeta('property', 'og:url', canonical);

    setRobots(noindex ? 'noindex, nofollow' : 'index, follow');

    // Reset to the site-wide defaults on unmount so a quick route change
    // never leaves a stale title/description hanging around while the
    // next page's effect hasn't run yet.
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, path, noindex]);

  return null;
}
