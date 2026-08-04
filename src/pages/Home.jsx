import { useCallback, useState } from 'react';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import Preloader from '../components/Preloader.jsx';
import { TextAnimate } from '../components/magicui/text-animate.jsx';
import Mission from '../components/sections/Mission.jsx';
import ProblemSolution from '../components/sections/ProblemSolution.jsx';
import WhoWeServe from '../components/sections/WhoWeServe.jsx';
import HowItWorks from '../components/sections/HowItWorks.jsx';
import Pilot from '../components/sections/Pilot.jsx';
import FounderNote from '../components/sections/FounderNote.jsx';
import GetInvolved from '../components/sections/GetInvolved.jsx';
import FinalCta from '../components/sections/FinalCta.jsx';
import Footer from '../components/Footer.jsx';
import ScrollBand from '../components/ScrollBand.jsx';
import Strings from '../components/Strings.jsx';
import RiseText from '../components/RiseText.jsx';

// Every section below Hero uses real copy carried over from the live
// static site (mission, problem/gap, response, who-we-serve, how-it-works,
// pilot figures, founder quote, get-involved, final CTA, footer) — nothing
// invented fresh. Animation varies deliberately per section (word/line/
// character split, fadeIn/slideUp/slideLeft/blurIn/scaleUp for text via
// TextAnimate; up/left/right/scale/clip via Reveal for cards, bars, and
// dividers) instead of the same blur-up treatment run everywhere, plus two
// motion-driven, scroll-tied animations that aren't just text: the
// how-it-works progress line draws itself as you scroll past the four
// steps, and the pilot readiness bar fills once it enters view.
export default function Home() {
  const [ready, setReady] = useState(false);
  // Stable identity so ReadySignal's effect doesn't re-fire on every render.
  const handleReady = useCallback(() => setReady(true), []);

  // Crossing the intro threshold replays the hero's entrance.
  //
  // Without this the hero animates on mount, behind the panels, and has
  // long finished by the time anyone presses Enter — so the curtain
  // lifts on a hero sitting perfectly still, which is the exact opposite
  // of the handoff the intro is for.
  //
  // It is a remount rather than a delayed render on purpose: the copy is
  // in the DOM the whole time either way, so a crawler that never clicks
  // Enter still sees the h1 and the lede.
  const [entered, setEntered] = useState(false);
  const handleEnter = useCallback(() => setEntered(true), []);

  return (
    <main id="main">
      <SEO
        description="MITEZ is free mentorship and hands-on support for anything you want to learn, tutoring, life skills, career skills, and more. Based in Gainesville, Florida, open to anyone who asks."
        path="/"
      />
      <Preloader ready={ready} onEnter={handleEnter} />
      <Hero onReady={handleReady} started={entered} />

      <section className="section">
        <div className="wrap">
          <TextAnimate as="p" className="eyebrow" by="character" animation="fadeIn" duration={0.5}>
            MITEZ
          </TextAnimate>
          {/* The promise, stated once. This used to read "One place to
              learn anything, instead of ten" — the same sentence as the
              Response section's heading further down the page. That line
              now lives only there. */}
          {/* Blur is now reserved for the hero headline alone — it was on
              four separate headings, which turned a signature effect into
              the site's default. */}
          <RiseText as="h2" className="tagline" delay={0.15}>Free. Any skill. Anyone who asks.</RiseText>
          <TextAnimate as="p" className="lede" by="line" animation="fadeIn" duration={0.6} delay={0.6}>
            No waitlist, no paperwork, no cost, and no list of approved
            subjects to pick from.
          </TextAnimate>
        </div>
      </section>

      {/* Order is deliberate, and each section has ONE rhetorical job so
          none of them re-argue what another already said:
            Mission    — what MITEZ is, plainly (definition)
            The Gap    — pathos: what it feels like to give up on something
            The Response — logos: the three things we actually do
            Get Involved — the action, moved up from the bottom. It used
              to sit after four consecutive explainer sections, so a
              visitor had to read the whole argument before finding
              anything they could act on.
            Who We Serve / The Process — logos, for anyone still reading
            Pilot / Founder — ethos: real place, real person
            Final CTA  — pathos close */}
      <Mission />
      <ProblemSolution />

      {/* Two bands, placed at the joins between sections rather than
          inside them. Each one travels sideways while the page travels
          down, which is the second axis the site never had — and the
          reason scrolling now feels like moving through something
          rather than past it. Both reuse words already on the site;
          neither introduces a new claim. */}
      <ScrollBand text="Free. Any skill. Anyone who asks." speed={26} />

      <GetInvolved />
      <WhoWeServe />
      <HowItWorks />

      <ScrollBand text="Make it easy" speed={34} />

      <Pilot />

      {/* The third band carries facts rather than a phrase, and travels
          the other way. Same device, different job: this one is the
          site's plainest information — where, what, how much — moving
          past at reading size without being a paragraph anyone has to
          get through. */}
      <ScrollBand
        text="Gainesville, Florida — Fully remote — No fixed subject list — Free, always"
        speed={22}
        reverse
      />
      <FounderNote />
      <FinalCta />

      {/* The toy. Fourteen strings, pentatonic, through the same synth
          and reverb as everything else — so it belongs to this site
          rather than being an effect bolted onto the bottom of it. */}
      <Strings />

      <Footer />
    </main>
  );
}
