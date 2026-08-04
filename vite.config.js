import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',

    /**
     * Split the vendors apart rather than shipping one bundle.
     *
     * Everything used to land in a single 2MB file, so a visitor opening
     * the Terms downloaded three.js, drei and the Spline loader to read a
     * legal document — and the homepage could not paint a word until all
     * of it had parsed.
     *
     * Three groups, drawn along the lines of what actually changes
     * together:
     *
     *   three   — only ever needed by the hero, and now lazy, so it is
     *             fetched after the copy is on screen and never at all on
     *             a text page.
     *   motion  — the animation runtime, needed by every route.
     *   react   — React and the router: the most stable of the three, so
     *             it stays cached across deploys even when the site's own
     *             code changes.
     *
     * Separating them also means editing the site does not invalidate a
     * visitor's cached copy of three.js, which is the largest single
     * thing they will ever download from us.
     */
    /**
     * Keep the 3D chunk out of the document's preload list.
     *
     * Lazy-loading HeroScene was not enough on its own: Vite still wrote
     * a <link rel="modulepreload"> for the three chunk into index.html,
     * and because every prerendered route is a copy of that shell, every
     * page — Terms included — was still fetching 570kB of 3D engine at
     * high priority before anything had rendered. The import was
     * deferred and the download was not, which is the worst of both.
     *
     * Filtered for the HTML only. The runtime dependency map is left
     * alone, so when the hero does ask for the scene it still preloads
     * what it needs.
     */
    modulePreload: {
      resolveDependencies(filename, deps, { hostType }) {
        if (hostType !== 'html') return deps;
        return deps.filter((dep) => !/\/three-[\w-]+\.js$/.test(dep));
      },
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('@splinetool')
          ) {
            return 'three';
          }
          if (id.includes('motion')) return 'motion';
          if (id.includes('react') || id.includes('scheduler')) return 'react';
          return undefined;
        },
      },
    },

    // The hero chunk is legitimately large and always will be. Warning
    // about it on every build only trains everyone to ignore build output.
    chunkSizeWarningLimit: 900,
  },
});
