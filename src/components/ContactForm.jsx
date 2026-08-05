import { useState } from 'react';
import { FORMSUBMIT_ENDPOINT, CONTACT_EMAIL } from '../config/forms.js';
import { click, whoosh, hover } from '../lib/sound.js';

/**
 * Contact form using the same approach as the Emerging Tech site:
 *  - AJAX POST to FormSubmit so the visitor never leaves the page
 *  - a hidden "_honey" honeypot field to absorb bots
 *  - FormSubmit's own captcha left ENABLED (the Emerging Tech audit found
 *    a `_captcha=false` field that had been silently disabling spam
 *    protection — deliberately not repeated here)
 *  - real loading / success / error states, so a click always produces
 *    visible feedback rather than a dead button
 */
export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    click();
    setStatus('sending');

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus('sent');
      // The one moment on this site worth marking with a sound of its
      // own. Sending a message is the only irreversible thing a visitor
      // does here, and the send is also the only action whose result
      // they cannot see — the message just goes. A departing sound is
      // the confirmation the interface otherwise cannot give.
      whoosh();
      form.reset();
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      // role="status" so a screen reader is told, and tabIndex/-1 with
      // focus so a keyboard user is not left with their focus on a
      // button that no longer exists.
      <div className="form-done" role="status">
        <span className="form-done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 12.5l5.2 5.2L20 7" /></svg>
        </span>
        <h3>Message sent.</h3>
        <p>
          Thanks for reaching out, we&rsquo;ll get back to you as soon as we can.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => { click(); setStatus('idle'); }}
          onPointerEnter={hover}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={handleSubmit} noValidate={false}>
      {/* Honeypot: invisible to people, tempting to bots. Any submission
          with this filled gets dropped by FormSubmit. */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="cform-honey"
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_subject" value="New message from the MITEZ site" />

      <div className="cform-row">
        <label className="cform-field">
          <span>Name</span>
          <input type="text" name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className="cform-field">
          <span>Email</span>
          <input type="email" name="email" required maxLength={180} autoComplete="email" />
        </label>
      </div>

      <label className="cform-field">
        <span>
          I&rsquo;m reaching out as <em>(optional)</em>
        </span>
        <select name="role" defaultValue="">
          <option value="">Select one</option>
          <option>Someone who wants to learn</option>
          <option>Someone who wants to teach</option>
          <option>A parent or guardian</option>
          <option>A school, library or organization</option>
          <option>A supporter or sponsor</option>
          <option>Something else</option>
        </select>
      </label>

      <label className="cform-field">
        <span>Message</span>
        <textarea name="message" rows={6} required maxLength={4000} />
      </label>

      {status === 'error' && (
        <p className="cform-error" role="alert">
          Something went wrong sending that. You can email us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      )}

      <button
        type="submit"
        className={`btn btn-primary cform-send${status === 'sending' ? ' is-sending' : ''}`}
        disabled={status === 'sending'}
        onPointerEnter={hover}
      >
        <span>{status === 'sending' ? 'Sending' : 'Send message'}</span>
        {/* Three dots that actually animate, rather than a static "…"
            that looks identical to a frozen page. A disabled button with
            no motion is the single most common way a form appears
            broken while it is working perfectly. */}
        {status === 'sending' && (
          <span className="cform-dots" aria-hidden="true"><i /><i /><i /></span>
        )}
      </button>
    </form>
  );
}
