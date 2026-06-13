import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const sections: Record<string, { title: string; blocks: Array<{ type: string; content: string }> }> = {
  "getting-started": {
    title: "Getting Started",
    blocks: [
      { type: "h1", content: "Getting Started" },
      { type: "p", content: "NexusPlay provides a production-grade game provider API that allows licensed casino operators to integrate our crash and arcade games into their platform." },
      { type: "h2", content: "Prerequisites" },
      { type: "p", content: "A valid casino operator license, an approved NexusPlay partner account, and an HTTPS-capable server for webhook delivery." },
      { type: "h2", content: "Step 1: Create a Partner Account" },
      { type: "p", content: "Register at nexusplay.io/partner/register and submit your operator license documentation. Approval typically takes 1-2 business days." },
      { type: "h2", content: "Step 2: Generate API Credentials" },
      { type: "p", content: "In your partner dashboard, navigate to API Keys and create a new key. Store it securely — it will not be shown again." },
      { type: "code", content: `# Your API key looks like this:
nxp_live_sk_1234567890abcdef...` },
      { type: "h2", content: "Step 3: Launch Your First Game" },
      { type: "code", content: `curl -X POST https://api.nexusplay.io/v1/provider/session \\
  -H "Authorization: Bearer nxp_live_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "gameId": "elevator",
    "playerId": "player_xyz",
    "currency": "USD",
    "balance": 1000
  }'` },
      { type: "h2", content: "Step 4: Embed in Your Casino" },
      { type: "code", content: `<iframe
  src="https://games.nexusplay.io/play/sess_abc123"
  width="100%"
  height="600"
  frameborder="0"
></iframe>` },
    ],
  },
  "authentication": {
    title: "Authentication",
    blocks: [
      { type: "h1", content: "Authentication" },
      { type: "h2", content: "API Keys" },
      { type: "p", content: "All API requests must include your API key in the Authorization header:" },
      { type: "code", content: `Authorization: Bearer nxp_live_sk_...` },
      { type: "h2", content: "Key Types" },
      { type: "table", content: "Type|Prefix|Use\nLive|nxp_live_sk_|Production\nTest|nxp_test_sk_|Sandbox" },
      { type: "h2", content: "HMAC Request Signing" },
      { type: "p", content: "For webhook delivery and sensitive operations, NexusPlay signs requests with HMAC-SHA256." },
      { type: "code", content: `const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}` },
      { type: "h2", content: "Rate Limits" },
      { type: "table", content: "Endpoint|Limit\n/v1/provider/session|100 req/min\n/v1/games|1000 req/min\n/v1/api-keys|10 req/min" },
    ],
  },
  "api": {
    title: "API Reference",
    blocks: [
      { type: "h1", content: "API Reference" },
      { type: "p", content: "Base URL: https://api.nexusplay.io/v1" },
      { type: "h2", content: "POST /provider/session" },
      { type: "p", content: "Create a new game session and get a signed launch URL." },
      { type: "code", content: `{
  "gameId": "elevator",
  "playerId": "string",
  "currency": "USD",
  "balance": 1000,
  "locale": "en-US"
}` },
      { type: "h2", content: "Response" },
      { type: "code", content: `{
  "sessionId": "sess_abc123",
  "launchUrl": "https://games.nexusplay.io/play/sess_abc123",
  "token": "eyJ...",
  "expiresAt": "2024-12-31T12:00:00Z"
}` },
      { type: "h2", content: "POST /provider/balance" },
      { type: "p", content: "Called by the game to fetch player balance. Must be implemented on your server." },
      { type: "h2", content: "POST /provider/bet" },
      { type: "p", content: "Called when a player places a bet. Deduct from the player's balance and return the new balance." },
      { type: "h2", content: "POST /provider/win" },
      { type: "p", content: "Called when a player wins. Credit the amount and return the updated balance." },
      { type: "h2", content: "POST /provider/rollback" },
      { type: "p", content: "Cancel a transaction. Called on network errors or timeouts to maintain balance integrity." },
      { type: "h2", content: "Error Codes" },
      { type: "table", content: "Code|Description\n1001|Invalid API key\n1002|Insufficient balance\n1003|Game not found\n1004|Session expired\n1005|Rate limit exceeded" },
    ],
  },
  "webhooks": {
    title: "Webhooks",
    blocks: [
      { type: "h1", content: "Webhooks" },
      { type: "p", content: "Webhooks deliver real-time event notifications to your server when game events occur." },
      { type: "h2", content: "Event Types" },
      { type: "table", content: "Event|Description\nsession.created|A game session was created\nsession.expired|A game session expired\nbet.placed|A player placed a bet\nwin.credited|A win was credited\ngame.started|A game round started\ngame.ended|A game round ended" },
      { type: "h2", content: "Payload Format" },
      { type: "code", content: `{
  "id": "evt_abc123",
  "type": "bet.placed",
  "timestamp": "2024-12-01T12:00:00Z",
  "data": {
    "sessionId": "sess_xyz",
    "playerId": "player_abc",
    "gameId": "elevator",
    "amount": 10.00,
    "currency": "USD",
    "roundId": "round_123"
  }
}` },
      { type: "h2", content: "Signature Verification" },
      { type: "code", content: `app.post('/webhook', express.raw({ type: '*/*' }), (req, res) => {
  const sig = req.headers['x-nexusplay-signature'];
  const valid = verifyWebhook(req.body, sig, WEBHOOK_SECRET);
  if (!valid) return res.status(401).send('Invalid signature');
  const event = JSON.parse(req.body);
  // handle event...
  res.json({ received: true });
});` },
      { type: "h2", content: "Retry Policy" },
      { type: "p", content: "Failed deliveries are retried up to 5 times with exponential backoff: 1m, 5m, 30m, 2h, 12h." },
    ],
  },
  "security": {
    title: "Security",
    blocks: [
      { type: "h1", content: "Security" },
      { type: "h2", content: "Keep API Keys Secret" },
      { type: "p", content: "Never expose API keys in client-side code, browser URLs, or version control. Use environment variables or a secrets manager." },
      { type: "h2", content: "Verify Webhook Signatures" },
      { type: "p", content: "Always verify the HMAC signature on incoming webhooks before processing any event." },
      { type: "h2", content: "IP Allowlisting" },
      { type: "p", content: "Restrict API key usage to specific IP addresses in the partner dashboard under Settings." },
      { type: "h2", content: "Use HTTPS" },
      { type: "p", content: "All callback endpoints and webhook URLs must be served over HTTPS. HTTP endpoints will be rejected." },
      { type: "h2", content: "Audit Logs" },
      { type: "p", content: "Every API request is logged with timestamp, IP address, and result. Audit logs are available in your dashboard for 90 days." },
    ],
  },
  "sdk": {
    title: "SDK Reference",
    blocks: [
      { type: "h1", content: "SDK Reference" },
      { type: "h2", content: "JavaScript / TypeScript" },
      { type: "code", content: `npm install @nexusplay/sdk` },
      { type: "code", content: `import { NexusPlayClient } from '@nexusplay/sdk';

const client = new NexusPlayClient({
  apiKey: process.env.NEXUS_API_KEY,
  operatorId: 'op_abc123',
});

const session = await client.games.launch({
  gameId: 'elevator',
  playerId: 'player_xyz',
  currency: 'USD',
  balance: 1000,
});

console.log(session.launchUrl);` },
      { type: "h2", content: "PHP" },
      { type: "code", content: `composer require nexusplay/sdk` },
      { type: "code", content: `$client = new \\NexusPlay\\Client([
  'api_key' => getenv('NEXUS_API_KEY'),
  'operator_id' => 'op_abc123',
]);

$session = $client->games->launch([
  'game_id' => 'elevator',
  'player_id' => 'player_xyz',
  'currency' => 'USD',
  'balance' => 1000,
]);` },
      { type: "h2", content: "Python" },
      { type: "code", content: `pip install nexusplay` },
      { type: "code", content: `import nexusplay

client = nexusplay.Client(
    api_key=os.environ["NEXUS_API_KEY"],
    operator_id="op_abc123",
)

session = client.games.launch(
    game_id="elevator",
    player_id="player_xyz",
    currency="USD",
    balance=1000,
)` },
      { type: "h2", content: "C#" },
      { type: "code", content: `dotnet add package NexusPlay.SDK` },
      { type: "code", content: `var client = new NexusPlayClient(new ClientOptions {
  ApiKey = Environment.GetEnvironmentVariable("NEXUS_API_KEY"),
  OperatorId = "op_abc123",
});

var session = await client.Games.LaunchAsync(new LaunchRequest {
  GameId = "elevator",
  PlayerId = "player_xyz",
  Currency = "USD",
  Balance = 1000,
});` },
    ],
  },
};

