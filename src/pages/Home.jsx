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

  return (
    <main>
      <SEO
        description="MITEZ is free mentorship and hands-on support for anything you want to learn — tutoring, life skills, career skills, and more. Based in Gainesville, Florida, open to anyone who asks."
        path="/"
      />
      <Preloader ready={ready} />
      <Hero onReady={handleReady} />

      <section className="section">
        <div className="wrap">
          <TextAnimate as="p" className="eyebrow" by="character" animation="fadeIn" duration={0.5}>
            MITEZ
          </TextAnimate>
          <TextAnimate as="h2" className="tagline" by="word" animation="blurInUp" duration={0.8} delay={0.15}>
            One place to learn anything, instead of ten.
          </TextAnimate>
          <TextAnimate as="p" className="lede" by="line" animation="fadeIn" duration={0.6} delay={0.6}>
            No waitlists, no paperwork, no cost. Whatever you want to learn, you
            should be able to start this week — not next semester.
          </TextAnimate>
        </div>
      </section>

      <Mission />
      <ProblemSolution />
      <WhoWeServe />
      <HowItWorks />
      <Pilot />
      <FounderNote />
      <GetInvolved />
      <FinalCta />
      <Footer />
    </main>
  );
}
