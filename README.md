🌿 NatureVault
Step inside nature. Travel through time. See what changes.
NatureVault is an interactive environmental time machine that lets users explore ecosystems in 3D, travel through different points in time, discover environmental features and species, and compare possible future scenarios.

Instead of only presenting environmental change through statistics, NatureVault lets users experience the ecosystem itself.

We don't want you to just read about what we're losing. We want you to step inside it.

🌎 The Idea
Environmental change is often reduced to numbers and charts. While useful, these can be difficult to visualize or connect with.

NatureVault transforms environmental information into an interactive place.

Past → Present → Future
Users can:

🌲 Explore different ecosystems
🕰️ Travel through time
🔍 Interact with environmental objects
🐦 Discover represented species
📊 View ecosystem health indicators
🔀 Compare possible future scenarios
🧠 Track their exploration in My Vault
📚 Browse an environmental archive
⚙️ How It Works
The core experience connects ecosystem data, application state, and a 3D environment.


The selected year acts as a central control. Changing it updates the represented ecosystem state, allowing users to observe how vegetation, water, biodiversity, habitat and other elements change over time.

🕰️ The Time Machine
The timeline allows users to move between historical conditions, the present, and possible future scenarios.

For example:

1980 → 1995 → 2010 → 2026 → 2050
As the selected year changes, the ecosystem representation responds accordingly.

Note: Future scenarios are illustrative simulations and are not intended to be scientific forecasts.

🎮 User Journey
The experience is built around four simple actions:


🌲 Interactive 3D Ecosystems
The 3D Vault is the core of NatureVault.

Users can enter an ecosystem and explore it directly rather than viewing it as a static image.

The environment can contain:

🌳 Vegetation
💧 Water systems
🐦 Wildlife
🪨 Terrain
🌿 Habitats
🏠 Human infrastructure
🌊 Environmental features
The 3D environment acts as both a visual simulation and an interactive learning interface.

🔍 Object Discovery
Environmental objects can be selected to reveal contextual information.

This allows users to move from:

"What is this?"

to

"Why does this matter?"

📊 Ecosystem Health
NatureVault provides an illustrative ecosystem-health interface based on several environmental dimensions.

These dimensions provide users with a simplified way to understand the overall condition of an ecosystem.

Note: These indicators are educational simulation values, not scientific assessments.

🔀 Future Scenario Comparison
NatureVault allows users to compare possible future scenarios, such as:

Continue As Is vs Protect & Restore

The goal is not to predict exactly what will happen.

Instead, the simulation demonstrates:

Different choices can lead to different possible futures.

🧠 My Vault
My Vault acts as the user's personal environmental memory.

Exploration can contribute to:

Ecosystems explored
Species discovered
Observations
Exploration history
Environmental learning
Actions learned
This turns NatureVault from a simple information website into a progressive exploration experience.

📚 Ecosystem Data Flow
The ecosystem data acts as the foundation for multiple parts of the application.


This allows different parts of the application to respond to the same underlying ecosystem information.

🧩 Application Structure
NatureVault follows a component-based React architecture.

App
│
├── Navigation
│
├── Landing
│
├── Discover
│   ├── Search
│   ├── Filters
│   └── Ecosystem Cards
│
├── Archive
│   └── Ecosystem Information
│
├── My Vault
│   ├── Exploration History
│   ├── Discovery Stats
│   └── Learning Progress
│
├── Impact
│   ├── Ecosystem Statistics
│   └── Suggested Actions
│
└── Ecosystem Vault
    ├── Time Machine
    ├── 3D Environment
    ├── Object Interaction
    ├── Information Panels
    ├── Biodiversity
    ├── Story Mode
    └── Scenario Comparison
🌐 Overall Architecture

🤖 AI-Assisted Development
NatureVault was developed using an AI-assisted development workflow.

Kiro IDE
Kiro IDE was used as the primary development environment for building and iterating on the project.

Claude Sonnet 5
Claude Sonnet 5 was used throughout development as an AI development assistant.

AI assistance was used for:

React and TypeScript implementation
UI/UX development
Component creation
Interaction logic
3D environment development
Debugging
Feature iteration
Code refinement
Design experimentation
The generated implementations were continuously tested, modified and refined throughout development.

🛠️ Tech Stack
Technology	Purpose
React	Frontend application
TypeScript	Type-safe development
Vite	Development and build tooling
HTML / CSS	UI structure and styling
3D Rendering	Interactive ecosystem environments
Kiro IDE	Primary development environment
Claude Sonnet 5	AI-assisted development
🚀 Getting Started
Prerequisites
Node.js
npm
Installation
git clone <repository-url>
cd naturevault
npm install
Start Development Server
npm run dev
Then open the local URL provided by Vite.

