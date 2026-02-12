/**
 * AI GHL Advisor
 * Expert GoHighLevel CRM advisor powered by AI.
 * Helps VAs and freelancers with pipeline design, workflow automation,
 * tag strategy, integrations, and troubleshooting.
 * Supports optional screenshot uploads for visual troubleshooting.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChatCircle, Lightning, SpinnerGap, Copy, Check, ArrowClockwise,
  WarningCircle, Lightbulb, CaretDown, UploadSimple, Trash, X,
  Gear, FlowArrow, Tag, Plugs, Wrench, Question, Image as ImageIcon,
  Buildings, TreeStructure, MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsOutCardinal
} from '@phosphor-icons/react';
import SEO from './SEO';

// ============================================
// BRAND & THEME
// ============================================
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4',
};

const FONTS = {
  heading: "'Montserrat', sans-serif",
  body: "'Poppins', sans-serif",
};

const getTheme = (isDark) => ({
  bg: isDark ? '#0d0b09' : '#faf8f5',
  cardBg: isDark ? '#171411' : '#ffffff',
  cardBorder: isDark ? '#2a2420' : '#e8e0d4',
  text: isDark ? '#f5f0eb' : '#3F200C',
  textMuted: isDark ? '#a09585' : '#5e4d38',
  inputBg: isDark ? '#1e1a16' : '#faf8f5',
  inputBorder: isDark ? '#332d26' : '#e0d6c8',
  errorBg: isDark ? '#260a0a' : '#fef2f2',
  errorBorder: isDark ? '#7f1d1d' : '#fecaca',
  errorText: isDark ? '#fca5a5' : '#dc2626',
  successBg: isDark ? '#0a2618' : '#ecfdf5',
  successBorder: isDark ? '#166534' : '#86efac',
});

// ============================================
// OPENAI CONFIG
// ============================================
const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  edgeFunctionUrl: import.meta.env.VITE_OPENAI_EDGE_URL || '',
  textModel: 'gpt-4o-mini',
  visionModel: 'gpt-4o',
};

// ============================================
// COOLDOWN CONFIG
// ============================================
const COOLDOWN_KEY = 'brewedops_ghl_advisor_cooldown_end';
const COOLDOWN_MS = 1 * 60 * 1000;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1500;

// ============================================
// EXPERIENCE LEVELS
// ============================================
const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'New to GHL' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with core features' },
  { value: 'advanced', label: 'Advanced', desc: 'Power user' },
];

// ============================================
// QUESTION CATEGORIES
// ============================================
const QUESTION_CATEGORIES = [
  { value: 'pipeline', label: 'Pipeline Design', icon: FlowArrow, color: BRAND.blue },
  { value: 'workflow', label: 'Workflow Automation', icon: Gear, color: '#f59e0b' },
  { value: 'tags', label: 'Tag Strategy', icon: Tag, color: BRAND.green },
  { value: 'integrations', label: 'Integrations', icon: Plugs, color: '#8b5cf6' },
  { value: 'troubleshooting', label: 'Troubleshooting', icon: Wrench, color: '#ef4444' },
  { value: 'general', label: 'General', icon: Question, color: '#14b8a6' },
];

// ============================================
// SECTION CONFIG (output rendering)
// ============================================
const SECTION_CONFIG = {
  'Answer': { icon: Lightning, color: BRAND.blue },
  'Recommended Setup': { icon: Gear, color: '#f59e0b' },
  'Step-by-Step': { icon: FlowArrow, color: BRAND.green },
  'Best Practices': { icon: Lightbulb, color: '#8b5cf6' },
  'Common Pitfalls': { icon: WarningCircle, color: '#ef4444' },
  'Pro Tips': { icon: Lightbulb, color: '#14b8a6' },
  'Process Diagram': { icon: TreeStructure, color: '#6366f1' },
};

// ============================================
// SYSTEM PROMPT
// ============================================
const SYSTEM_PROMPT = `You are an expert GoHighLevel (GHL) CRM advisor who helps virtual assistants, freelancers, and small business owners master GoHighLevel. You provide specific, actionable advice tailored to the user's niche, experience level, and question category.

## YOUR KNOWLEDGE BASE

### Pipeline Design
Standard pipeline stages (adapt to any niche):
1. **New Lead/Inquiry** — First contact, expressed interest. Entry: form submission, ad click, referral. Actions: auto-tag source, send welcome email/SMS.
2. **Contacted** — Initial outreach made. Actions: log call/email, set follow-up reminder.
3. **Qualified** — Meets criteria, worth pursuing. Actions: move to nurture sequence, assign to team member.
4. **Proposal/Booking** — Sent proposal or booked appointment. Actions: send booking confirmation, payment link.
5. **Won/Active** — Deal closed, service active. Actions: onboarding sequence, tag as customer.
6. **Lost** — Did not convert. Actions: add to re-engagement campaign, tag reason for loss.
7. **Alumni/Past Client** — Service completed. Actions: review request, referral campaign, seasonal re-engagement.

Variations: Add "Waitlist" for limited capacity, "Payment Pending" for prepay services, "Paused" for subscriptions. Always define entry criteria, exit criteria, and automation triggers for each stage.

### Workflow & Email Automation
- **Welcome sequence**: Day 0 (immediate confirmation), Day 1 (value/resources), Day 3 (social proof), Day 7 (CTA)
- **Nurture sequence**: Space emails 2-3 days apart, max 5-7 emails before re-evaluation
- **Re-engagement**: Trigger after 30/60/90 days of inactivity
- **Conditional logic**: Use If/Else branches based on tags, custom fields, email opens/clicks
- **Wait conditions**: "Wait until" for time-sensitive actions, "Wait for" fixed delays
- **SMS compliance**: Always include opt-out option, respect quiet hours (8am-9pm local)
- **Subject line tips**: Personalize with {{contact.first_name}}, keep under 50 chars, A/B test

### Tag Taxonomy Best Practices
Hierarchical naming convention:
- Source: \`source:facebook\`, \`source:google\`, \`source:referral\`, \`source:website\`
- Status: \`status:hot-lead\`, \`status:qualified\`, \`status:customer\`, \`status:inactive\`
- Service: \`service:seo\`, \`service:web-design\`, \`service:coaching\`
- Engagement: \`engaged:opened-email\`, \`engaged:clicked-link\`, \`engaged:replied\`
- Campaign: \`campaign:spring-2025\`, \`campaign:black-friday\`

Rules: Use lowercase with hyphens. Prefix with category. Review and consolidate quarterly. Never create one-off tags — plan taxonomy upfront.

### Integrations
- **Stripe**: Webhooks for payment events (payment_intent.succeeded, subscription.created). Map to GHL custom fields. Use for payment-triggered workflows.
- **Calendly/GHL Calendar**: Booking triggers → pipeline stage move + confirmation sequence
- **Zapier/Make**: Connect GHL to 5000+ apps. Common: Google Sheets sync, Slack notifications, CRM enrichment
- **GHL API basics**: Base URL: https://services.leadconnectorhq.com. Auth: Bearer token. Rate limit: 100 req/min, 10K/day per location.
- **Webhooks**: GHL → external: trigger on contact events, opportunity stage changes. External → GHL: receive form submissions, payment notifications.

### Troubleshooting
- **Contact not creating**: Check form mapping (field names must match), required fields filled, form is published and linked to correct location
- **Workflow not triggering**: Verify trigger conditions, check if contact matches filters, ensure workflow is active (not draft), check if contact was already enrolled
- **Emails not delivering**: Verify SPF/DKIM/DMARC records, check sending domain reputation, warm up new domains gradually (50/day → 200/day over 2 weeks), avoid spam trigger words
- **SMS not sending**: Check Twilio/LC Phone balance, verify number is SMS-enabled, check opt-in status, respect carrier filtering rules
- **Pipeline stuck**: Check automation rules for stage transitions, verify required custom fields are populated, look for circular workflow triggers

### Rate Limits & Constraints
- API: 100 requests/min, 10,000/day per location
- Email: Warm up new domains, monitor bounce rate (<2%), unsubscribe rate (<0.5%)
- SMS: Carrier filtering, 10DLC registration required for US numbers
- Workflows: Max 25 actions per workflow recommended, use sub-workflows for complex logic

### Testing Checklist
Before launching any pipeline or workflow:
- [ ] Test form creates contact with correct tags
- [ ] Contact lands in correct pipeline stage
- [ ] First automation email/SMS sends on time
- [ ] Conditional logic branches work correctly
- [ ] Unsubscribe link functions properly
- [ ] Test on mobile (email rendering)
- [ ] Verify with multiple email providers (Gmail, Outlook)

## RESPONSE GUIDELINES

Adapt your response based on:
- **Experience level**: For beginners, explain GHL terminology and provide step-by-step navigation instructions. For intermediate, focus on optimization and best practices. For advanced, discuss API integrations, custom code, and scaling strategies.
- **Niche**: Tailor all examples, pipeline stages, and tag names to the user's specific industry.
- **Category**: Focus your response on the selected category while connecting to related areas when relevant.
- **Screenshot**: If an image is provided, analyze the screenshot carefully. Reference specific elements you see (buttons, settings, error messages, workflow nodes) and provide advice based on the visual context.

## OUTPUT FORMAT

Structure your response with these markdown headers (use all that apply, skip sections that aren't relevant to the question):

## Answer
Direct answer to the question in 2-4 paragraphs. Be specific and actionable.

## Recommended Setup
Specific configuration steps or settings. Use bullet lists with clear actions.

## Step-by-Step
Numbered steps if the question requires a walkthrough. Include where to click in GHL (e.g., "Go to Automation > Workflows > Create Workflow").

## Best Practices
3-5 bullet points of best practices for this specific scenario.

## Common Pitfalls
2-3 things to avoid or watch out for.

## Pro Tips
2-3 advanced tips. Scale complexity to the user's experience level.

## Process Diagram
ALWAYS include this section. Provide a COMPREHENSIVE mermaid.js diagram that visually maps out the FULL process. NEVER use emojis in node labels.

CRITICAL RULES FOR DIAGRAMS:
- Use \`flowchart TD\` (not \`graph TD\`) — this is the modern Mermaid syntax with better rendering
- NO emojis anywhere in node labels — use plain text only
- **KEEP NODE LABELS SHORT** — max 4-5 words per node. Use abbreviations: "Tag: qualified" not "Add Tag: status:qualified". "Welcome Email" not "Send Welcome Email with Resources". "Follow-Up #1" not "Send First Follow-Up Email". Short labels prevent text cutoff.
- A good pipeline diagram MUST have 20-50 nodes. Never fewer than 20.
- Every pipeline stage MUST branch into its automation actions (add tag, send email, notify team, wait, etc.)
- EVERY decision diamond MUST have BOTH a Yes AND a No path — NEVER leave a "No" path empty
- The "No" / negative path must show the FULL recovery flow: what happens when someone does NOT respond, does NOT open the email, does NOT accept the proposal, etc. Show wait steps, retry attempts, escalation, and eventual outcomes.
- ALL pipeline stages MUST use blue (#004AAC) — use a single classDef stage style for all stages
- Do NOT use subgraphs — they add heavy background colors. Use plain flowchart nodes with comments (%%) to organize sections instead.
- NEVER use the \`&\` syntax (e.g., \`A --> B & C & D\`). Write a separate arrow statement for each connection.
- Chain actions sequentially for clean VERTICAL flow: \`Stage --> Action1 --> Action2 --> NextStage\`. Do NOT fan out multiple arrows from one node to parallel siblings — it causes horizontal spreading.
- For decisions: the Yes/main path continues straight down. The No/alternate path branches to the side and resolves.
- Show the complete flow: triggers, conditions, actions, transitions, AND fallback paths

NODE SHAPE GUIDE (use these consistently):
- \`([text])\` — Stadium/rounded shape for entry points, triggers, and endpoints
- \`[text]\` — Rectangle for standard actions (send email, add tag, notify team)
- \`{text}\` — Diamond for decisions (Yes/No branches)
- \`[(text)]\` — Cylinder for storage/database actions (save to CRM, log to sheet, update record)
- \`[[text]]\` — Double-border for subprocess references (Enter Nurture Sequence, Run Sub-Workflow)

LINK STYLE GUIDE:
- \`==>\` — Thick arrow for the primary/happy path (lead progresses forward through stages)
- \`-->\` — Standard arrow for normal automation flows (actions, decisions)
- \`-.->\` — Dotted arrow for optional or conditional paths (re-engagement, retry loops)

For PIPELINES — use top-down flowchart with stages, full automation branches, and complete No/fallback paths. NO subgraphs — use comments to organize:
\`\`\`mermaid
flowchart TD
  %% Entry
  START(["New Lead Enters"]):::trigger ==> A["New Lead"]:::stage
  A --> A1["Tag: source"]:::action
  A1 --> A2["Welcome Email"]:::action
  A2 --> A3["Notify Sales"]:::action

  %% Contacted Stage
  A3 ==> B["Contacted"]:::stage
  B --> B1["Log Call"]:::action
  B1 --> B2{"Responded?"}:::decision
  B3 ==>|Yes| C["Qualified"]:::stage
  B3 -->|No| B4["Wait 2 Days"]:::wait
  B4 --> B5["Follow-Up #1"]:::action
  B5 --> B6{"Reply?"}:::decision
  B6 -->|Yes| C
  B6 -->|No| B7["Wait 3 Days"]:::wait
  B7 --> B8["SMS Follow-Up"]:::action
  B8 --> B9{"Reply Now?"}:::decision
  B9 -->|Yes| C
  B9 -->|No| B10["Tag: unresponsive"]:::action
  B10 --> B11[[Cold Lead Pool]]:::subprocess

  %% Qualified Stage
  C --> C1["Assign Rep"]:::action
  C1 --> C2["Tag: qualified"]:::action
  C2 --> C3{"Budget OK?"}:::decision
  C4 ==>|Yes| D["Proposal Sent"]:::stage
  C4 -->|No| C5["Pricing Email"]:::action
  C5 --> C6["Wait 3 Days"]:::wait
  C6 --> C7{"Budget Now?"}:::decision
  C7 -->|Yes| D
  C7 -->|No| C8["Tag: budget"]:::action
  C8 -.-> LOST

  %% Proposal Stage
  D --> D1["Send Proposal"]:::action
  D1 --> D2["Wait 3 Days"]:::wait
  D3 --> D4{"Viewed?"}:::decision
  D4 -->|Yes| D5{"Accepted?"}:::decision
  D4 -->|No| D6["Reminder"]:::action
  D6 --> D7["Wait 2 Days"]:::wait
  D7 --> D8{"Viewed Now?"}:::decision
  D8 -->|Yes| D5
  D8 -->|No| D9["Call Follow-Up"]:::action
  D9 --> D10{"Reached?"}:::decision
  D10 -->|Yes| D5
  D10 -->|No| LOST
  D5 ==>|Yes| E["Won"]:::stage
  D5 -->|No| LOST["Lost"]:::stage

  %% Won - Onboarding
  E --> E1["Onboarding Seq"]:::action
  E1 --> E2["Stripe Invoice"]:::action
  E2 --> E3["Tag: customer"]:::action
  E3 --> E_END(["Active Client"]):::ok

  %% Lost - Recovery
  LOST --> F1["Tag: lost"]:::action
  F1 --> F2["Breakup Email"]:::action
  F2 --> F3["Wait 30 Days"]:::wait
  F3 --> F4[[Re-engage Campaign]]:::subprocess
  F4 --> F5["Re-engage Email"]:::action
  F5 --> F6{"Re-engaged?"}:::decision
  F6 -->|Yes| START
  F6 -->|No| F7["Dead Lead"]:::action
  F7 --> F_END(["Archived"]):::lost

  classDef trigger fill:#004AAC,stroke:#003380,color:#fff,stroke-width:2px
  classDef stage fill:#004AAC,stroke:#003380,color:#fff,font-weight:bold
  classDef action fill:#1f2937,stroke:#4b5563,color:#e5e7eb
  classDef decision fill:#7c3aed,stroke:#5b21b6,color:#fff
  classDef wait fill:#f59e0b,stroke:#d97706,color:#fff
  classDef subprocess fill:#374151,stroke:#6b7280,color:#e5e7eb,stroke-width:2px
  classDef ok fill:#059669,stroke:#047857,color:#fff
  classDef lost fill:#dc2626,stroke:#b91c1c,color:#fff
\`\`\`

For WORKFLOWS — show full automation chain with all No paths resolved. NO subgraphs:
\`\`\`mermaid
flowchart TD
  T(["Form Submitted"]):::trigger --> V{"Qualified?"}:::decision

  %% Qualified Path
  V ==>|Yes| A1["Tag: qualified"]:::action
  A1 --> A3["Welcome Email"]:::action
  A3 --> A4["Notify Team"]:::action
  A4 --> W1["Wait 2 Days"]:::wait
  W1 --> A5["Follow-Up"]:::action
  A5 --> W2["Wait 3 Days"]:::wait
  W2 --> D1{"Opened?"}:::decision
  D1 -->|Yes| A6["Booking Link"]:::action
  D1 -->|No| A7["SMS Reminder"]:::action
  A7 --> W5["Wait 2 Days"]:::wait
  W5 --> D3{"Opened Now?"}:::decision
  D3 -->|Yes| A6
  D3 -->|No| A8["Final Follow-Up"]:::action
  A8 --> A9["Tag: unresponsive"]:::action
  A9 --> A9b(["Unresponsive"]):::lost
  A6 --> W3["Wait 2 Days"]:::wait
  W3 --> D2{"Booked?"}:::decision
  D2 ==>|Yes| A10["Confirm Booking"]:::action
  D2 -->|No| A11["Limited Offer"]:::action
  A11 --> W6["Wait 3 Days"]:::wait
  W6 --> D4{"Booked Now?"}:::decision
  D4 -->|Yes| A10
  D4 -->|No| A12[[Nurture Sequence]]:::subprocess
  A10 --> BOOKED(["Booked"]):::ok

  %% Nurture Path
  V -->|No| A2["Tag: nurture"]:::action
  A2 --> N1[[Nurture Sequence]]:::subprocess
  N1 --> N2["Wait 3 Days"]:::wait
  N2 --> N3["Edu Content"]:::action
  N3 --> N4["Wait 5 Days"]:::wait
  N4 --> N5{"Engaged?"}:::decision
  N5 ==>|Yes| A1
  N5 -->|No| N6["Wait 7 Days"]:::wait
  N6 --> N7["Last Chance"]:::action
  N7 --> N8{"Engaged?"}:::decision
  N8 -->|Yes| A1
  N8 -->|No| N9["Mark Inactive"]:::action
  N9 --> N10["Remove Lists"]:::action
  N10 --> N_END(["Inactive"]):::lost

  classDef trigger fill:#004AAC,stroke:#003380,color:#fff,stroke-width:2px
  classDef action fill:#1f2937,stroke:#4b5563,color:#e5e7eb
  classDef decision fill:#7c3aed,stroke:#5b21b6,color:#fff
  classDef wait fill:#f59e0b,stroke:#d97706,color:#fff
  classDef subprocess fill:#374151,stroke:#6b7280,color:#e5e7eb,stroke-width:2px
  classDef ok fill:#059669,stroke:#047857,color:#fff
  classDef lost fill:#dc2626,stroke:#b91c1c,color:#fff
\`\`\`

For EMAIL SEQUENCES — show the full sequence with timing and channel escalation. NO subgraphs:
\`\`\`mermaid
flowchart TD
  START(["Enter Sequence"]):::trigger ==> A["Day 0: Welcome"]:::email
  A --> W1["Wait 1 Day"]:::wait
  W1 --> B["Day 1: Value"]:::email
  B --> W2["Wait 2 Days"]:::wait
  W2 --> C["Day 3: Proof"]:::email
  C --> W3["Wait 2 Days"]:::wait
  W3 --> D{"Opened Any?"}:::decision

  %% Engaged Path
  D ==>|Yes| E["Day 5: CTA"]:::email
  E --> W4["Wait 2 Days"]:::wait
  W4 --> G{"Clicked?"}:::decision
  G ==>|Yes| H["Day 7: Confirmed"]:::email
  H --> CONV(["Converted"]):::ok
  G -->|No| I["Day 7: Urgency"]:::email
  I --> W7["Wait 2 Days"]:::wait
  W7 --> I2{"Clicked?"}:::decision
  I2 -->|Yes| H
  I2 -->|No| I3["Day 9: Breakup"]:::email
  I3 --> I4["Remove"]:::action
  I4 --> I5[[Re-engage Pool]]:::subprocess

  %% Cold Path
  D -->|No| F["Day 5: Re-engage"]:::email
  F --> W5["Wait 1 Day"]:::wait
  W5 --> F2{"Opened?"}:::decision
  F2 -->|Yes| E
  F2 -->|No| F3["Day 6: SMS"]:::action
  F3 --> W6["Wait 1 Day"]:::wait
  W6 --> F4{"Response?"}:::decision
  F4 -->|Yes| E
  F4 -->|No| F5["Remove"]:::action
  F5 --> F6["Tag: cold"]:::action
  F6 --> COLD(["Cold Exit"]):::lost

  classDef trigger fill:#004AAC,stroke:#003380,color:#fff,stroke-width:2px
  classDef email fill:#004AAC,stroke:#003380,color:#fff
  classDef decision fill:#7c3aed,stroke:#5b21b6,color:#fff
  classDef wait fill:#f59e0b,stroke:#d97706,color:#fff
  classDef action fill:#6b7280,stroke:#4b5563,color:#fff
  classDef subprocess fill:#374151,stroke:#6b7280,color:#e5e7eb,stroke-width:2px
  classDef ok fill:#059669,stroke:#047857,color:#fff
  classDef lost fill:#dc2626,stroke:#b91c1c,color:#fff
\`\`\`

For TAG TAXONOMY — use left-to-right tree layout. Each arrow on its own line. NO subgraphs, NO \`&\` syntax:
\`\`\`mermaid
flowchart LR
  ROOT(["Tag System"]):::root
  ROOT --> SRC["source:"]:::cat
  ROOT --> STS["status:"]:::cat
  ROOT --> SVC["service:"]:::cat
  ROOT --> ENG["engaged:"]:::cat
  ROOT --> CMP["campaign:"]:::cat
  SRC --> S1["facebook"]:::tag
  SRC --> S2["google"]:::tag
  SRC --> S3["referral"]:::tag
  SRC --> S4["website"]:::tag
  STS --> ST1["hot-lead"]:::tag
  STS --> ST2["qualified"]:::tag
  STS --> ST3["customer"]:::tag
  STS --> ST4["inactive"]:::tag
  SVC --> SV1["seo"]:::tag
  SVC --> SV2["web-design"]:::tag
  SVC --> SV3["coaching"]:::tag
  ENG --> E1["opened"]:::tag
  ENG --> E2["clicked"]:::tag
  ENG --> E3["replied"]:::tag
  ENG --> E4["booked"]:::tag
  CMP --> C1["spring"]:::tag
  CMP --> C2["re-engage"]:::tag

  classDef root fill:#004AAC,stroke:#003380,color:#fff,font-weight:bold
  classDef cat fill:#8b5cf6,stroke:#6d28d9,color:#fff
  classDef tag fill:#1f2937,stroke:#4b5563,color:#e5e7eb
\`\`\`

For INTEGRATIONS / TROUBLESHOOTING — left-to-right data flow between systems. NO subgraphs:
\`\`\`mermaid
flowchart LR
  %% External Sources
  STRIPE(["Stripe"]):::ext -->|payment success| WH["Webhook"]:::action
  CAL(["Calendly"]):::ext -->|booking created| WH
  ZAP(["Zapier"]):::ext -->|trigger event| WH
  FORM(["Web Form"]):::ext -->|form submit| WH

  %% GHL Processing
  WH --> CONTACT[(Create Contact)]:::storage
  CONTACT --> TAG["Apply Tags"]:::action
  TAG --> PIPE["Move Stage"]:::action
  PIPE --> WF[[Run Workflow]]:::subprocess

  %% Outbound
  WF --> EMAIL["Send Email"]:::action
  EMAIL --> SMS["Send SMS"]:::action
  SMS --> NOTIFY["Notify Team"]:::action
  NOTIFY --> LOG[(Log to Sheet)]:::storage

  classDef ext fill:#004AAC,stroke:#003380,color:#fff,stroke-width:2px
  classDef action fill:#1f2937,stroke:#4b5563,color:#e5e7eb
  classDef storage fill:#374151,stroke:#6b7280,color:#e5e7eb,stroke-width:2px
  classDef subprocess fill:#374151,stroke:#6b7280,color:#e5e7eb,stroke-width:2px
\`\`\`

IMPORTANT: Tailor every diagram to the user's niche and specific question. A good pipeline diagram should have 20-50 nodes — never fewer than 20. EVERY decision diamond MUST have both a Yes path AND a No path fully resolved. The No path should show what happens next: retry attempts with wait steps, escalation, alternative channels (email then SMS then call), and the eventual fallback outcome (mark inactive, move to re-engagement, dead lead, etc.). Never leave a dead end — every path must reach a resolution. Pipeline stages ALWAYS use a single blue color (#004AAC) via one classDef stage class.

NODE LABEL RULES:
- Max 3-4 words per node label. Shorter is always better.
- Abbreviate: "Tag: qualified" not "Add Tag: status:qualified", "Follow-Up #1" not "Send First Follow-Up Email"
- Stage labels: just the stage name like "Contacted" or "Proposal Sent" — no "Stage:" prefix needed
- Decision labels: short questions like "Responded?", "Budget OK?", "Clicked?"

ENDPOINT SHAPES:
- Use \`([text])\` stadium shapes for entry points (triggers) and exit points (outcomes)
- Color endpoints: green (#059669) for success/conversion outcomes, red (#dc2626) for lost/inactive exits
- Use \`[[text]]\` double-border shapes when referencing sub-workflows or sequences that expand elsewhere

## STRICT RULES
- Be specific and actionable — never give vague advice
- Reference GHL UI elements by name (e.g., "Opportunities tab", "Workflow Builder", "Smart Lists")
- If you're unsure about a specific GHL feature or recent update, say so honestly
- Keep each section concise — no filler text
- Use bullet points and numbered lists for clarity. Use indented sub-bullets (two spaces + dash) for nested details under a parent bullet point.
- Include relevant tag naming examples using the user's niche
- When discussing pipelines, always specify stage names tailored to their business
- IMPORTANT: GHL custom values and custom fields always use DOUBLE curly braces: {{contact.first_name}}, {{contact.email}}, {{opportunity.name}}, etc. Never use single curly braces for GHL merge fields.`;

// ============================================
// TIPS DATA
// ============================================
const TIPS = [
  { title: 'Be specific with your question', body: 'Instead of "How do I set up workflows?" try "How do I create a follow-up sequence for new leads from Facebook ads in my dental clinic pipeline?"' },
  { title: 'Upload a screenshot for better advice', body: 'Stuck on a specific screen? Upload a screenshot of your GHL dashboard, workflow builder, or error message — the AI will reference what it sees.' },
  { title: 'Mention your integrations', body: 'If you use Stripe, Calendly, Zapier, or other tools with GHL, mention them in your question for integration-specific guidance.' },
  { title: 'Start simple, then iterate', body: 'For complex setups, ask about one piece at a time. Get the pipeline right first, then workflows, then tags.' },
];

// ============================================
// PARSE RESPONSE INTO SECTIONS
// ============================================
const parseResponse = (text) => {
  const sections = [];
  const regex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();
    if (content) sections.push({ title, content });
  }
  if (sections.length === 0 && text.trim()) {
    sections.push({ title: 'Answer', content: text.trim() });
  }
  return sections;
};

// ============================================
// RESIZE IMAGE (prevent large payloads)
// ============================================
const resizeImage = (file, maxWidth) =>
  new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width <= maxWidth) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
        return;
      }
      const scale = maxWidth / img.width;
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL(file.type || 'image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    };
    img.src = url;
  });

// ============================================
// COPY BUTTON COMPONENT
// ============================================
const CopyButton = ({ text, isDark, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(isDark);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: copied ? (isDark ? '#0a2618' : '#ecfdf5') : 'transparent', border: `1px solid ${copied ? (isDark ? '#166534' : '#86efac') : theme.cardBorder}`, borderRadius: '8px', color: copied ? BRAND.green : theme.textMuted, fontSize: '15px', fontFamily: FONTS.body, cursor: 'pointer', transition: 'all 0.15s ease' }}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

// ============================================
// SAVE SVG AS PNG UTILITY
// ============================================
const saveSvgAsPng = (svgHtml, filename = 'diagram.png') => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = svgHtml;
  const svgEl = wrapper.querySelector('svg');
  if (!svgEl) return;
  const bbox = svgEl.getBBox ? svgEl.getBBox() : null;
  const w = parseFloat(svgEl.getAttribute('width')) || bbox?.width || 1200;
  const h = parseFloat(svgEl.getAttribute('height')) || bbox?.height || 800;
  const scaleFactor = 2;
  const canvas = document.createElement('canvas');
  canvas.width = w * scaleFactor;
  canvas.height = h * scaleFactor;
  const ctx = canvas.getContext('2d');
  ctx.scale(scaleFactor, scaleFactor);
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new window.Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = filename;
    a.click();
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
};

// ============================================
// MERMAID DIAGRAM COMPONENT (interactive whiteboard)
// ============================================
const MermaidDiagram = ({ code, isDark }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const theme = getTheme(isDark);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        setLoading(true);
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: isDark ? {
            primaryColor: BRAND.blue, primaryTextColor: '#fff', primaryBorderColor: BRAND.blue,
            secondaryColor: '#8b5cf6', tertiaryColor: BRAND.green, lineColor: '#4b5563',
            textColor: '#f3f4f6', mainBkg: '#1f2937', nodeBorder: '#4b5563',
            clusterBkg: 'transparent', clusterBorder: '#374151',
          } : {
            primaryColor: BRAND.blue, primaryTextColor: '#fff', primaryBorderColor: BRAND.blue,
            secondaryColor: '#8b5cf6', tertiaryColor: BRAND.green, lineColor: '#9ca3af',
            textColor: BRAND.brown, mainBkg: '#f3f4f6', nodeBorder: '#d1d5db',
            clusterBkg: 'transparent', clusterBorder: '#d1d5db',
          },
          securityLevel: 'loose',
          fontFamily: FONTS.body,
          flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis', padding: 18, wrappingWidth: 280, nodeSpacing: 40, rankSpacing: 50 },
        });
        await mermaid.parse(code);
        const { svg: rendered } = await mermaid.render(`ghl-diagram-${Date.now()}`, code);
        if (!cancelled) { setSvg(rendered); setError(''); setScale(1); setPosition({ x: 0, y: 0 }); }
      } catch (err) {
        if (!cancelled) { setError(err.message || 'Failed to render diagram'); setSvg(''); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    render();
    return () => { cancelled = true; };
  }, [code, isDark]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setScale((p) => Math.min(Math.max(p + (e.deltaY > 0 ? -0.1 : 0.1), 0.2), 4));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
  }, [position]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setPosition({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  const zoomIn = () => setScale((p) => Math.min(p + 0.25, 4));
  const zoomOut = () => setScale((p) => Math.max(p - 0.25, 0.2));
  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  // Attach non-passive wheel listener for preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <SpinnerGap size={24} style={{ color: theme.textMuted, animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '15px', color: theme.textMuted, fontFamily: FONTS.body, margin: '8px 0 0' }}>Rendering diagram...</p>
      </div>
    );
  }

  if (error || !svg) return null;

  const btnStyle = {
    width: '32px', height: '32px', borderRadius: '8px',
    border: `1px solid ${theme.cardBorder}`,
    backgroundColor: theme.cardBg, color: theme.textMuted,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease', fontSize: '12px',
  };

  const gridDot = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const gridBg = `radial-gradient(circle, ${gridDot} 1px, transparent 1px)`;

  return (
    <div style={{ position: 'relative' }}>
      {/* Zoom controls */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        display: 'flex', gap: '4px', alignItems: 'center',
        backgroundColor: isDark ? 'rgba(13,11,9,0.85)' : 'rgba(250,248,245,0.85)',
        backdropFilter: 'blur(8px)',
        padding: '4px', borderRadius: '10px',
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <button onClick={zoomIn} style={btnStyle} aria-label="Zoom in" title="Zoom in">
          <MagnifyingGlassPlus size={16} />
        </button>
        <span style={{ fontSize: '12px', color: theme.textMuted, fontFamily: FONTS.body, padding: '2px 6px', minWidth: '40px', textAlign: 'center' }}>
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomOut} style={btnStyle} aria-label="Zoom out" title="Zoom out">
          <MagnifyingGlassMinus size={16} />
        </button>
        <button onClick={resetView} style={btnStyle} aria-label="Reset view" title="Reset view">
          <ArrowsOutCardinal size={16} />
        </button>
        <button onClick={() => saveSvgAsPng(svg, 'ghl-diagram.png')} style={btnStyle} aria-label="Save as image" title="Save as PNG">
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Canvas with dot grid */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          height: '700px',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          backgroundColor: isDark ? '#0d0b09' : '#fdfcfa',
          backgroundImage: gridBg,
          backgroundSize: '20px 20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease',
            padding: '20px',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Hint */}
      <div style={{ padding: '8px 18px', borderTop: `1px solid ${theme.cardBorder}`, display: 'flex', justifyContent: 'center', backgroundColor: isDark ? '#0d0b09' : '#fdfcfa' }}>
        <span style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, opacity: 0.5 }}>
          Scroll to zoom &middot; Drag to pan
        </span>
      </div>
    </div>
  );
};

