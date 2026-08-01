import LegalDoc from '../components/LegalDoc.jsx';
import { CONTACT_EMAIL } from '../config/forms.js';

/**
 * Terms and Conditions.
 *
 * This replaces the separate safety page. The safeguarding rules now sit here
 * as conditions of participation, which is where they belong: as a page they
 * were a promise, as terms they are a condition someone agrees to and can be
 * removed for breaking.
 *
 * Two disclosures in here are deliberate and should not be quietly dropped
 * later:
 *   - Clause 1 states MITEZ is not incorporated. Anyone dealing with an
 *     unincorporated group is entitled to know that before they engage.
 *   - Clause 6 states there are no formal background checks. Claiming
 *     otherwise on a document a parent relies on would be far worse than
 *     saying it plainly.
 *
 * Written to be reviewed by a lawyer before MITEZ scales, particularly the
 * liability and governing-law clauses, which an unincorporated association
 * cannot lean on as heavily as a company can.
 */

const UPDATED = '1 August 2026';

const SECTIONS = [
  {
    h: 'About MITEZ and these Terms',
    body: [
      'MITEZ ("MITEZ", "we", "us") is a volunteer-run education initiative based in Gainesville, Florida, providing free mentorship and learning support remotely.',
      'MITEZ is not currently incorporated as a company or as a non-profit entity, and holds no tax-exempt status. It operates as an informal association of volunteers. We state this plainly so that any student, parent, guardian, school or organisation dealing with us understands the nature of the entity they are engaging with.',
      'These Terms govern your use of mitez.org and your participation in any MITEZ programme. By requesting help, volunteering as a mentor, or otherwise taking part, you agree to them. If you do not agree, please do not use the service.',
    ],
  },
  {
    h: 'Definitions',
    body: [
      [
        '"Student" means any person who requests or receives mentorship or learning support from MITEZ.',
        '"Mentor" means any volunteer who provides that support.',
        '"Guardian" means a parent or legal guardian of a Student who is under 18.',
        '"Session" means any scheduled meeting between a Mentor and a Student.',
        '"Resources" means the third-party links listed on the Resources page.',
      ],
    ],
  },
  {
    h: 'What MITEZ provides',
    body: [
      'MITEZ matches Students with Mentors who volunteer their time, and provides a list of free third-party learning Resources. All of it is provided free of charge. We do not charge Students, Guardians, Mentors or organisations, and we do not accept payment in exchange for a match.',
      'MITEZ is not a school, a tutoring company, a licensed educational institution, or a childcare provider. Nothing we provide is accredited, and participation does not confer any qualification or credit.',
      'We do not guarantee that a Mentor will be available for any particular subject, within any particular timeframe, or at all. Matching depends entirely on volunteer availability.',
    ],
  },
  {
    h: 'Eligibility and Guardian consent',
    body: [
      'Resources are open to anyone. They involve no contact with MITEZ or with any Mentor, require no account, and are not conditional on consent.',
      'Mentorship is different. Where a Student is under 18, MITEZ will contact a Guardian and obtain their agreement before any match is made and before any Session takes place. Consent must come from an adult we are able to reach and communicate with directly. A checkbox on a form is not sufficient and will not be treated as consent.',
      'If we are unable to reach a Guardian, or a Guardian declines, MITEZ will not proceed with a match. The Student remains free to use the Resources.',
      'A Guardian may withdraw consent at any time, for any reason, without notice, and Sessions will stop immediately.',
    ],
  },
  {
    h: 'Conditions of participation for Students and Guardians',
    body: [
      [
        'Information provided to MITEZ must be accurate, including the age of the Student and the identity and contact details of a Guardian.',
        'A Guardian is entitled to attend or observe any Session, with or without prior notice.',
        'Students and Guardians must not ask a Mentor for personal contact details or to communicate outside arranged channels.',
        'Sessions must not be recorded by any party without the express agreement of everyone present.',
      ],
    ],
  },
  {
    h: 'Conditions of participation for Mentors',
    body: [
      'Mentors currently join MITEZ by personal referral. Every Mentor is a person known to a member of the MITEZ team who is willing to vouch for them, and each speaks with a member of the team before being matched.',
      'MITEZ does not at present carry out formal criminal background checks or third-party screening on Mentors. We state this expressly rather than allowing an assumption to the contrary. MITEZ will introduce formal screening before the programme grows beyond the point at which personal referral remains a meaningful safeguard, and these Terms will be updated accordingly.',
      'By volunteering, a Mentor confirms that they are not barred or prohibited by law from working with minors in any jurisdiction, and that they are not subject to any court order or restriction that would prevent them from doing so.',
      'Mentors act as volunteers. They are not employees, agents, contractors or partners of MITEZ, and no employment or agency relationship arises from volunteering.',
    ],
  },
  {
    h: 'Session rules',
    body: [
      'The following apply to every Session involving a Student under 18 and are conditions of participation, not guidance. They apply to every Mentor without exception.',
      [
        'A Guardian must have consented before the first Session takes place.',
        'A Guardian may be present at any Session. No Mentor may request or suggest that a Guardian not attend.',
        'Sessions take place using meeting arrangements made by MITEZ. Sessions must not be moved to a Mentor’s personal account, a private server, a game chat, or any channel not visible to MITEZ.',
        'Mentors must not exchange personal telephone numbers, social media accounts, or direct messages with a Student. Communication between Sessions goes through MITEZ.',
        'The programme is fully remote. Mentors must not arrange or propose to meet a Student in person.',
        'Sessions must remain focused on the subject or skill being learned. Mentors must not offer personal, medical, legal or financial advice, must not solicit anything of value, and must not discuss matters unsuitable for a minor.',
      ],
    ],
  },
  {
    h: 'Prohibited conduct',
    body: [
      'The following are prohibited for all participants:',
      [
        'Harassment, bullying, discrimination, threats, or abusive conduct of any kind.',
        'Any sexual conduct, sexual language, or contact of a sexual nature directed at or involving a Student.',
        'Requesting or attempting to obtain money, gifts, goods or services from a Student or Guardian.',
        'Sharing another participant’s personal information without their agreement.',
        'Attempting to arrange contact with a Student outside the arrangements described in clause 6.',
        'Misrepresenting your identity, age, qualifications or affiliation.',
      ],
    ],
  },
  {
    h: 'Suspension and removal',
    body: [
      'MITEZ may suspend or remove any participant at any time, without notice and without being required to give a reason, where we consider it necessary or appropriate.',
      'A Mentor found to have breached clause 6 or clause 7 will be removed from the programme. Where conduct appears to involve a risk to a child, MITEZ will report the matter to the appropriate authorities.',
    ],
  },
  {
    h: 'Third-party Resources',
    body: [
      'The Resources page links to services operated by third parties. MITEZ has no affiliation, partnership, sponsorship or other relationship with any of them, receives nothing in connection with listing them, and exercises no control over their content, availability or practices.',
      'Those services are governed by their own terms and privacy policies, which you should read. MITEZ accepts no responsibility for them.',
    ],
  },
  {
    h: 'No warranty and no professional advice',
    body: [
      'The service is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, MITEZ makes no warranties of any kind, express or implied, including as to accuracy, quality, fitness for a particular purpose, or uninterrupted availability.',
      'Nothing provided by MITEZ or by a Mentor constitutes professional advice of any kind, including medical, psychological, legal, financial or career advice. Mentors are volunteers sharing knowledge, not licensed professionals acting in a professional capacity.',
      'MITEZ does not supervise the content of individual Sessions in real time and does not warrant the accuracy of anything a Mentor says.',
    ],
  },
  {
    h: 'Limitation of liability',
    body: [
      'To the fullest extent permitted by applicable law, MITEZ and its volunteers shall not be liable for any indirect, incidental, special or consequential loss arising out of participation in the programme or use of this site.',
      'Nothing in these Terms excludes or limits liability where it would be unlawful to do so, including liability for death or personal injury caused by negligence, or for fraud.',
    ],
  },
  {
    h: 'Reporting a concern',
    body: [
      `Any concern about the conduct of a Mentor, a Student, or anyone else connected with MITEZ should be reported to ${CONTACT_EMAIL}. You do not need to be certain, and you do not need evidence. Reports are taken seriously, the reporter is told what action was taken, and a Mentor can be removed the same day.`,
      'Where a child is at immediate risk of harm, contact your local emergency services first. MITEZ is a small volunteer group and is not a substitute for emergency or child protection services.',
    ],
  },
  {
    h: 'Changes to these Terms',
    body: [
      'MITEZ may update these Terms as the programme develops, particularly as arrangements for screening and governance change. The date at the top of this page shows when it was last revised. Continued participation after a change constitutes acceptance of the revised Terms.',
    ],
  },
  {
    h: 'Governing law',
    body: [
      'These Terms are governed by the laws of the State of Florida, United States, without regard to its conflict of law provisions.',
    ],
  },
  {
    h: 'Contact',
    body: [
      `Questions about these Terms may be sent to ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function Terms() {
  return (
    <LegalDoc
      path="/terms"
      eyebrow="Terms"
      title="Terms and Conditions"
      lede="The conditions of taking part in MITEZ, including the rules that govern every session with a student under 18."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
