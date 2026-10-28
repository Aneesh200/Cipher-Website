export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";

export const SEV: Record<Severity, { chipBg: string; chipText: string; edge: string }> = {
  CRITICAL: { chipBg: "#F6E2E6", chipText: "#8C1027", edge: "#8C1027" },
  HIGH: { chipBg: "#F7EADF", chipText: "#8A4B12", edge: "#C08040" },
  MEDIUM: { chipBg: "#F5F0DC", chipText: "#6E5A12", edge: "#C0AC50" },
  INFO: { chipBg: "#E4EAF2", chipText: "#2A4A6E", edge: "#7C9AC0" },
};

export type Finding = {
  id: string;
  sev: Severity;
  title: string;
  analysis: string;
  request: string;
  response: string;
  cwe: string;
  owasp: string;
  surface: string;
  fixTitle: string;
  fix: string;
  confidence: string;
  status: string;
};

export const FINDINGS: Finding[] = [
  {
    id: "f1",
    sev: "CRITICAL",
    title: "Legacy /api/v2/ exposes all customer account data",
    analysis:
      "An anonymous GET to /api/v2/accounts returns HTTP 200 with every account object in the system, disclosing balances, IBAN, SWIFT and ownership. No session cookie or bearer token is required. This is a broken object level authorization flaw on a deprecated but live API version that bypasses the authentication enforced on v1.",
    request: "curl -sk https://target/api/v2/accounts",
    response: 'HTTP 200 · [{"id":1,"user_id":1,"balance":1000000 ...}]',
    cwe: "CWE-306",
    owasp: "API1:2023 Broken Object Level Authorization",
    surface: "web-apptest",
    fixTitle: "Recommended fix · medium effort",
    fix: "Decommission the legacy /api/v2/ surface, or place it behind the same authentication and object level authorization as v1. Enforce authz in central middleware applied to every version.",
    confidence: "95%",
    status: "confirmed",
  },
  {
    id: "f2",
    sev: "CRITICAL",
    title: "Publicly accessible full database backup",
    analysis:
      "A complete database dump is readable without credentials from an unauthenticated path. The archive contains user records, password hashes and internal service tokens, which is sufficient to authenticate as any user and reach internal services directly.",
    request: "curl -sI https://target/backups/db-latest.sql.gz",
    response: "HTTP 200 · content-length: 41288103",
    cwe: "CWE-200",
    owasp: "A01:2021 Broken Access Control",
    surface: "recon",
    fixTitle: "Recommended fix · low effort",
    fix: "Remove the archive from the web root immediately, rotate every credential it contains, and move backups to storage that is not internet reachable.",
    confidence: "99%",
    status: "confirmed",
  },
  {
    id: "f3",
    sev: "CRITICAL",
    title: "SQL injection in authentication bypasses login",
    analysis:
      "The login handler concatenates the submitted identifier into its query. A crafted identifier authenticates as the first matching account without a valid password, and the same parameter is usable to read arbitrary tables.",
    request: `POST /login  {"email":"' OR 1=1 --"}`,
    response: "HTTP 302 · set-cookie: session=…  (authenticated)",
    cwe: "CWE-89",
    owasp: "A03:2021 Injection",
    surface: "web-apptest",
    fixTitle: "Recommended fix · low effort",
    fix: "Use parameterised queries for every identifier and secret comparison, and add a regression test that asserts the injected payload fails to authenticate.",
    confidence: "97%",
    status: "confirmed",
  },
  {
    id: "f4",
    sev: "CRITICAL",
    title: "Unauthenticated /debug endpoint leaks environment",
    analysis:
      "A debug route left enabled in production returns the full process environment, including live third party API keys and the signing secret used for session tokens.",
    request: "curl -sk https://target/debug/env",
    response: 'HTTP 200 · {"JWT_SECRET":"…","STRIPE_KEY":"…"}',
    cwe: "CWE-215",
    owasp: "A05:2021 Security Misconfiguration",
    surface: "recon",
    fixTitle: "Recommended fix · low effort",
    fix: "Disable debug routes in production builds, rotate every exposed secret, and add a deployment check that fails when debug handlers are registered.",
    confidence: "99%",
    status: "confirmed",
  },
  {
    id: "f5",
    sev: "CRITICAL",
    title: "API JWT forgeable via weak signing secret",
    analysis:
      "Session tokens are signed with a short, guessable secret. Recovering it allows an arbitrary token to be minted with elevated role claims, granting administrative access without any interaction with the login flow.",
    request: "jwt-crack eyJhbGciOiJIUzI1NiIs…",
    response: "secret recovered · admin token minted",
    cwe: "CWE-326",
    owasp: "A02:2021 Cryptographic Failures",
    surface: "web-apptest",
    fixTitle: "Recommended fix · medium effort",
    fix: "Replace the secret with a high entropy key held in the vault, shorten token lifetime, and reject tokens whose role claims were not issued by the auth service.",
    confidence: "93%",
    status: "confirmed",
  },
  {
    id: "f6",
    sev: "CRITICAL",
    title: "Remote code execution via unsafe deserialisation",
    analysis:
      "A user supplied object is deserialised without type restrictions, which allows a crafted payload to execute commands in the application context and reach internal network ranges from inside the perimeter.",
    request: "POST /import  (crafted serialised object)",
    response: "command output returned in response body",
    cwe: "CWE-502",
    owasp: "A08:2021 Software and Data Integrity Failures",
    surface: "web-apptest",
    fixTitle: "Recommended fix · high effort",
    fix: "Stop deserialising untrusted input. Accept a plain data format with a strict schema, and run the importer with no outbound network access.",
    confidence: "91%",
    status: "confirmed",
  },
  {
    id: "f7",
    sev: "CRITICAL",
    title: "OS command injection in export parameter",
    analysis:
      "A filename parameter reaches a shell invocation unescaped, so appended shell metacharacters run with the privileges of the application process.",
    request: "GET /export?name=a;id",
    response: "uid=1000(app) gid=1000(app)",
    cwe: "CWE-78",
    owasp: "A03:2021 Injection",
    surface: "web-apptest",
    fixTitle: "Recommended fix · low effort",
    fix: "Invoke the export binary with an argument array rather than a shell string, and allowlist the characters permitted in a filename.",
    confidence: "96%",
    status: "confirmed",
  },
  {
    id: "f8",
    sev: "HIGH",
    title: "IDOR lets any user read another tenant records",
    analysis:
      "Object identifiers are sequential and unauthorised. Any authenticated session can enumerate identifiers and read documents belonging to other tenants.",
    request: "GET /api/v1/documents/1042",
    response: "HTTP 200 · document owned by another tenant",
    cwe: "CWE-639",
    owasp: "A01:2021 Broken Access Control",
    surface: "web-apptest",
    fixTitle: "Recommended fix · medium effort",
    fix: "Authorise every object access against the requesting tenant, and replace sequential identifiers with unguessable ones.",
    confidence: "94%",
    status: "confirmed",
  },
  {
    id: "f9",
    sev: "HIGH",
    title: "Predictable password reset token",
    analysis:
      "Reset tokens are derived from a timestamp, so a token for any account can be reproduced within a narrow window and used to take the account over.",
    request: "GET /reset?token=1721043600-4821",
    response: "HTTP 200 · reset form accepted",
    cwe: "CWE-340",
    owasp: "A07:2021 Identification and Authentication Failures",
    surface: "web-apptest",
    fixTitle: "Recommended fix · low effort",
    fix: "Generate reset tokens from a cryptographic random source, store only their hash, and expire them on first use.",
    confidence: "90%",
    status: "confirmed",
  },
  {
    id: "f10",
    sev: "MEDIUM",
    title: "Unrestricted file upload accepts executables",
    analysis:
      "The upload handler validates only the client supplied content type, so an executable payload can be stored in a path served back by the application.",
    request: "POST /upload  (content-type spoofed)",
    response: "HTTP 201 · stored under /uploads/",
    cwe: "CWE-434",
    owasp: "A04:2021 Insecure Design",
    surface: "web-apptest",
    fixTitle: "Recommended fix · medium effort",
    fix: "Validate real file content, store uploads outside the web root, and serve them from a domain that cannot execute code.",
    confidence: "88%",
    status: "confirmed",
  },
  {
    id: "f11",
    sev: "MEDIUM",
    title: "Open redirect via login next parameter",
    analysis:
      "The post login redirect target is not validated, which allows a crafted link to send an authenticated user to an attacker controlled host.",
    request: "GET /login?next=https://evil.example",
    response: "HTTP 302 · location: https://evil.example",
    cwe: "CWE-601",
    owasp: "A01:2021 Broken Access Control",
    surface: "web-apptest",
    fixTitle: "Recommended fix · low effort",
    fix: "Accept only relative paths for the redirect target, or match against an allowlist of known hosts.",
    confidence: "92%",
    status: "confirmed",
  },
  {
    id: "f12",
    sev: "MEDIUM",
    title: "Missing HTTP security headers",
    analysis:
      "Responses omit transport security, framing and content type protections, which widens the impact of any injection or clickjacking issue elsewhere in the application.",
    request: "curl -sI https://target/",
    response: "no HSTS · no CSP · no X-Content-Type-Options",
    cwe: "CWE-693",
    owasp: "A05:2021 Security Misconfiguration",
    surface: "recon",
    fixTitle: "Recommended fix · low effort",
    fix: "Set HSTS, a content security policy, frame ancestors and nosniff at the edge for every response.",
    confidence: "99%",
    status: "confirmed",
  },
  {
    id: "f13",
    sev: "INFO",
    title: "External attack surface inventory",
    analysis:
      "Sixteen reachable endpoints were enumerated across the authorised host, including one GraphQL schema and five forms. This inventory is retained in the target graph and reused by the next engagement.",
    request: "orwell recon --scope target",
    response: "16 endpoints · 1 graphql · 5 forms",
    cwe: "n/a",
    owasp: "n/a",
    surface: "recon",
    fixTitle: "No action required",
    fix: "Informational. Review the inventory for services that should not be internet reachable at all.",
    confidence: "100%",
    status: "informational",
  },
];

