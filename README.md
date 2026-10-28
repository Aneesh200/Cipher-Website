# Cipher — marketing site

Next.js rebuild of the Cipher site from the Claude Design project
`12f9368c-8a99-4b6f-822d-3097dd60dab5`. Tracked in
[AUT-359](https://linear.app/authify-tech/issue/AUT-359).

## Routes

| Route           | Source design file            |
| --------------- | ----------------------------- |
| `/`             | `Cipher Website.dc.html`      |
| `/platform`     | `Cipher Platform.dc.html`     |
| `/integrations` | `Cipher Integrations.dc.html` |
| `/evidence`     | `Cipher Evidence.dc.html`     |
| `/trust`        | `Cipher Trust.dc.html`        |
| `/contact`      | `Cipher Contact.dc.html`      |

All six render as static pages.

## Interactive components

- `components/console/OrwellConsole.tsx` — the replaying engagement viewer on
  the home page. Play/pause/replay, kind filters, finding list and detail tab,
  live counters, and a nudge box that injects trace rows. Data in
  `data/console.ts`.
- `components/graph/KnowledgeGraph.tsx` — the target graph on `/platform`.
  Clicking a node focuses its neighbourhood, the legend filters by kind, and
  search narrows the view. Data in `data/graph.ts`.

## Styling

Plain CSS, no framework. `app/globals.css` holds the tokens and the shared
primitives (`.wrap`, `.sec`, `.split`, `.cols`, `.h1`–`.h3`, `.btn`, …); each
page has a CSS module for the parts unique to it; the two components have
stylesheets in `styles/`.

The source is a fixed-width desktop design, so the responsive pass is
deliberate rather than incidental:

- Type is fluid via `clamp()`, with the small-screen end raised well above a
  linear scale-down and headings going to weight 600 below 640px.
- `.cols` divider grids turn their vertical rules into horizontal ones as they
  collapse; four- and five-up grids pass through a two-column stage.
- The console stacks with the stream first and the rails below it.
- The knowledge graph keeps its size and pans horizontally below 680px, where
  squeezing it would collide and clip the node labels.

### Scroll reveal

`components/site/ScrollFx.tsx` adds `is-in` to `.reveal` elements as they come
into view. Content is **visible by default**: an inline script in the layout
stamps `fx-ready` on `<html>` before first paint, and only then does CSS hide
reveal elements. If scripting is blocked, fails, or the observer never
delivers, the class is absent or removed and everything renders plainly —
headings must never be stuck at `opacity: 0`.

## Assets

`public/assets/` holds the Authify marks. `public/logos/` holds the vendored
brand marks for the integrations page; nothing is fetched from a CDN at
runtime.

> The two screenshots in the original deck (`console-agentmind.png`,
> `knowledge-graph.png`) came back truncated from the design API's 256 KiB read
> cap and are not used by this site — it renders both as live components
> instead.

## Contact form

`components/contact/EnquiryForm.tsx` posts to `app/api/enquiry/route.ts`, which
sends two mails through nodemailer over Gmail — a notification to the team and
an acknowledgement to the enquirer. Same approach as the Authify site.

Required environment variables (set in Vercel for production, `.env.local`
locally — never committed):

| Variable            | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `EMAIL_USER`        | Gmail account the mail is sent from                   |
| `EMAIL_PASS`        | Gmail **app password**, not the account password      |
| `CONTACT_RECIPIENT` | Inbox that receives enquiries (defaults to `EMAIL_USER`) |

Without them the endpoint returns 503 with a message pointing people at
`contact@authify.tech` rather than failing silently.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Deployment

Vercel project `cipher-website` — <https://cipher.authify.tech>.
Deploy with `vercel --prod`.
