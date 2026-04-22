import Link from "next/link";

export const metadata = {
  title: "Payment successful — BuildForge",
};

export default function Success() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg, #06060e)",
        color: "var(--text-2, #d8d8f0)",
        fontFamily:
          "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          padding: "40px 32px",
          border: "1px solid rgba(0,200,130,0.35)",
          background: "rgba(0,200,130,0.04)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>✓</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 10px 0",
            color: "var(--text-1, #fff)",
            letterSpacing: "-0.5px",
          }}
        >
          Payment successful
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-3, #b0b0d0)",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          Thanks for supporting BuildForge. A Stripe receipt is on its way to your
          inbox. We&apos;ll be in touch shortly with access instructions.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            background: "linear-gradient(135deg, #ff6b35, #ff4500)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "11px",
            letterSpacing: "1.5px",
            fontWeight: 700,
          }}
        >
          BACK TO BUILDFORGE →
        </Link>
      </div>
    </main>
  );
}