⚠️ Disclaimer
NatureVault is an educational interactive simulation.

The ecosystem health values, biodiversity indicators, species representations and future scenarios shown within the application are illustrative and should not be interpreted as scientific measurements, predictions or environmental assessments.

The goal is to make environmental change easier to:

Visualize → Explore → Understand

🌱 Vision
NatureVault asks:

What if people could experience environmental change instead of simply reading about it?

By combining:

3D Exploration + Time-Based Storytelling + Environmental Data + Interactive Discovery

NatureVault turns environmental change from something people simply read about into something they can step inside.

🌿 NatureVault
Step inside nature. Travel through time. See what changes.

The CivicShield Pipeline Stage What happens 📄 Document PDF, DOCX or TXT 🔍 Extraction Text and structure are extracted 🧩 Clauses Important sections are identified ⚖️ Legal Analysis Potential issues are detected 📚 Evidence Relevant legal sources are retrieved 📊 Risk Severity and confidence are calculated ✅ Action Concrete next steps are generated 🧭 Product Flow 🛡️ Three CivicShield Verticals 🏠 TenantShield

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

Original clause Section / page Detected issue Matched legal source Reasoning Fact vs inference Confidence level

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

🔮 Scenario Simulator What happens if...?

Users can explore hypothetical scenarios based on their document.

The simulator distinguishes known facts, possible outcomes, and uncertainty rather than presenting predictions as certainty.

✉️ Response Generator

CivicShield can transform a finding into an editable professional response.

The user remains in control of the final response.

🗄️ Evidence Vault

Important findings, responses and notes can be saved locally.

No backend database is required for the MVP.

🏗️ Architecture 🧠 Why the Architecture Is Different

The current hackathon implementation deliberately uses a deterministic rule-based legal analysis engine rather than a live LLM call.

This gives CivicShield:

Predictable results No hallucinated citations No API dependency Instant Demo Mode Reproducible analysis Structured outputs

The architecture is still designed so an LLM-assisted analysis layer can be introduced later without replacing downstream components.

🛠️ Tech Stack Layer Technology Framework Next.js 16 UI React 19 Language TypeScript Styling Tailwind CSS v4 Validation Zod PDF Parsing pdf-parse DOCX Parsing Mammoth Icons Lucide React Storage sessionStorage / localStorage Legal Retrieval Custom RAG provider Analysis Deterministic rule engine 🔐 Privacy & Safety

CivicShield is designed around a simple principle:

Legal AI should explain its reasoning instead of pretending to be certain.

The system:

Does not persist uploaded documents on a backend Validates files before processing Separates facts from inference Shows confidence levels Requires legal-source grounding Avoids fabricated citations Clearly communicates uncertainty Frames itself as informational guidance, not legal representation 🧪 Demo Mode

Want to try CivicShield without uploading anything?

Visit:

/demo

Demo Mode contains three fictional documents:

TenantShield · WorkShield · ConsumerShield

All three use the same analysis pipeline as uploaded documents and are precomputed for a reliable live demonstration.

📸 Screenshots Landing Page

Document Upload

Demo Mode

Analysis Dashboard

Scenario Simulator

Response Generator

Action Plan

⚙️ Getting Started git clone https://github.com/KodeMeister-YT/CivicShield.git cd CivicShield npm install npm run dev

Open:

http://localhost:3000 Useful routes / → Landing page /demo → Instant demo /analyze → Upload a document /vault → Evidence Vault Production npm run build npm run lint ⚠️ Known Limitations Clause detection is rule-based rather than LLM-powered. Current legal sources are federal-level and illustrative. State and local jurisdiction differences are not fully modeled. Scanned/image-only PDFs are not OCR'd. No authentication or multi-user persistence. Evidence Vault is browser-local. 🔮 What's Next?

Future versions could introduce:

LLM-assisted clause interpretation OCR for scanned documents State/local jurisdiction awareness Live legal databases Embedding-based retrieval Multi-document case analysis Secure accounts and encrypted evidence storage Broader civic workflows 🏆 Built for LexHack 2026

CivicShield

Know what they can do. Know what you can do.

Built to make legal information easier to understand, verify, and act on.

⚖️ Disclaimer

CivicShield provides informational guidance and does not provide legal representation or create an attorney-client relationship. Always consult a qualified legal professional for advice about your specific situation.