const navItems = [
  { key: "getting-started", label: "Getting Started" },
  { key: "authentication", label: "Authentication" },
  { key: "api", label: "API Reference" },
  { key: "webhooks", label: "Webhooks" },
  { key: "security", label: "Security" },
  { key: "sdk", label: "SDK Reference" },
];

export function generateStaticParams() {
  return Object.keys(sections).map(section => ({ section }));
}

export default async function DocSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionKey } = await params;
  const section = sections[sectionKey];
  if (!section) notFound();

  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "200px 1fr", gap: "3rem" }}>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: "6rem", height: "fit-content" }}>
          <div style={{ fontSize: "0.625rem", fontFamily: "monospace", color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Documentation</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navItems.map(item => (
              <Link key={item.key} href={`/docs/${item.key}`} style={{
                display: "block", padding: "0.5rem 0.75rem", fontSize: "0.875rem",
                borderRadius: "0.375rem", textDecoration: "none",
                background: item.key === sectionKey ? "#27272a" : "transparent",
                color: item.key === sectionKey ? "#fafafa" : "#71717a",
              }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div>
          <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#52525b", textDecoration: "none", marginBottom: "2rem" }}>
            <ArrowLeft size={14} /> All docs
          </Link>

          <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "2.5rem" }}>
            {section.blocks.map((block, i) => {
              if (block.type === "h1") return (
                <h1 key={i} style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fafafa", marginBottom: "1.5rem" }}>{block.content}</h1>
              );
              if (block.type === "h2") return (
                <h2 key={i} style={{ fontSize: "1rem", fontWeight: 600, color: "#fafafa", marginTop: "2rem", marginBottom: "0.75rem", paddingTop: "1.5rem", borderTop: "1px solid #27272a" }}>{block.content}</h2>
              );
              if (block.type === "p") return (
                <p key={i} style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.75, marginBottom: "1rem" }}>{block.content}</p>
              );
              if (block.type === "code") return (
                <pre key={i} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", padding: "1rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#a1a1aa", lineHeight: 1.75, overflow: "auto", marginBottom: "1rem" }}>
                  {block.content}
                </pre>
              );
              if (block.type === "table") {
                const rows = block.content.split("\n").map(r => r.split("|"));
                const [header, ...body] = rows;
                return (
                  <div key={i} style={{ marginBottom: "1rem", border: "1px solid #27272a", borderRadius: "0.5rem", overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${header.length}, 1fr)`, background: "#18181b", borderBottom: "1px solid #27272a" }}>
                      {header.map((h, j) => <div key={j} style={{ padding: "0.625rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#a1a1aa" }}>{h}</div>)}
                    </div>
                    {body.map((row, ri) => (
                      <div key={ri} style={{ display: "grid", gridTemplateColumns: `repeat(${header.length}, 1fr)`, borderBottom: ri < body.length - 1 ? "1px solid #27272a" : "none" }}>
                        {row.map((cell, ci) => <div key={ci} style={{ padding: "0.625rem 0.75rem", fontSize: "0.875rem", color: "#71717a", fontFamily: ci === 0 ? "monospace" : "inherit" }}>{cell}</div>)}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
