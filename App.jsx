import { useState } from "react";

const SAMPLE_CONTRACT = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of 1st June 2026 ("Effective Date") between ABC Technologies Private Limited, a company incorporated under the Companies Act, 2013 ("Service Provider") and XYZ Solutions Ltd., a company incorporated under the Companies Act 2013 ("Client").

1. DEFINITIONS

1.1 "Services" means the software development and consulting services described in Schedule A.
1.2 "Confidential Information" means any non-public information disclosed by either Party.
1.3 "Intellectual Property" means all patents, copyrights, trademarks and trade secrets.
1.4 "Force Majeure Event" means any event beyond the reasonable control of a Party.

2. SERVICES

2.1 The Service Provider shall provide the services as mutually agreed between the parties from the Commencement Date.
2.2 The Client shall pay for all Services within 30 days of invoice.
2.3 The service provider warrants that the Services will be performed with reasonable skill and care.

3. CONFIDENTIALITY

3.1 Each Party agrees to keep all Confidential information strictly confidential.
3.2 The confidential information shall not be disclosed to any third party without prior written consent.
3.3 This obligation shall survive termination of the Agreement for a period of 3 years.

4. INTELLECTUAL PROPERTY RIGHTS

4.1 All Intellectual property created under this Agreement shall vest in the Client.
4.2 The Service Provider retains ownership of its pre-existing IP.

5. PAYMENT TERMS

5.1 The Client shall pay the Fees as set out in Schedule B.
5.2 All payments shall be made in Indian Rupees unless otherwise agreed.

The Parties have executed this Agreement as of the Effective Date.`;

const SYSTEM_PROMPT = `You are a meticulous legal contract analyst specializing in defined terms and document integrity.

Return ONLY a valid JSON object. NO markdown, NO backticks, NO explanation. Raw JSON only.

JSON structure:
{
  "definedTerms": [
    {"term": "Agreement", "definition": "one-line summary", "location": "Clause 1.1"}
  ],
  "inconsistencies": [
    {"term": "Services", "issue": "Defined with capital S in Clause 1.1, used as lowercase 'services' in Clause 2.3", "severity": "high"}
  ],
  "undefinedUsages": [
    {"term": "Commencement Date", "issue": "Used in Clause 2.1 as a defined term (capitalised) but never formally defined"}
  ],
  "unusedDefinitions": [
    {"term": "Force Majeure Event", "issue": "Defined in Clause 1.4 but never referenced in the operative clauses"}
  ],
  "missingAttachments": [
    {"name": "Schedule A", "issue": "Referenced in Clause 1.1 but not included in the contract text"}
  ]
}

RULES:

1. definedTerms: Extract every term formally defined via quotation marks + "means"/"shall mean", or in a Definitions section.

2. inconsistencies: Flag ANY capitalisation mismatch, spelling variation, or use of similar-but-different terms.
   Severity: "high" if it changes legal meaning, "medium" if a clear error, "low" if cosmetic.

3. undefinedUsages — BE THOROUGH:
   - Find every word/phrase used AS IF defined but with no formal definition.
   - "Party" and "Parties": if capitalised in operative clauses but NOT given a standalone definition, flag them.
   - Also check: "Fees", "Commencement Date", and any other capitalised terms in operative clauses.
   - Do NOT flag a term just because it appears inside another term's definition.

4. unusedDefinitions: Formally defined terms never used in the operative clauses.

