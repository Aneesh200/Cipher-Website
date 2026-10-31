/**
 * Shared between the enquiry form and /api/enquiry.
 *
 * The Turnstile action is bound into the token on the client and checked on the
 * server in production, so a token solved on another page can't be replayed here.
 */
export const TURNSTILE_ACTION = "enquiry";

/** Off-screen field that people never see and naive form bots fill in. */
export const HONEYPOT_FIELD = "a_ref";

export const CONTACT_EMAIL = "contact@authify.tech";