// ============================================
// EXTRACT MERMAID CODE FROM CONTENT
// ============================================
const extractMermaid = (content) => {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/;
  const match = content.match(mermaidRegex);
  if (!match) return { text: content, mermaidCode: null };
  const mermaidCode = match[1].trim();
  const text = content.replace(mermaidRegex, '').trim();
  return { text, mermaidCode };
};

// ============================================
// SECTION CARD COMPONENT
// ============================================
const SectionCard = ({ section, index, isDark }) => {
  const theme = getTheme(isDark);
  const config = SECTION_CONFIG[section.title] || { icon: Lightning, color: BRAND.blue };
  const IconComponent = config.icon;

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: theme.text, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ backgroundColor: isDark ? '#1e1a16' : '#f0ebe4', padding: '2px 6px', borderRadius: '4px', fontSize: '15px', fontFamily: "'Fira Code', monospace", color: isDark ? '#e8c47a' : '#a0522d' }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Detect indentation level for sub-bullets (2 spaces = 1 level, 4 = 2, etc.)
      const leadingSpaces = line.match(/^(\s*)/)[1].length;
      const indentLevel = Math.floor(leadingSpaces / 2);
      const paddingLeft = indentLevel > 0 ? `${4 + indentLevel * 20}px` : '4px';

      if (/^[-•]\s/.test(trimmed)) {
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', paddingLeft }}>
            <span style={{ color: indentLevel > 0 ? theme.textMuted : config.color, fontWeight: 700, fontSize: indentLevel > 0 ? '15px' : '17px', lineHeight: '1.6' }}>{indentLevel > 0 ? '◦' : '•'}</span>
            <span style={{ color: theme.text, fontSize: '16px', lineHeight: '1.6', fontFamily: FONTS.body }}>{renderInline(trimmed.replace(/^[-•]\s/, ''))}</span>
          </div>
        );
      }
      if (/^\d+[.)]\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)[.)]\s/)[1];
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', paddingLeft }}>
            <span style={{ color: config.color, fontWeight: 700, fontSize: '16px', lineHeight: '1.6', minWidth: '22px' }}>{num}.</span>
            <span style={{ color: theme.text, fontSize: '16px', lineHeight: '1.6', fontFamily: FONTS.body }}>{renderInline(trimmed.replace(/^\d+[.)]\s/, ''))}</span>
          </div>
        );
      }
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
        const checked = trimmed.startsWith('- [x]');
        return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', paddingLeft }}>
            <span style={{ color: checked ? BRAND.green : theme.textMuted, fontSize: '17px' }}>{checked ? '☑' : '☐'}</span>
            <span style={{ color: theme.text, fontSize: '16px', lineHeight: '1.6', fontFamily: FONTS.body }}>{renderInline(trimmed.replace(/^- \[.\]\s?/, ''))}</span>
          </div>
        );
      }
      return <p key={i} style={{ color: theme.text, fontSize: '16px', lineHeight: '1.7', marginBottom: '8px', fontFamily: FONTS.body }}>{renderInline(trimmed)}</p>;
    });
  };

  const { text: textContent, mermaidCode } = extractMermaid(section.content);
  const isDiagramSection = section.title === 'Process Diagram' && mermaidCode && textContent;

  return (
    <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '14px', overflow: 'hidden', animation: `fadeInUp 0.4s ease ${index * 0.1}s both` }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${config.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={18} weight="bold" style={{ color: config.color }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: theme.text, fontFamily: FONTS.heading }}>{section.title}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {mermaidCode && <CopyButton text={mermaidCode} isDark={isDark} label="Code" />}
          <CopyButton text={section.content} isDark={isDark} />
        </div>
      </div>

      {isDiagramSection ? (
        /* Process Diagram: side-by-side layout — description left, diagram right */
        <>
          <style>{`
            .ghl-diagram-split { display: grid; grid-template-columns: 320px 1fr; }
            @media (max-width: 900px) { .ghl-diagram-split { grid-template-columns: 1fr; } }
          `}</style>
          <div className="ghl-diagram-split">
            <div style={{
              padding: '20px 22px',
              borderRight: `1px solid ${theme.cardBorder}`,
              backgroundColor: isDark ? '#13110e' : '#fdfcfa',
              overflowY: 'auto',
              maxHeight: '780px',
            }}>
              <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: config.color, fontFamily: FONTS.heading }}>Diagram Notes</span>
              </div>
              {renderContent(textContent)}
            </div>
            <div>
              <MermaidDiagram code={mermaidCode} isDark={isDark} />
            </div>
          </div>
        </>
      ) : (
        /* Standard layout: text above, diagram below */
        <>
          {textContent && (
            <div style={{ padding: '16px 18px' }}>
              {renderContent(textContent)}
            </div>
          )}
          {mermaidCode && (
            <div style={{ borderTop: textContent ? `1px solid ${theme.cardBorder}` : 'none' }}>
              <MermaidDiagram code={mermaidCode} isDark={isDark} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const GHLAdvisor = ({ isDark }) => {
  const theme = getTheme(isDark);

  // Form state
  const [niche, setNiche] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [category, setCategory] = useState('general');
  const [question, setQuestion] = useState('');

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Output state
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [rawResponse, setRawResponse] = useState('');
  const [error, setError] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const resultsRef = useRef(null);
  const fileInputRef = useRef(null);

  // ============================================
  // COOLDOWN TIMER
  // ============================================
  useEffect(() => {
    const check = () => {
      const endTime = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
      const remaining = Math.max(0, endTime - Date.now());
      setCooldownRemaining(remaining);
      return remaining;
    };
    check();
    const interval = setInterval(() => {
      if (check() <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [sections]);

  // ============================================
  // IMAGE HANDLING
  // ============================================
  const handleImageSelect = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WebP).');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be under 4MB.');
      return;
    }
    setError('');
    const base64 = await resizeImage(file, MAX_IMAGE_WIDTH);
    setImageFile(file);
    setImageBase64(base64);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleImageRemove = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImageBase64(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [imagePreview]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  // ============================================
  // GENERATE RESPONSE
  // ============================================
  const handleGenerate = async () => {
    if (!niche.trim() || !question.trim()) return;
    if (cooldownRemaining > 0) return;

    setLoading(true);
    setError('');
    setSections([]);
    setRawResponse('');

    const categoryLabel = QUESTION_CATEGORIES.find(c => c.value === category)?.label || 'General';
    const userMessageText = [
      `NICHE/BUSINESS TYPE: ${niche.trim()}`,
      `EXPERIENCE LEVEL: ${experienceLevel}`,
      `QUESTION CATEGORY: ${categoryLabel}`,
      `\nQUESTION:\n${question.trim()}`,
      imageBase64 ? '\n[A screenshot has been attached. Please analyze the screenshot and reference specific visual elements you see in your response.]' : '',
    ].filter(Boolean).join('\n');

    const useVision = !!imageBase64;
    const model = useVision ? OPENAI_CONFIG.visionModel : OPENAI_CONFIG.textModel;

    const userContent = useVision
      ? [
          { type: 'text', text: userMessageText },
          { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } },
        ]
      : userMessageText;

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ];

    try {
      let responseText;

      if (OPENAI_CONFIG.edgeFunctionUrl) {
        const res = await fetch(OPENAI_CONFIG.edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ type: 'chat', messages: chatMessages, model, temperature: 0.7, max_tokens: 3000 }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `API error: ${res.status}`);
        }
        const data = await res.json();
        responseText = data.content;
      } else if (OPENAI_CONFIG.apiKey) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
          },
          body: JSON.stringify({ model, messages: chatMessages, temperature: 0.7, max_tokens: 3000 }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `API error: ${res.status}`);
        }
        const data = await res.json();
        responseText = data.choices?.[0]?.message?.content || '';
      } else {
        throw new Error('API_NOT_CONFIGURED');
      }

      if (!responseText) throw new Error('No response received.');

      const parsed = parseResponse(responseText);
      setSections(parsed);
      setRawResponse(responseText);

      localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
      setCooldownRemaining(COOLDOWN_MS);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      if (err.message === 'API_NOT_CONFIGURED') {
        setError('AI features are not configured. Please contact support.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSections([]);
    setRawResponse('');
    setError('');
    setQuestion('');
    handleImageRemove();
  };

  const canGenerate = niche.trim().length > 0 && question.trim().length > 0 && !loading && cooldownRemaining <= 0;
  const cooldownSec = Math.ceil(cooldownRemaining / 1000);
  const cooldownDisplay = cooldownSec > 0 ? `${Math.floor(cooldownSec / 60)}:${String(cooldownSec % 60).padStart(2, '0')}` : '';

  // ============================================
  // RENDER
  // ============================================

  // Shared input style
  const inputBase = {
    width: '100%', boxSizing: 'border-box', backgroundColor: theme.inputBg,
    border: `1px solid ${theme.inputBorder}`, borderRadius: '10px',
    fontSize: '16px', color: theme.text, fontFamily: FONTS.body,
    outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };
  const focusRing = (e) => { e.target.style.borderColor = BRAND.blue; e.target.style.boxShadow = `0 0 0 3px ${BRAND.blue}15`; };
  const blurRing = (e) => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; };

  return (
    <>
      <SEO
        title="AI GHL Advisor | Free GoHighLevel CRM Expert"
        description="Get expert GoHighLevel CRM advice powered by AI. Pipeline design, workflow automation, tag strategy, integrations, and troubleshooting — with optional screenshot analysis."
      />
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .ghl-pill:hover { filter: brightness(1.08); }
        @media (max-width: 768px) {
          .ghl-form-top { grid-template-columns: 1fr !important; }
          .ghl-form-bottom { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 48px' }}>

        {/* ─── HEADER (centered) ─── */}
        <div style={{ textAlign: 'center', marginBottom: '28px', animation: 'fadeInUp 0.4s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blue}cc)`, marginBottom: '14px', boxShadow: `0 4px 16px ${BRAND.blue}30` }}>
            <ChatCircle size={28} weight="fill" style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: theme.text, fontFamily: FONTS.heading, margin: '0 0 6px', letterSpacing: '-0.3px' }}>AI GHL Advisor</h1>
          <p style={{ fontSize: '17px', color: theme.textMuted, fontFamily: FONTS.body, margin: 0 }}>
            Expert GoHighLevel CRM advice — with optional screenshot analysis
          </p>
        </div>

        {/* ─── FORM CARD ─── */}
        <div style={{
          backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
          borderRadius: '16px', padding: '28px', marginBottom: '24px',
          animation: 'fadeInUp 0.4s ease 0.05s both',
          boxShadow: isDark ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 20px rgba(63,32,12,0.06)',
        }}>

          {/* Top row: Niche (left) + Experience (right) — 2-column */}
          <div className="ghl-form-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: theme.textMuted, marginBottom: '8px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Niche / Business Type <span style={{ color: BRAND.blue }}>*</span>
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Dental clinic, Real estate"
                maxLength={100}
                style={{ ...inputBase, height: '48px', padding: '0 16px' }}
                onFocus={focusRing}
                onBlur={blurRing}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: theme.textMuted, marginBottom: '8px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Experience Level
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const active = experienceLevel === lvl.value;
                  return (
                    <button
                      key={lvl.value}
                      className="ghl-pill"
                      onClick={() => setExperienceLevel(lvl.value)}
                      title={lvl.desc}
                      style={{
                        padding: '10px 20px', borderRadius: '20px',
                        border: active ? `2px solid ${BRAND.blue}` : `1px solid ${theme.cardBorder}`,
                        backgroundColor: active ? `${BRAND.blue}14` : 'transparent',
                        color: active ? BRAND.blue : theme.textMuted,
                        fontSize: '15px', fontWeight: active ? 700 : 500,
                        fontFamily: FONTS.body, cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category — full width */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: theme.textMuted, marginBottom: '8px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {QUESTION_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    className="ghl-pill"
                    onClick={() => setCategory(cat.value)}
                    style={{
                      padding: '10px 18px', borderRadius: '20px',
                      border: isActive ? `2px solid ${cat.color}` : `1px solid ${theme.cardBorder}`,
                      backgroundColor: isActive ? `${cat.color}14` : 'transparent',
                      color: isActive ? cat.color : theme.textMuted,
                      fontSize: '15px', fontWeight: isActive ? 700 : 500,
                      fontFamily: FONTS.body, cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <CatIcon size={16} weight={isActive ? 'bold' : 'regular'} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtle divider */}
          <div style={{ height: '1px', background: theme.cardBorder, margin: '0 -28px 20px', opacity: 0.6 }} />

          {/* Bottom row: Question (left) + Upload (right) — 2-column */}
          <div className="ghl-form-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: theme.textMuted, marginBottom: '8px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your Question <span style={{ color: BRAND.blue }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe your GHL question or problem in detail. The more specific, the better the advice."
                  maxLength={2000}
                  rows={5}
                  style={{ ...inputBase, padding: '14px 16px', resize: 'vertical', minHeight: '130px', lineHeight: '1.6' }}
                  onFocus={focusRing}
                  onBlur={blurRing}
                />
                <span style={{ position: 'absolute', bottom: '10px', right: '14px', fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, opacity: 0.5 }}>
                  {question.length}/2000
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: theme.textMuted, marginBottom: '8px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Screenshot <span style={{ fontSize: '12px', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files?.[0])}
                style={{ display: 'none' }}
              />
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  style={{
                    border: `1.5px dashed ${dragOver ? BRAND.blue : theme.inputBorder}`,
                    borderRadius: '10px', padding: '24px 16px', cursor: 'pointer',
                    backgroundColor: dragOver ? `${BRAND.blue}08` : theme.inputBg,
                    transition: 'all 0.2s ease',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    minHeight: '130px', textAlign: 'center',
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: isDark ? '#1e1a16' : '#f0ebe4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <UploadSimple size={22} style={{ color: dragOver ? BRAND.blue : theme.textMuted }} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: dragOver ? BRAND.blue : theme.text, fontFamily: FONTS.body, margin: 0 }}>
                    Click or drag to upload
                  </p>
                  <p style={{ fontSize: '13px', color: theme.textMuted, fontFamily: FONTS.body, margin: '4px 0 0', opacity: 0.7 }}>
                    PNG, JPG, WebP up to 4 MB
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', backgroundColor: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Uploaded screenshot"
                    style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${theme.cardBorder}` }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: theme.text, fontFamily: FONTS.body, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {imageFile?.name}
                    </p>
                    <p style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body, margin: '2px 0 0' }}>
                      {(imageFile?.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    onClick={handleImageRemove}
                    aria-label="Remove screenshot"
                    style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${theme.cardBorder}`, backgroundColor: 'transparent', color: theme.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── GENERATE BUTTON ─── */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          style={{
            width: '100%', height: '54px',
            background: canGenerate ? `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blue}dd)` : theme.cardBorder,
            color: canGenerate ? '#fff' : theme.textMuted,
            border: 'none', borderRadius: '12px',
            fontSize: '17px', fontWeight: 700, fontFamily: FONTS.body,
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: canGenerate ? `0 4px 20px ${BRAND.blue}35` : 'none',
            marginBottom: '20px',
            animation: 'fadeInUp 0.4s ease 0.1s both',
            letterSpacing: '0.2px',
          }}
        >
          {loading ? (
            <><SpinnerGap size={20} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
          ) : cooldownRemaining > 0 ? (
            <><ArrowClockwise size={20} /> Try again in {cooldownDisplay}</>
          ) : (
            <><ChatCircle size={20} weight="bold" /> Get Expert Advice</>
          )}
        </button>

        {/* ─── ERROR ─── */}
        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: theme.errorBg, border: `1px solid ${theme.errorBorder}`, borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeInUp 0.3s ease' }}>
            <WarningCircle size={20} weight="bold" style={{ color: theme.errorText, flexShrink: 0 }} />
            <p style={{ fontSize: '16px', color: theme.errorText, fontFamily: FONTS.body, margin: 0, lineHeight: '1.5' }}>{error}</p>
          </div>
        )}

        {/* ─── LOADING SKELETON ─── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '14px', overflow: 'hidden', animation: `fadeInUp 0.3s ease ${i * 0.08}s both` }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(90deg, ${theme.inputBg} 25%, ${theme.cardBorder} 50%, ${theme.inputBg} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
                  <div style={{ width: `${80 + i * 20}px`, height: '14px', borderRadius: '6px', background: `linear-gradient(90deg, ${theme.inputBg} 25%, ${theme.cardBorder} 50%, ${theme.inputBg} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite' }} />
                </div>
                <div style={{ padding: '14px 18px' }}>
                  {[1, 2].map((j) => (
                    <div key={j} style={{ height: '11px', borderRadius: '4px', background: `linear-gradient(90deg, ${theme.inputBg} 25%, ${theme.cardBorder} 50%, ${theme.inputBg} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease infinite', marginBottom: '10px', width: `${95 - j * 20}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {sections.length > 0 && (
          <div ref={resultsRef} style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: theme.text, fontFamily: FONTS.heading, margin: 0, letterSpacing: '-0.2px' }}>Expert Advice</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CopyButton text={rawResponse} isDark={isDark} label="Copy All" />
                <button
                  onClick={handleReset}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', color: theme.textMuted, fontSize: '15px', fontFamily: FONTS.body, cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  <ArrowClockwise size={16} /> New Question
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {sections.map((section, index) => (
                <SectionCard key={index} section={section} index={index} isDark={isDark} />
              ))}
            </div>
          </div>
        )}

        {/* ─── EMPTY STATE ─── */}
        {!loading && sections.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '20px', animation: 'fadeInUp 0.4s ease 0.15s both' }}>
            <Buildings size={36} weight="duotone" style={{ color: theme.textMuted, opacity: 0.25, marginBottom: '8px' }} />
            <p style={{ fontSize: '16px', color: theme.textMuted, fontFamily: FONTS.body, margin: 0, opacity: 0.5 }}>
              Your expert advice will appear here
            </p>
          </div>
        )}

        {/* ─── TIPS ─── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px',
          animation: 'fadeInUp 0.4s ease 0.2s both',
        }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{
              padding: '12px 14px',
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px',
              display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <Lightbulb size={18} weight="duotone" style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: theme.text, fontFamily: FONTS.body, margin: '0 0 3px' }}>{tip.title}</p>
                <p style={{ fontSize: '14px', color: theme.textMuted, fontFamily: FONTS.body, margin: 0, lineHeight: '1.5' }}>{tip.body.split('. ')[0]}.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GHLAdvisor;
