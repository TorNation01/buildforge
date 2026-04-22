import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unlock — BuildForge",
  robots: "noindex,nofollow",
};

function parseCodes(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map(c => c.trim()).filter(Boolean);
}

export default function UnlockPage({ params }: { params: { code: string } }) {
  const supplied = decodeURIComponent(params.code || "");
  const validCodes = parseCodes(process.env.ADMIN_ACCESS_CODES);
  const configured = validCodes.length > 0;
  const ok = configured && validCodes.includes(supplied);

  const baseStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "var(--bg, #06060e)",
    color: "var(--text-2, #d8d8f0)",
    fontFamily:
      "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  };

  if (!ok) {
    return (
      <main style={baseStyle}>
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            padding: "40px 32px",
            border: "1px solid rgba(255,100,100,0.35)",
            background: "rgba(255,100,100,0.04)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.7 }}>×</div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              margin: "0 0 10px 0",
              color: "var(--text-1, #fff)",
              letterSpacing: "-0.5px",
            }}
          >
            Invalid access code
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-3, #b0b0d0)",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            {configured
              ? "The code in the URL doesn't match any active access code."
              : "Admin access isn't configured on this deployment."}
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
            ← BACK TO BUILDFORGE
          </Link>
        </div>
      </main>
    );
  }

  const script = `try{localStorage.setItem('bf-access','full');localStorage.setItem('bf-access-code',${JSON.stringify(supplied)});}catch(e){}setTimeout(function(){window.location.replace('/?unlocked=1');},1200);`;

  return (
    <main style={baseStyle}>
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
        <div style={{ fontSize: "40px", marginBottom: "12px", color: "#00c882" }}>✓</div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 10px 0",
            color: "var(--text-1, #fff)",
            letterSpacing: "-0.5px",
          }}
        >
          Full library unlocked
        </h1>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-3, #b0b0d0)",
            lineHeight: 1.75,
            marginBottom: "8px",
          }}
        >
          You have complimentary access to all BuildForge templates and features.
          Redirecting you to the site…
        </p>
        <div
          style={{
            fontSize: "10px",
            color: "var(--text-4, #8888a8)",
            letterSpacing: "1px",
            marginTop: "20px",
          }}
        >
          CODE: {supplied}
        </div>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </div>
    </main>
  );
}
