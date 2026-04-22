import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === "string"
    ? ((body as { email: string }).email).trim().toLowerCase()
    : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const notifyTo = process.env.NOTIFY_EMAIL;
  const notifyFrom = process.env.RESEND_FROM;

  if (!apiKey) {
    return NextResponse.json({ error: "Signups are not configured yet." }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  if (audienceId) {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error && error.name !== "validation_error") {
      return NextResponse.json({ error: "Could not save email." }, { status: 502 });
    }
  }

  if (notifyTo && notifyFrom) {
    await resend.emails.send({
      from: notifyFrom,
      to: notifyTo,
      subject: "BuildForge — new signup",
      text: `New signup: ${email}`,
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
