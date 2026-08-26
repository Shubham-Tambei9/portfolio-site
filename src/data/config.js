/* Feedback delivery.
 *
 * This site is static — there is no server to POST to. So the widget has two
 * modes, and it tells the visitor which one it is using:
 *
 *   1. ENDPOINT set   -> the message is POSTed as JSON.
 *   2. ENDPOINT empty -> the visitor's mail client opens, pre-filled. Nothing is
 *      sent until they press send in their own client.
 *
 * Mode 2 is the default because it works with zero setup and cannot silently
 * swallow a message. To upgrade, sign up for a form backend that accepts a plain
 * JSON POST — Formspree, Web3Forms and Formspark all do — and paste the endpoint
 * URL below. No other change is needed.
 *
 *   FEEDBACK_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
 */
export const FEEDBACK_ENDPOINT = '';

export const FEEDBACK_EMAIL = 'tambeshubham2004@gmail.com';

export const FEEDBACK_COPY = {
  launch: 'Get in touch',
  title: 'Say hello',
  sub: 'Hiring, collaborating, or just spotted something broken on this site — it comes straight to my inbox.',
  cta: 'Send message',
  ratingLabel: 'How is this site?',
  messageLabel: 'Your message',
  placeholder: 'A role you are hiring for, a question about a project or paper, or feedback on the site…',
};

export const FEEDBACK_TOPICS = [
  { id: 'hiring', label: 'Role or opportunity' },
  { id: 'project', label: 'About a project' },
  { id: 'research', label: 'About a paper' },
  { id: 'site', label: 'Feedback on this site' },
  { id: 'other', label: 'Something else' },
];
