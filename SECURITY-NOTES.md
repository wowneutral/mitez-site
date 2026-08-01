# Security notes

## Dependency audit, 1 August 2026

`npm audit` reports four advisories. All four were triaged and none are
reachable in this deployment. Recorded here so the next person does not have
to redo the analysis, or worse, take a breaking upgrade to silence a warning
that does not apply.

### esbuild <=0.24.2 via vite 5 (moderate, x2)

GHSA-67mh-4wv8-2f99: a malicious website can send requests to the esbuild
**development server** and read the responses.

Not applicable to the deployed site. `vite` is a devDependency and does not
ship in the bundle; the advisory only affects a machine while `npm run dev`
is running. The fix requires vite 8, two majors up from vite 5, which is a
real breaking change for a working three.js app.

Decision: not upgrading now. Mitigation: do not browse untrusted sites while
the dev server is running. Revisit when there is time to test a vite upgrade
properly.

### react-router / react-router-dom 6.30.4 (moderate, x2)

GHSA-337j-9hxr-rhxg: arbitrary constructor injection via `deserializeErrors()`
during **SSR hydration**. This app has no SSR. There is no `hydrateRoot`, no
`renderToString`, no `StaticRouter`. Prerendering here only rewrites meta tags
in static HTML; React mounts client-side as normal. Not reachable.

GHSA-wrjc-x8rr-h8h6: open redirect via a backslash in a `<Link>` or
`useNavigate` target. Requires the navigation target to be attacker
controlled. This app has no `useNavigate` and no programmatic navigation at
all, and every `<Link to=...>` target is a hardcoded literal ("/", "/about",
"/terms" and so on) or comes from the hardcoded LINKS array in Nav.jsx. No
user input ever reaches a router target. Not reachable.

The advisory range is 6.0.0 to 7.17.0, so the fix means moving to
react-router 7.18+, a major upgrade. `npm audit fix` cannot do it because
package.json pins `^6.26.0`.

Decision: not upgrading now. Re-evaluate if the site ever adds programmatic
navigation, a redirect parameter, or server rendering, at which point the
open-redirect issue becomes live and the upgrade is required.

### Re-check trigger

Run `npm audit` again and revisit this file if any of these change:
- the site gains SSR or server-side rendering
- any route target becomes dynamic or user-supplied
- a new advisory lands against a package that ships in the bundle
