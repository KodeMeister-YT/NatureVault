The CivicShield Pipeline
Stage	What happens
📄 Document	PDF, DOCX or TXT
🔍 Extraction	Text and structure are extracted
🧩 Clauses	Important sections are identified
⚖️ Legal Analysis	Potential issues are detected
📚 Evidence	Relevant legal sources are retrieved
📊 Risk	Severity and confidence are calculated
✅ Action	Concrete next steps are generated
🧭 Product Flow
🛡️ Three CivicShield Verticals
🏠 TenantShield

Rental agreements, landlord notices, deposits, termination clauses and housing-related documents.

💼 WorkShield

Employment contracts, termination notices, notice periods and restrictive clauses.

🛍️ ConsumerShield

Purchase agreements, warranty terms, refunds, final-sale clauses and consumer disputes.

🔎 Show Me Why

CivicShield doesn't simply say:

"This clause may be a problem."

It traces the finding back to its evidence.

Every finding can expose:

Original clause
Section / page
Detected issue
Matched legal source
Reasoning
Fact vs inference
Confidence level

This creates an auditable evidence trail rather than an unexplained AI answer.

📊 Risk & Evidence

CivicShield categorizes findings into four levels:

Demo distribution shown above is from the sample TenantShield analysis.

📄 Document Intelligence

CivicShield uses a split-screen interface to connect findings directly to their source.

Clicking a finding highlights the corresponding clause in the original document.

⚡ Action Plans

Instead of stopping at:

"This may be concerning."

CivicShield turns findings into concrete steps.

Each action can be checked, sourced, and saved for later.

🔮 Scenario Simulator
What happens if...?

Users can explore hypothetical scenarios based on their document.

The simulator distinguishes known facts, possible outcomes, and uncertainty rather than presenting predictions as certainty.

✉️ Response Generator

CivicShield can transform a finding into an editable professional response.

The user remains in control of the final response.

🗄️ Evidence Vault

Important findings, responses and notes can be saved locally.

No backend database is required for the MVP.

🏗️ Architecture
🧠 Why the Architecture Is Different

The current hackathon implementation deliberately uses a deterministic rule-based legal analysis engine rather than a live LLM call.

This gives CivicShield:

Predictable results
No hallucinated citations
No API dependency
Instant Demo Mode
Reproducible analysis
Structured outputs

The architecture is still designed so an LLM-assisted analysis layer can be introduced later without replacing downstream components.

🛠️ Tech Stack
Layer	Technology
Framework	Next.js 16
UI	React 19
Language	TypeScript
Styling	Tailwind CSS v4
Validation	Zod
PDF Parsing	pdf-parse
DOCX Parsing	Mammoth
Icons	Lucide React
Storage	sessionStorage / localStorage
Legal Retrieval	Custom RAG provider
Analysis	Deterministic rule engine
🔐 Privacy & Safety

CivicShield is designed around a simple principle:

Legal AI should explain its reasoning instead of pretending to be certain.

The system:

Does not persist uploaded documents on a backend
Validates files before processing
Separates facts from inference
Shows confidence levels
Requires legal-source grounding
Avoids fabricated citations
Clearly communicates uncertainty
Frames itself as informational guidance, not legal representation
🧪 Demo Mode

Want to try CivicShield without uploading anything?

Visit:

/demo

Demo Mode contains three fictional documents:

TenantShield · WorkShield · ConsumerShield

All three use the same analysis pipeline as uploaded documents and are precomputed for a reliable live demonstration.

📸 Screenshots
Landing Page

Document Upload

Demo Mode

Analysis Dashboard

Scenario Simulator

Response Generator

Action Plan

⚙️ Getting Started
git clone https://github.com/KodeMeister-YT/CivicShield.git
cd CivicShield
npm install
npm run dev

Open:

http://localhost:3000
Useful routes
/             → Landing page
/demo         → Instant demo
/analyze      → Upload a document
/vault        → Evidence Vault
Production
npm run build
npm run lint
⚠️ Known Limitations
Clause detection is rule-based rather than LLM-powered.
Current legal sources are federal-level and illustrative.
State and local jurisdiction differences are not fully modeled.
Scanned/image-only PDFs are not OCR'd.
No authentication or multi-user persistence.
Evidence Vault is browser-local.
🔮 What's Next?

Future versions could introduce:

LLM-assisted clause interpretation
OCR for scanned documents
State/local jurisdiction awareness
Live legal databases
Embedding-based retrieval
Multi-document case analysis
Secure accounts and encrypted evidence storage
Broader civic workflows
🏆 Built for LexHack 2026

CivicShield

Know what they can do. Know what you can do.

Built to make legal information easier to understand, verify, and act on.

⚖️ Disclaimer

CivicShield provides informational guidance and does not provide legal representation or create an attorney-client relationship. Always consult a qualified legal professional for advice about your specific situation.
