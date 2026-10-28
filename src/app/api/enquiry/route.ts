import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
// Gmail's SMTP handshake plus two sends runs ~4s, which is uncomfortably close
// to the default 10s ceiling on a cold start or a slow relay.
export const maxDuration = 30;

// Credentials come from the environment — never hardcoded. Set EMAIL_USER /
// EMAIL_PASS (a Gmail app password) and optionally CONTACT_RECIPIENT.
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECIPIENT =
  process.env.CONTACT_RECIPIENT || EMAIL_USER || "contact@authify.tech";

type Enquiry = {
  name?: string;
  email?: string;
  organisation?: string;
  role?: string;
  asset?: string;
  surface?: string;
  timing?: string;
  authoriser?: string;
  notes?: string;
};

const esc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const line = (k: string, v?: string) => `
  <tr>
    <td style="padding:9px 0;border-top:1px solid #E4E7EC;color:#5A6473;font-size:13px;font-family:'IBM Plex Mono',monospace;letter-spacing:0.06em;">${k}</td>
    <td style="padding:9px 0 9px 20px;border-top:1px solid #E4E7EC;color:#11161C;font-size:15px;">${esc(v?.trim() || "Not provided")}</td>
  </tr>`;

export async function POST(req: Request) {
  let body: Enquiry;
  try {
    body = (await req.json()) as Enquiry;
  } catch {
    return NextResponse.json(
      { success: false, error: "Malformed request." },
      { status: 400 }
    );
  }

  const { name, email, organisation, role, asset, surface, timing, authoriser, notes } =
    body;

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid work email address." },
      { status: 400 }
    );
  }
  if (!asset?.trim()) {
    return NextResponse.json(
      { success: false, error: "Please name the asset you want assessed." },
      { status: 400 }
    );
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Enquiry API: EMAIL_USER / EMAIL_PASS not configured.");
    return NextResponse.json(
      {
        success: false,
        error:
          "The enquiry channel is not configured. Please email contact@authify.tech directly.",
      },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const who = name?.trim() || "Someone";
  const org = organisation?.trim();

  try {
    // Both go at once: the acknowledgement must never delay the notification.
    const notify = transporter.sendMail({
      to: RECIPIENT,
      from: EMAIL_USER,
      replyTo: email.trim(),
      subject: `Cipher enquiry: ${asset.trim()}${org ? ` — ${org}` : ""}`,
      text: [
        "New Cipher engagement enquiry",
        "",
        `Name: ${name?.trim() || "Not provided"}`,
        `Email: ${email.trim()}`,
        `Organisation: ${org || "Not provided"}`,
        `Role: ${role?.trim() || "Not provided"}`,
        `Asset: ${asset.trim()}`,
        `Surface: ${surface?.trim() || "Not provided"}`,
        `Timing: ${timing?.trim() || "Not provided"}`,
        `Authoriser: ${authoriser?.trim() || "Not provided"}`,
        "",
        "Notes:",
        notes?.trim() || "None",
      ].join("\n"),
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:640px;margin:0 auto;background:#FBFBFA;color:#11161C;">
          <div style="background:#11161C;padding:20px 28px;">
            <span style="display:inline-block;width:10px;height:10px;background:#8C1027;transform:rotate(45deg);"></span>
            <span style="color:#FFFFFF;font-family:'IBM Plex Mono',monospace;letter-spacing:0.16em;font-size:14px;margin-left:10px;">CIPHER</span>
            <span style="color:#8A93A0;font-family:'IBM Plex Mono',monospace;letter-spacing:0.14em;font-size:11px;margin-left:8px;">// ENGAGEMENT ENQUIRY</span>
          </div>
          <div style="padding:28px;">
            <h2 style="margin:0 0 6px;font-size:24px;font-weight:500;letter-spacing:-0.02em;">${esc(who)} wants an asset assessed</h2>
            <p style="margin:0 0 22px;color:#5A6473;font-size:15px;">Reply directly to this email to reach them.</p>
            <table style="width:100%;border-collapse:collapse;border-bottom:1px solid #11161C;">
              ${line("name", name)}
              ${line("email", email)}
              ${line("organisation", organisation)}
              ${line("role", role)}
              ${line("asset", asset)}
              ${line("surface", surface)}
              ${line("timing", timing)}
              ${line("authoriser", authoriser)}
            </table>
            <p style="margin:22px 0 8px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#8A93A0;">ANYTHING WE SHOULD KNOW</p>
            <p style="margin:0;background:#F4F4F2;border-left:2px solid #8C1027;padding:14px 16px;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#3E4855;">${esc(notes?.trim() || "Nothing added.")}</p>
          </div>
        </div>`,
    });

    const acknowledge = transporter.sendMail({
      to: email.trim(),
      from: EMAIL_USER,
      replyTo: RECIPIENT,
      subject: "Enquiry received — Cipher",
      text: `Hi ${name?.trim() || "there"},\n\nThanks for getting in touch about ${asset.trim()}. We reply within two business days with a scope document naming exactly what is in and out of bounds, and the safety constraints in writing, before anything runs.\n\nCipher — Authify\ncontact@authify.tech`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:640px;margin:0 auto;background:#FBFBFA;color:#11161C;">
          <div style="background:#11161C;padding:20px 28px;">
            <span style="display:inline-block;width:10px;height:10px;background:#8C1027;transform:rotate(45deg);"></span>
            <span style="color:#FFFFFF;font-family:'IBM Plex Mono',monospace;letter-spacing:0.16em;font-size:14px;margin-left:10px;">CIPHER</span>
          </div>
          <div style="padding:32px 28px;">
            <h2 style="margin:0 0 16px;font-size:24px;font-weight:500;letter-spacing:-0.02em;">Enquiry received.</h2>
            <p style="margin:0 0 14px;color:#3E4855;font-size:16px;line-height:1.6;">Hi ${esc(name?.trim() || "there")},</p>
            <p style="margin:0 0 14px;color:#3E4855;font-size:16px;line-height:1.6;">Thanks for getting in touch about <strong>${esc(asset.trim())}</strong>. We reply within two business days with a scope document naming exactly what is in and out of bounds, and the safety constraints in writing, before anything runs.</p>
            <table style="width:100%;border-collapse:collapse;border-top:1px solid #11161C;border-bottom:1px solid #11161C;margin:24px 0;">
              <tr><td style="padding:12px 0;color:#3E4855;font-size:15px;">Scope document</td><td style="padding:12px 0;text-align:right;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#11161C;">2 BUSINESS DAYS</td></tr>
              <tr><td style="padding:12px 0;border-top:1px solid #E4E7EC;color:#3E4855;font-size:15px;">First verified findings</td><td style="padding:12px 0;border-top:1px solid #E4E7EC;text-align:right;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#11161C;">HOURS FROM START</td></tr>
              <tr><td style="padding:12px 0;border-top:1px solid #E4E7EC;color:#3E4855;font-size:15px;">Audit log</td><td style="padding:12px 0;border-top:1px solid #E4E7EC;text-align:right;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8C1027;">WITH EVERY RUN</td></tr>
            </table>
            <p style="margin:0;color:#8A93A0;font-size:13px;line-height:1.6;">Nothing you sent is shared outside Cipher, and enquiry details are never used to train a model.</p>
          </div>
          <div style="background:#0A0D11;padding:18px 28px;">
            <span style="color:#DCE0E6;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.16em;">CIPHER</span>
            <span style="color:#6E7887;font-size:13px;margin-left:12px;">Find the way in before they do.</span>
          </div>
        </div>`,
    });

    const [notifyResult, ackResult] = await Promise.allSettled([
      notify,
      acknowledge,
    ]);

    // The enquiry reaching us is what matters; a bounced acknowledgement is
    // logged but is not the sender's problem.
    if (notifyResult.status === "rejected") throw notifyResult.reason;
    if (ackResult.status === "rejected") {
      console.error("Enquiry API: acknowledgement failed:", ackResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "We could not send that just now. Please email contact@authify.tech directly.",
      },
      { status: 500 }
    );
  }
}
