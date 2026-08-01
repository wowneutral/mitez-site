import LegalDoc from '../components/LegalDoc.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

/**
 * Privacy Policy.
 *
 * Describes what the site actually does today: Tally interest forms, a
 * FormSubmit contact form, and no analytics, cookies or tracking of any kind.
 *
 * The tracking clause asserts that no analytics run on this site. The moment
 * analytics are added that becomes false, and it must be updated in the same
 * commit that adds them.
 *
 * MITEZ collects information from people under 18, which in the United States
 * engages COPPA where a child is under 13. The children and guardian consent
 * clause reflects the practice MITEZ follows; it should be reviewed by someone
 * qualified before the programme scales.
 */

const UPDATED = '1 August 2026';

const SECTIONS = [
  {
    h: 'Who this policy covers',
    body: [
      'This policy explains how MITEZ ("MITEZ", "we", "us") handles personal information collected through mitez.org and in the course of running its mentorship programme.',
      'MITEZ is a volunteer-run education initiative based in Gainesville, Florida. It is not currently incorporated as a company or non-profit entity. The people responsible for the information described here are the volunteers who run MITEZ, contactable at the address in the Contact clause below.',
    ],
  },
  {
    h: 'Information we collect',
    body: [
      'We collect only what you type into one of our forms. Depending on the form, that may include:',
      [
        'Your name.',
        'Your email address.',
        'The name and email address of a parent or guardian, where the student is under 18.',
        'A description of what you want to learn, teach, or ask about.',
        'The name of your organisation, where you are contacting us on behalf of one.',
      ],
      'We do not ask for and do not want home addresses, dates of birth, school identification numbers, financial information, or any health or medical information. If a form appears to request something beyond what is listed above, leave it blank and tell us.',
    ],
  },
  {
    h: 'How we collect it',
    body: [
      'Our interest forms are hosted by Tally, and our contact form transmits messages using FormSubmit. Both are third-party services, and information you submit passes through their systems on the way to us. Each operates under its own privacy policy.',
      'We do not collect information about you passively. Visiting this site, reading any page, or following a link from the Resources page does not cause us to collect anything.',
    ],
  },
  {
    h: 'Why we hold it and what we use it for',
    body: [
      'We use the information solely to operate the programme: to reply to you, to understand what you are asking for, to contact a parent or guardian where required, to match a student with a suitable mentor, and to arrange sessions.',
      'We do not use it for marketing, do not add you to a mailing list, and do not profile or make automated decisions about you.',
    ],
  },
  {
    h: 'Children and guardian consent',
    body: [
      'Where a student is under 18 and requests mentorship, we contact a parent or guardian and obtain their agreement before making any match. Consent must come from an adult we can reach and communicate with directly.',
      'A parent or guardian may at any time ask what information we hold about their child, ask us to correct it, or ask us to delete it. We will comply and confirm when it is done.',
      'The Resources page requires no information from anyone and is open at any age.',
      'If we become aware that we hold information from a child under 13 that was provided without verifiable parental consent, we will delete it.',
    ],
  },
  {
    h: 'Who we share it with',
    body: [
      'We do not sell personal information, and we do not share it for anyone else’s marketing.',
      'Information is seen by the volunteers running MITEZ, and by the third-party form services described above that carry it to us. Where a match is made, a mentor is told what they need in order to help, which is ordinarily the student’s first name and what they want to learn.',
      'We may disclose information where required by law, or where necessary to protect someone from harm.',
    ],
  },
  {
    h: 'Tracking, cookies and analytics',
    body: [
      'This site runs no analytics, sets no tracking cookies, and carries no advertising. We do not know who visits, what pages are read, or where visitors come from.',
      'Third-party services linked from the Resources page, and the form services described above, may set their own cookies when you interact with them. That is governed by their policies rather than ours.',
    ],
  },
  {
    h: 'Content loaded from other services',
    body: [
      'Some parts of this site are fetched from third parties when a page loads: typefaces from Google Fonts, and the 3D scene on the homepage from Spline. Your browser requests those files directly, which means those companies receive your IP address and basic request information, as they would for any site using them.',
      'MITEZ receives nothing from those requests and does not use them to identify or track anyone. We mention it because "we collect nothing passively" is only true of us, not of every company whose file your browser fetches.',
    ],
  },
  {
    h: 'How long we keep it',
    body: [
      'We keep what you send for as long as we are working with you, and for a reasonable period afterwards in case you return to us. Where a request does not lead to a match, we delete it once it is clear nothing further is happening.',
      'You can ask us to delete it sooner at any time.',
    ],
  },
  {
    h: 'Your rights',
    body: [
      'You may ask us to tell you what we hold about you, provide a copy of it, correct anything inaccurate, or delete it. Where a student is under 18, a parent or guardian may exercise these rights on their behalf.',
      'You do not need to give a reason, and asking will not affect how we treat you. Write to the address in the Contact clause below and we will action it and confirm.',
    ],
  },
  {
    h: 'How we protect it',
    body: [
      'Information reaches us over encrypted connections and is held in accounts restricted to the volunteers who run MITEZ.',
      'We are a small volunteer group and do not operate formal information security certification. No method of transmission or storage is completely secure, and we do not claim otherwise.',
    ],
  },
  {
    h: 'Changes to this policy',
    body: [
      'We will update this policy as the programme develops, including if MITEZ becomes incorporated or begins using analytics. The date at the top of this page shows when it was last revised.',
    ],
  },
  {
    h: 'Contact',
    body: [
      `To ask about this policy, or to exercise any of the rights set out under Your rights, write to ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function Privacy() {
  return (
    <LegalDoc
      path="/privacy"
      eyebrow="Privacy"
      title="Privacy Policy"
      lede="What MITEZ collects, why, who sees it, how long it is kept, and how to have it removed."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
