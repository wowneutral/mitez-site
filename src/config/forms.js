// Single place to configure every form on the site.
//
// TALLY: paste the short code from each form's share link. For
// https://tally.so/r/wAbC12 the id is "wAbC12". Until a real id is set,
// the page shows a clearly-labelled placeholder instead of a blank box.
// IDs verified by loading each form and reading its title — note xXBrod
// and xXBrgd differ by a single character but are genuinely two different
// forms (Donor and Mentor), so take care if editing these by hand.
export const TALLY = {
  learn: 'zxvjdg', // MITEZ Student / Parent Interest Form
  mentor: 'xXBrgd', // MITEZ Mentor / Tutor Interest Form
  partner: '7R5qja', // MITEZ Partner Interest Form
  donate: 'xXBrod', // MITEZ Donor / Sponsor Interest Form
  contact: 'aQo9yZ', // MITEZ General Contact Form (not currently embedded)
};

// FORMSUBMIT: the contact form posts here, same approach as the Emerging
// Tech site.
//
// IMPORTANT — two things to do on the first real submission:
//  1. FormSubmit sends a one-time confirmation email to hello@mitez.org.
//     Messages do not arrive until that link is clicked.
//  2. That email also contains a hashed endpoint. Swapping it in below
//     stops the address being readable in the page source, which is what
//     scrapers harvest.
export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/hello@mitez.org';

export const CONTACT_EMAIL = 'hello@mitez.org';

// Used by the sitemap and canonical/OG URLs.
export const SITE_URL = 'https://mitez.org';