export type TraceKind = "THINKING" | "REASONING" | "TOOL" | "FINDING" | "GUARD";

export const KINDS: Record<TraceKind, { label: string; color: string; dot: string }> = {
  THINKING: { label: "THINKING", color: "#8A93A0", dot: "#8A93A0" },
  REASONING: { label: "REASONING", color: "#2A4A6E", dot: "#2A4A6E" },
  TOOL: { label: "ACTION", color: "#5A6473", dot: "#5A6473" },
  FINDING: { label: "FINDING", color: "#8C1027", dot: "#8C1027" },
  GUARD: { label: "GUARD", color: "#8A4B12", dot: "#C08040" },
};

export type TraceRow = {
  k: TraceKind;
  t: string;
  x: string;
  badge?: string;
  meta?: string;
};

export const TRACE: TraceRow[] = [
  { k: "REASONING", t: "12:19:47", x: "Reading what I am allowed to touch, so nothing happens outside the agreed boundary." },
  { k: "THINKING", t: "12:19:48", x: "thinking, encrypted" },
  { k: "TOOL", t: "12:19:56", x: "Confirming the boundary", badge: "ALLOW", meta: "0.0s" },
  { k: "REASONING", t: "12:19:58", x: "One target, no credentials given, nothing else in range. Careful pace, no destructive checks." },
  { k: "TOOL", t: "12:20:04", x: "Reaching beyond the target", badge: "BLOCK", meta: "OUT OF BOUNDS" },
  { k: "GUARD", t: "12:20:04", x: "Refused and written down. The agent is told no and carries on inside the boundary." },
  { k: "TOOL", t: "12:20:11", x: "Mapping what is publicly reachable", badge: "ALLOW", meta: "0.4s" },
  { k: "FINDING", t: "12:20:39", x: "Basic protections missing on every response. Logged as medium and attached to the target." },
  { k: "REASONING", t: "12:21:02", x: "The current interface checks who you are. An older one is still live, and older usually means the newer protections were never carried across." },
  { k: "TOOL", t: "12:21:14", x: "Asking the older interface for customer records, as a stranger", badge: "ALLOW", meta: "0.3s" },
  { k: "FINDING", t: "12:21:15", x: "It handed over every customer account without asking who I was. Reproduced twice, scored critical." },
  { k: "THINKING", t: "12:21:16", x: "thinking, encrypted" },
  { k: "REASONING", t: "12:21:40", x: "Those records contain internal identifiers. Put together with the weak session handling, this stops being two small problems and becomes one way in." },
  { k: "TOOL", t: "12:22:03", x: "Trying to walk past the login", badge: "ALLOW", meta: "0.5s" },
  { k: "FINDING", t: "12:22:04", x: "Logged in without a password. Scored critical, with the exact steps to repeat it." },
  { k: "TOOL", t: "12:22:31", x: "Attempting to delete a record", badge: "BLOCK", meta: "WOULD CAUSE DAMAGE" },
  { k: "GUARD", t: "12:22:31", x: "Stopped before it left the sandbox. Coverage is never bought with your data or your uptime." },
  { k: "REASONING", t: "12:23:08", x: "Little left to learn here. Writing up what was proven so the next run starts from this, not from nothing." },
];
