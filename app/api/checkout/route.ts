import { NextResponse } from "next/server";
import Stripe from "stripe";

type PlanId = "oneoff" | "builder" | "agency";
type CheckoutMode = "payment" | "subscription";

const PLAN_ENV: Record<PlanId, { envVar: string; mode: CheckoutMode }> = {
  oneoff: { envVar: "STRIPE_PRICE_ONEOFF", mode: "payment" },
  builder: { envVar: "STRIPE_PRICE_BUILDER", mode: "subscription" },
  agency: { envVar: "STRIPE_PRICE_AGENCY", mode: "subscription" },
};

function resolveSiteUrl(req: Request): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const plan = (body as { plan?: unknown })?.plan;
  if (typeof plan !== "string" || !(plan in PLAN_ENV)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const { envVar, mode } = PLAN_ENV[plan as PlanId];
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[envVar];

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const site = resolveSiteUrl(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cancelled`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      billing_address_collection: "auto",
    });
    if (!session.url) {
      return NextResponse.json({ error: "No session URL returned." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