5. missingAttachments: Scan for all references to Schedules, Annexures, Exhibits, Appendices.
   For each one, check if it actually appears in the text. If not, flag it with the clause where referenced.`;

const colors = {
  navy: "#0F172A", navyLight: "#1E293B", slate: "#64748B", slateLight: "#94A3B8",
  bg: "#F1F5F9", white: "#FFFFFF",
  amber: "#D97706", amberBg: "#FFFBEB", amberBorder: "#FCD34D",
  green: "#059669", greenBg: "#ECFDF5", greenBorder: "#6EE7B7",
  purple: "#7C3AED", purpleBg: "#F5F3FF", purpleBorder: "#C4B5FD",
  blue: "#1D4ED8", blueBg: "#EFF6FF", blueBorder: "#93C5FD",
  red: "#DC2626", redBg: "#FEF2F2", redBorder: "#FCA5A5",
  orange: "#EA580C", orangeBg: "#FFF7ED", orangeBorder: "#FDBA74",
};

function Badge({ count, color, bg }) {
  return (
    <span style={{ background: bg, color, fontWeight: 700, fontSize: 12, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>
      {count}
    </span>
  );
}

function IssueCard({ children, borderColor }) {
  return (
    <div style={{
      background: colors.white, borderRadius: 8, padding: "11px 14px",
      fontSize: 13.5, color: colors.navyLight, lineHeight: 1.6,
      borderLeft: `3px solid ${borderColor}`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
    }}>
      {children}
    </div>
  );
}

function Section({ title, items, accentColor, bg, borderColor, badgeBg, renderItem, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 18px", cursor: "pointer",
        borderBottom: open ? `1px solid ${borderColor}` : "none"
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: accentColor }}>
          {title}<Badge count={items.length} color={accentColor} bg={badgeBg} />
        </span>
        <span style={{ color: colors.slateLight, fontSize: 18 }}>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => <IssueCard key={i} borderColor={borderColor}>{renderItem(item)}</IssueCard>)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, count, color, bg, icon }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
        <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 3, opacity: 0.8 }}>{label}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this contract:\n\n${text}` }]
        })
      });

      const data = await res.json();
      const raw = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      setResults(JSON.parse(raw));
    } catch {
      setError("Analysis failed — check your contract text and try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalIssues = results
    ? (results.inconsistencies?.length || 0) + (results.undefinedUsages?.length || 0)
      + (results.unusedDefinitions?.length || 0) + (results.missingAttachments?.length || 0)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Inter', -apple-system, sans-serif", padding: "28px 20px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, background: colors.navy, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚖️</div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.navy, letterSpacing: "-0.3px" }}>Defined Terms Checker</h1>
          </div>
          <p style={{ margin: 0, color: colors.slate, fontSize: 13.5, paddingLeft: 46 }}>
            Flags term inconsistencies, undefined usages, orphaned definitions, and missing attachments.
          </p>
        </div>

        {/* Input */}
        <div style={{ background: colors.white, borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.navyLight }}>Contract Text</label>
            <button onClick={() => { setText(SAMPLE_CONTRACT); setResults(null); setError(null); }}
              style={{ background: "transparent", border: `1px solid ${colors.slateLight}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: colors.slate, cursor: "pointer", fontWeight: 500 }}>
              Load sample ↓
            </button>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={"Paste your contract here...\n\nDetects:\n• Capitalisation inconsistencies (Services vs services)\n• Implied defined terms with no definition (Party, Fees, Commencement Date)\n• Definitions that are never used\n• Schedules / Annexures referenced but missing"}
            style={{
              width: "100%", minHeight: 210, border: `1px solid #E2E8F0`, borderRadius: 9,
              padding: "13px 15px", fontSize: 13, color: colors.navyLight, resize: "vertical",
              fontFamily: "monospace", lineHeight: 1.7, boxSizing: "border-box", outline: "none", background: "#FAFBFD"
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: colors.slateLight }}>
              {text.length > 0 ? `${text.length.toLocaleString()} chars · ~${Math.round(text.split(/\s+/).filter(Boolean).length)} words` : "No text"}
            </span>
            <button onClick={analyze} disabled={!text.trim() || loading}
              style={{
                background: (!text.trim() || loading) ? colors.slate : colors.navy,
                color: "white", border: "none", borderRadius: 9, padding: "10px 26px",
                fontSize: 14, fontWeight: 700, cursor: (!text.trim() || loading) ? "not-allowed" : "pointer"
              }}>
              {loading ? "Analyzing…" : "Analyze →"}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ background: colors.white, borderRadius: 12, padding: "28px 20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <div style={{ color: colors.navyLight, fontWeight: 600, fontSize: 15 }}>Reading the contract…</div>
            <div style={{ color: colors.slateLight, fontSize: 13, marginTop: 4 }}>Checking definitions, consistency, and attachments</div>
          </div>
        )}

        {error && (
          <div style={{ background: colors.redBg, border: `1px solid ${colors.redBorder}`, borderRadius: 10, padding: "13px 16px", color: colors.red, fontSize: 13.5, marginBottom: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {results && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
              <StatCard icon="📋" label="Defined Terms"   count={results.definedTerms?.length || 0}       color={colors.green}  bg={colors.greenBg}  />
              <StatCard icon="⚠️" label="Inconsistencies" count={results.inconsistencies?.length || 0}    color={colors.amber}  bg={colors.amberBg}  />
              <StatCard icon="❓" label="Undefined Usage" count={results.undefinedUsages?.length || 0}    color={colors.purple} bg={colors.purpleBg} />
              <StatCard icon="📦" label="Unused Defs"     count={results.unusedDefinitions?.length || 0}  color={colors.blue}   bg={colors.blueBg}   />
              <StatCard icon="📎" label="Missing Attach." count={results.missingAttachments?.length || 0} color={colors.orange} bg={colors.orangeBg} />
            </div>

            {totalIssues === 0 && (
              <div style={{ background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, borderRadius: 12, padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>✅</div>
                <div style={{ fontWeight: 700, color: colors.green, fontSize: 16, marginTop: 8 }}>No issues found</div>
                <div style={{ color: colors.slate, fontSize: 13, marginTop: 4 }}>Defined terms are consistent and all attachments are present.</div>
              </div>
            )}

            <Section title="Missing Attachments" items={results.missingAttachments}
              accentColor={colors.orange} bg={colors.orangeBg} borderColor={colors.orangeBorder} badgeBg="#FFEDD5"
              renderItem={i => (<><span style={{ fontWeight: 700, color: colors.navy }}>{i.name}</span><div style={{ color: colors.slate, marginTop: 3, fontSize: 13 }}>{i.issue}</div></>)} />

            <Section title="Inconsistencies" items={results.inconsistencies}
              accentColor={colors.amber} bg={colors.amberBg} borderColor={colors.amberBorder} badgeBg="#FEF3C7"
              renderItem={i => (<>
                <span style={{ fontWeight: 700, color: colors.navy }}>"{i.term}"</span>
                {i.severity === "high" && <span style={{ marginLeft: 6, fontSize: 11, background: "#FEE2E2", color: colors.red, padding: "1px 7px", borderRadius: 12, fontWeight: 600 }}>HIGH</span>}
                {i.severity === "medium" && <span style={{ marginLeft: 6, fontSize: 11, background: "#FEF3C7", color: colors.amber, padding: "1px 7px", borderRadius: 12, fontWeight: 600 }}>MEDIUM</span>}
                <div style={{ color: colors.slate, marginTop: 3, fontSize: 13 }}>{i.issue}</div>
              </>)} />

            <Section title="Undefined Usages" items={results.undefinedUsages}
              accentColor={colors.purple} bg={colors.purpleBg} borderColor={colors.purpleBorder} badgeBg="#EDE9FE"
              renderItem={i => (<><span style={{ fontWeight: 700, color: colors.navy }}>"{i.term}"</span><div style={{ color: colors.slate, marginTop: 3, fontSize: 13 }}>{i.issue}</div></>)} />

            <Section title="Unused Definitions" items={results.unusedDefinitions}
              accentColor={colors.blue} bg={colors.blueBg} borderColor={colors.blueBorder} badgeBg="#DBEAFE"
              renderItem={i => (<><span style={{ fontWeight: 700, color: colors.navy }}>"{i.term}"</span><div style={{ color: colors.slate, marginTop: 3, fontSize: 13 }}>{i.issue}</div></>)} />

            <Section title="All Defined Terms" items={results.definedTerms}
              accentColor={colors.green} bg={colors.greenBg} borderColor={colors.greenBorder} badgeBg="#D1FAE5"
              defaultOpen={false}
              renderItem={i => (<>
                <span style={{ fontWeight: 700, color: colors.navy }}>"{i.term}"</span>
                {i.location && <span style={{ marginLeft: 8, fontSize: 11.5, color: colors.slateLight }}>{i.location}</span>}
                {i.definition && <div style={{ color: colors.slate, marginTop: 3, fontSize: 13 }}>{i.definition}</div>}
              </>)} />

            <div style={{ textAlign: "center", marginTop: 20, color: colors.slateLight, fontSize: 12 }}>
              Defined Terms Checker · Built with Claude AI
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
