---
title: "Five layers of technological sovereignty"
description: "Russia assembles an independent digital stack across processors, OS, data, AI, and cognition. The numbers behind the transition and the gaps that remain."
date: 2026-06-04
tags: ["geopolitics"]
cover: "/og/articles/sovereign-tech.png"
coverPrompt: "Dark cinematic visualization of digital infrastructure layers, circuit boards merging with neural networks, cold blue and emerald neon, hyperrealistic 8k render, no text, no letters, no watermark"
author: "Editorial of ASS"
readingTime: 13
cta:
  label: "Telegram channel"
  href: "https://t.me/suveren_media"
related: ["ai-statecraft-2026", "local-llm-consumer-hardware-2026"]
faq:
  - q: "What is technological sovereignty?"
    a: "A state's capacity to control critical nodes of digital infrastructure — processors, operating systems, AI models — without relying on external suppliers."
  - q: "Does technological sovereignty mean total isolation?"
    a: "No. Critical nodes stay under national control; non-critical ones trade freely with the global market."
  - q: "Why does cognitive sovereignty matter?"
    a: "Without clear thinking from engineers and officials, the four lower layers produce nothing. Sober assessment of reality grounds every technological decision."
  - q: "Which Russian AI models actually work in production?"
    a: "YandexGPT, GigaChat, Kandinsky — industrial products handling real workloads at scale."
  - q: "What should businesses do right now?"
    a: "Prioritize domestic solutions where they perform. Maintain a plan B for critical services."
translations:
  ru: "pyat-sloev-tekhnologicheskogo-suvereniteta"
---

Sberbank migrated 3,400 internal business processes to GigaChat. Baikal Electronics shipped 12,000 Baikal-M2 processors for Rostelecom servers. Both events landed in March 2026. The stack assembles layer by layer. The question: whose code sits at the foundation, and whose brains write that code.

Control over the software stack of critical infrastructure — power grids, banks, transport, telecommunications — defines real sovereignty in the 21st century. Warheads are an obsolete metric. A country dependent on foreign code remains vulnerable to the country controlling that code. Dependency on foreign thinking doubles the vulnerability.

Sanctions pressure shifted the focus from discussion to engineering. Federal Law 263-FZ mandated operators of critical information infrastructure to migrate to domestic software by March 2025. Deadlines slipped. The domestic software registry swelled to 16,000 entries. Import substitution transformed from a slogan into a work schedule with deadlines and penalties. Astra Linux Group grew revenue 47% in 2025. Postgres Pro, 38%. Not budget infusions. Market demand for an independent stack generates real vendor revenue.

## Hardware layer

Processors, servers, telecom equipment. Full sovereignty without domestic microelectronics stays impossible. A sustainable architecture of controlled supply chains is achievable.

Baikal Electronics produces processors on MIPS and ARM architectures. The Moscow fab outputs 5 million dies per year. Insufficient to replace Intel and AMD across the entire market. Sufficient for critical nodes — industrial control systems, routers, embedded systems. Mikron plant raised the share of domestic chips in smart cards to 68% in 2025.

Data centers remain the bottleneck. The Ministry of Digital Development recorded a deficit of 30,000 server racks for government needs in 2024. By mid-2026, companies Server and Aquarius cover 40% of domestic demand for server equipment. The rest comes from contracts with China, the UAE, parallel imports through Turkey and Kazakhstan.

Hardware sovereignty is not about TSMC-grade fabs. It is about guaranteeing critical systems keep running when Western supplies cut off.

See also: [[rare-earth-metals-hidden-axis-geoeconomics-ai-2026]]

## Software stack

Operating systems, DBMS, virtualization, containerization. Working solutions under load exist.

Astra Linux runs in 78% of government bodies, certified across FSTEK trust levels. Postgres Pro handles 60% of Moscow Exchange transactions. Yandex Cloud delivers 150+ services with a 99.95% SLA. Industrial systems process millions of requests per second.

The problem is the ecosystem. An operating system without application software is dead. The domestic software registry includes 16,000 entries: office suites, CAD systems, industry-specific solutions. R7-Office replaced Microsoft Office in 3,400 government-sector organizations. Kompas-3D covers 70% of mechanical engineering CAD needs.

Gaps persist. EDA systems for chip design (Cadence, Synopsys, Mentor Graphics) lack Russian equivalents. CAE systems for engineering calculations (Ansys, Abaqus) likewise. Minimally viable products will appear in 18–24 months if financing doesn't get eaten by bureaucracy.

## Data and jurisdiction

Physical location of bits determines sovereignty. Not metaphorically. Legally.

