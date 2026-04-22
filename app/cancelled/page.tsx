import Link from "next/link";

export const metadata = {
  title: "Checkout cancelled — BuildForge",
};

export default function Cancelled() {
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
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.7 }}>○</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 10px 0",
            color: "var(--text-1, #fff)",
            letterSpacing: "-0.5px",
          }}
        >
          Checkout cancelled
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-3, #b0b0d0)",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          No charge has been made. Change your mind? Pick a plan on the home page.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            border: "1px solid rgba(255,107,53,0.5)",
            color: "#ff6b35",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "11px",
            letterSpacing: "1.5px",
            fontWeight: 700,
          }}
        >
          ← BACK TO PRICING
        </Link>
      </div>
    </main>
  );
}
