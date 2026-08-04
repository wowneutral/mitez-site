// Single source of truth for every route's title and description.
//
// Used twice, and that is the point:
//  1. At runtime by SEO.jsx, so the browser tab and in-app navigation show
//     the right title.
//  2. At BUILD time by scripts/prerender-meta.mjs, which bakes these values
//     into a static HTML file per route.
//
// Step 2 exists because this is a single-page app. Everything SEO.jsx does
// happens in JavaScript after the page loads. Google runs JavaScript so it
// sees the result — but the crawlers behind link previews (iMessage, Slack,
// WhatsApp, Facebook, LinkedIn) do not. They read the raw HTML and stop.
// Without prerendering, every shared link showed the homepage's title and
// description no matter which page it pointed at.
export const SITE_NAME = 'MITEZ';
export const DEFAULT_TITLE = 'MITEZ | Make It Easy';
export const OG_IMAGE = '/og-image.png';

export const PAGE_META = {
  '/': {
    title: null, // homepage uses DEFAULT_TITLE as-is
    description:
      'MITEZ is free mentorship and hands-on support for anything you want to learn, tutoring, life skills, career skills, and more. Based in Gainesville, Florida, open to anyone who asks.',
  },
  '/about': {
    title: 'About',
    description:
      'MITEZ started in Gainesville, Florida with one promise: make it easier to find someone who will help you learn anything, for free. Here’s what we hold to and where things stand today.',
  },
  '/how-it-works': {
    title: 'How It Works',
    description:
      'Tell us what you want to learn, get matched with someone who knows it, and work through it together, free, with no fixed subject list.',
    // Real questions with real answers, already on the page as a
    // definition list. Marking them up is the one piece of structured
    // data here that can actually change how the site appears in
    // search rather than only how it is understood: FAQ markup is
    // eligible to be shown expanded under the result.
    //
    // The wording is copied from the page verbatim on purpose. Schema
    // that does not match the visible text is a guidelines violation,
    // and the fix for drift is that these two live in the same repo and
    // get changed together.
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        ['What can I ask about?', 'Anything you want to learn. There is no fixed list of subjects.'],
        ['Who is this for?', 'Students, adults, parents, educators, and organizations. There is no age limit.'],
        ['What does it cost?', 'Nothing.'],
        ['Do I have to be in Gainesville?', 'No. The program runs fully remote, so where you live does not decide whether you can take part. Gainesville is where we started, not a requirement.'],
        ['How long does it take to hear back?', 'Usually a few days.'],
      ].map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  },
  '/get-involved': {
    title: 'Get Involved',
    description:
      'Learn something, teach something, partner as a school or organization, or support the work, every way to get involved with MITEZ is free.',
  },
  '/gainesville': {
    title: 'Gainesville',
    description:
      'Free mentorship and hands-on help started in Gainesville, Florida, run fully remote so distance does not decide who gets help. Here is exactly where the pilot stands.',
  },
  '/terms': {
    title: 'Terms and Conditions',
    description:
      'The conditions of taking part in MITEZ, including guardian consent for students under 18 and the rules that govern every mentoring session.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description:
      'What MITEZ collects, why, who sees it, how long it is kept, and how to have it removed. No tracking, no analytics, nothing sold.',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Questions, ideas, or something you want to learn, get in touch with MITEZ. We read everything and usually reply within a few days.',
  },
};

export function fullTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
}