The personal data localization law (242-FZ) has required storing Russian citizens' data on Russian territory since 2015. By 2026, 94% of large companies formally comply. Formally. Cloud providers Yandex Cloud, VK Cloud, Selectel run hardware manufactured outside Russia. Servers sit in Russian data centers. BMC controllers on motherboards are American.

Government registries (EGRUL, EGRN, FRIS) run on infrastructure from VTB, Rostelecom, ER-Telecom. Technically, data stays inside the jurisdiction. Practically, 1,200 organizations gain access via APIs. Audits of these accesses have not been conducted since 2023.

Cryptographic protection forms a separate layer. GOST cryptography (algorithms Kuznyechik, Magma, Streebog) is mandatory for critical information infrastructure. OpenSSL implementation appeared only in 2024. BoringSSL still lacks it entirely.

See also: [[post-quantum-cryptography-2026]]

## AI models and inference

YandexGPT 4 processes a 32,000-token context window. GigaChat 2 Pro generates 500 requests per second. Kandinsky 3 produces images comparable to Midjourney v5. Industrial products, not demo prototypes.

Models without infrastructure are dead code. Training YandexGPT 4 consumed 4,000 A100 GPUs for 30 days. Training GigaChat 2 consumed 2,000 GPUs for 21 days. Nvidia sold Russia 10,000 A100/H100 GPUs in 2023–2025 through parallel imports. Official shipments have been banned since September 2022. Chips travel through third countries. Prices climb 40–60%. Delivery times stretch to 3–4 months instead of 2 weeks.

See also: [[local-llm-consumer-hardware-2026]]

Local inference reduces dependency on cloud providers capable of disabling an API at any moment. The approach works for medium models (7–13 billion parameters). For frontier models at GPT-4 level it does not.

## Cognitive layer

The most critical layer. How the engineer writing code thinks. How the official allocating budget thinks. How the entrepreneur choosing between a quick fix on a foreign stack and a long build on a domestic one thinks.

Without cognitive sovereignty the four lower layers spin idle. An engineer incapable of systems thinking cannot design resilient architecture. An official who thinks in reporting categories will not fund an 18-month development cycle. An entrepreneur living in an information bubble will miss market opportunities.

See also: [[ai-statecraft-2026]]

## What to do

For business:
- Build the IT landscape prioritizing domestic solutions where they perform — DBMS, virtualization, office applications
- Maintain a plan B for critical services: contracts with two providers, backup data centers, documented failover procedures
- Invest in migration before deadlines, not after penalties

For government:
- Reduce regulatory burden on IT companies: 47 annual reports for a company receiving tax benefits suffocates rather than supports
- Finance startups through grants, not state corporations through subsidies. Sber, VK, and Yandex already have a market — they need competitors, not subsidies
- Impose a 24-month moratorium on changing technical requirements for the domestic software registry. Every change adds 6 months of adaptation for vendors

For the individual specialist:
- Invest in cognitive performance: 7–8 hours of sleep, 150+ minutes of physical activity per week, stress management. A clear head is a strategic resource
- Study systems engineering, data analysis, cryptography. The market pays for competencies, not diplomas

## What it actually means

By 2028 Russia will have a functioning digital stack across 70–80% of critical infrastructure. The remaining 20–30% (EDA, CAE, high-performance GPUs) will require 3–5 years and $2–4 billion in R&D investment. A realistic horizon.

The risk: cognitive rupture. Hardware and software sovereignty are built by engineers. If the engineering school keeps losing personnel — 15,000 IT specialists emigrated in 2022–2025 per Ministry of Digital Development estimates — the stack will exist, but nobody will be left to write it. The inverse risk: excessive bureaucracy kills the remnants of entrepreneurial initiative before sanctions shut down the last server.

Architecture of meanings begins with the architecture of one's own mind.

### Q: What is technological sovereignty?

A state's capacity to control critical nodes of digital infrastructure — processors, OS, AI models — without relying on external suppliers.

### Q: Does technological sovereignty mean total isolation?

No. Critical nodes stay under national control; non-critical ones trade freely with the global market.

### Q: Why does cognitive sovereignty matter?

Without clear thinking from engineers and officials, the four lower layers produce nothing. Sober assessment of reality grounds every technological decision.

### Q: Which Russian AI models actually work in production?

YandexGPT, GigaChat, Kandinsky — industrial products handling real workloads at scale.

### Q: What should businesses do right now?

Prioritize domestic solutions where they perform. Maintain a plan B for critical services.

---

In **Sovereign Semantics** we dissect similar stories in depth: methodology, sources, consequences. Subscription is free.

**[→ JOIN: t.me/suveren_media](https://t.me/suveren_media)**