# Shubham Tambe — Portfolio

Personal site: work, published research, and live activity.
Built with React + Vite. Dark theme, no UI framework.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  data/         all content lives here — edit these, not the components
    profile.js      name, roles, links, headline stats
    projects.js     19 projects + category metadata
    research.js     5 published papers
    experience.js   roles, newest first
    education.js    degrees + grouped coursework
    skills.js       toolkit groups
    config.js       feedback delivery
  components/   Nav, ScrollRail, Backdrop, Rail (shared animation),
                Activity + Heatmap, Journey, Focus, Feedback, FluidOrb
  pages/Home.jsx
  styles.css    one stylesheet, CSS custom properties for the palette
```

Adding a project or paper is a single object in the relevant `data/` file —
the counts in the "At a glance" row are derived from those arrays, so they
cannot drift from the sections below.

## Live data

Three sources feed the Activity section, each failing independently — if one is
down the others still render and the dead tab links to the profile instead of
showing an empty grid.

| Source | Where it comes from |
| --- | --- |
| GitHub | `github-contributions-api.jogruber.de` — GitHub publishes no official API for the contribution graph |
| LeetCode | `alfa-leetcode-api.onrender.com` — free tier, occasionally rate-limits |
| Monkeytype | `src/assets/monkeytype-activity.json`, refreshed every 2h by `.github/workflows/update-monkeytype.yml` |

The Monkeytype workflow needs a `MONKEYTYPE_APE_KEY` repository secret.

## Feedback widget

With no backend, the widget opens the visitor's mail client pre-filled and says
so — it never claims a message was sent when it was not. To switch to a real
POST, put a form endpoint that accepts JSON (Formspree, Web3Forms, Formspark)
into `FEEDBACK_ENDPOINT` in `src/data/config.js`. Nothing else changes.

## Deploy

Static build, no server needed. On Vercel the framework is auto-detected;
`vercel.json` sets asset caching and a few security headers. Routing is
hash-based, so no rewrite rules are required.

## Notes

- `_archive/` holds the previous single-file build and unused assets. It is
  gitignored and nothing imports from it.
- Motion respects `prefers-reduced-motion` throughout.
