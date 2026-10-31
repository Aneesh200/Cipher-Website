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
sends one mail through nodemailer over Gmail: a notification to the team, with
the enquirer as reply-to. There is deliberately no acknowledgement to the
submitted address, since that let anyone make our mailbox send branded mail to
any inbox.

### Bot protection

Same level as authify.tech (AUT-1303), added in AUT-1510. The route applies, in
order:

1. `415` on a non-JSON body, and in production `403` on a missing or foreign
   `Origin`. Allowed origins are the project's custom domains, listed in
   `PRODUCTION_HOSTS`.
2. A per-IP rate limit of 5 requests per 10 minutes, held in memory per instance.
3. An off-screen honeypot field. A filled one gets a fake success and nothing
   is sent.
4. A strict single-address email check, control-character stripping, length
   caps and full HTML escaping.
5. Cloudflare Turnstile, verified server-side whenever `TURNSTILE_SECRET_KEY`
   is set. Action and hostname are checked in production only, because
   Cloudflare's test keys report neither.

Subjects are built server-side, and the authify.tech flood shape is tagged
`[SPAM?]` without being dropped. Every request logs one JSON line with
`evt: "enquiry_api"`, and the same IP, Vercel geo, JA4 and user-agent block is
appended to the notification so the inbox keeps the evidence after Vercel's
runtime logs expire.

On the Vercel project, the firewall mirrors authify.tech's: Vercel's managed bot
protection and the OWASP `gen`, `rce`, `sqli` and `xss` rule sets in log mode,
plus a log-only custom rule on `POST /api/enquiry`. Vercel Web Analytics is
mounted in the root layout.

### Environment variables

Set in Vercel for production, `.env.local` locally, never committed:

| Variable                         | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| `EMAIL_USER`                     | Gmail account the mail is sent from                      |
| `EMAIL_PASS`                     | Gmail **app password**, not the account password         |
| `CONTACT_RECIPIENT`              | Inbox that receives enquiries (defaults to `EMAIL_USER`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key, inlined at **build** time            |
| `TURNSTILE_SECRET_KEY`           | Turnstile secret, read by the API route at runtime       |

Without the mail variables the endpoint returns 503 with a message pointing
people at `contact@authify.tech` rather than failing silently.

Set **both** Turnstile keys or **neither**. The server enforces Turnstile
whenever the secret is present, and the site key is baked into the build, so a
secret without a site key refuses every lead. Changing either one needs a
redeploy. The production widget lives in the Cloudflare dashboard under
Turnstile, in Managed mode, with hostnames `ciphersecurity.ai` and
`cipher.authify.tech`. Preview and Development use Cloudflare's always-pass
test keys:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

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
