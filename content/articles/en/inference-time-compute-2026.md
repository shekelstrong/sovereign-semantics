---
title: "Inference-Time Compute: How 'Thinking Longer' Is Rewriting AI Economics"
description: "The test-time compute paradigm (o1, R1, Claude 3.7) shifts the centre of gravity from training to inference. A breakdown of pricing, benchmarks, and what it means for agent architects."
date: "2026-06-06"
tags:
  - "it-ai"
  - "economy"
author: "ASS Editorial"
readingTime: 12
cover: "/blog/inference-time-compute-2026-cover.jpg"
coverPrompt: "Cinematic visualization of a single glowing GPU die splitting into a fractal cascade of branching decision trees, each path lit by emerald circuits, the deepest path burning brightest in terminator-vision gold, dark cyberpunk background, hyperrealistic macro detail, 8k, aspect 16:9, no text, no letters, no watermark"
cta:
  label: "Raw reasoning-model benchmarks across 12 tasks + cost-per-task script — in the channel"
  href: "https://t.me/suveren_media"
related:
  - "arbitrazh-vnimaniya-pochemu-ii-agenty-povtoryayut-biznes-model-trafik-menedzherov"
translations:
  ru: "inference-time-compute-2026"
faq:
  - q: "What is inference-time compute in plain terms?"
    a: "It is the model's ability to spend more compute *during the response*, not only during training. Instead of one direct pass, the model runs tens or hundreds of internal iterations, branches, and self-checks. Analogy: not 'fire off the answer', but 'sit down and think'."
  - q: "Why is OpenAI o1 3-6x more expensive than GPT-4o?"
    a: "Because o1 generates 10-100x more tokens per task under the hood. Every 'reasoning' token is a full forward pass through the transformer. The per-million-token price is higher not because of markup, but because of the physical volume of compute."
  - q: "Is DeepSeek R1 really cheaper than o1?"
    a: "Yes: $0.55 vs $15 per 1M input tokens and $2.19 vs $60 per 1M output (as of June 2026). With comparable quality on math benchmarks. This was the first public proof that reasoning models can be trained and hosted 20-30x cheaper than OpenAI does it."
  - q: "Who benefits from 'thinking longer'?"
    a: "High-stakes tasks: legal analysis, medical hypotheses, code audit, complex financial calculations. Mass chat, translation, and simple questions do not benefit. There, inference-time compute is a waste."
  - q: "What does this mean for AI agent developers?"
    a: "Three consequences. (1) Agent architecture is now a *model-calling strategy*: which task to give a fast model, which to give a reasoning one. (2) Budget per workflow must be measured in cost-per-task, not cost-per-token. (3) Open reasoning models (R1, Qwen-QwQ) make self-hosting economically viable for teams processing 10+ requests per second."
---

# Inference-Time Compute: How 'Thinking Longer' Is Rewriting AI Economics

> Thesis: until 2024, the race was about parameters and data — bigger, longer, more expensive training. From 2024 onward, the balance shifted: the main quality gains come not from training but from **compute spent at the moment of response**. This inverts the economics of LLMs.

## Context: why 'thinking longer' became more important than 'knowing more'

Before OpenAI o1 shipped in September 2024, the industry ran on a simple formula: "more parameters + more data + more training GPUs = better model." Scaling was predictable (Kaplan et al., 2020; Hoffmann et al., 2022) — and predictably expensive. GPT-4 cost an estimated $100M+ to train. Claude 3 Opus: comparable.

o1 broke that linearity. On AIME 2024 (olympiad math): GPT-4o scored 13%, o1 scored 83%. The model cost was roughly the same. What changed?

What changed was the **compute profile**. o1 does not 'know more' — it *spends more compute per answer*. Internally, the model generates hidden draft tokens, self-checks, revises, prunes branches. One user request triggers 50 to 500 internal iterations. This is **inference-time compute** (a.k.a. **test-time compute scaling**).

> The [[ru/arbitrazh-vnimaniya-pochemu-ii-agenty-povtoryayut-biznes-model-trafik-menedzherov|piece on attention arbitrage]] covers the parallel story: agents reproduce the traffic-manager architecture, the same proxies, the same monetisation. This piece is about the economics under the hood. The two are inseparable: for agents to trade in meaning, they must 'think', and that costs money.

Two and a half years ago, asking an LLM to 'think longer' meant chain-of-thought prompting (Wei et al., 2022). It worked, but did not scale: the model would *pretend* to think and quickly collapse into errors. o1 demonstrated that **real** scaling comes from RL training on reasoning chains themselves: the model learns not to give the right answer, but to **find the right path to the answer** (Lightman et al., 2023, "Let's verify step by step").

## Analysis: what shifted in the economics

### 1. Per-request cost rose by an order of magnitude

GPT-4o on an AIME-level task burns ~200 input + 300 output tokens. o1 burns 200 input but 5,000-15,000 output. That is **10-50x** in compute. Given that output reasoning tokens are priced 3-4x higher than input in OpenAI's tariff, the bill per request grows 30-60x.

This is **not a pricing bug** — it is physics. Each reasoning token is a full forward pass through the model. There is nothing to cut.

### 2. A new class of models appeared: open-weight reasoning models

In January 2025, DeepSeek published R1 (Guo et al., 2025) — an open-weight model with quality comparable to o1, trained for an estimated $5-6M (per SemiAnalysis). Three months later: Qwen-QwQ, then Mistral Magistral, then Llama variants.

Price comparison (June 2026, USD per 1M tokens):

| Model | Input | Output | AIME 2024 | GPQA Diamond |
|---|---|---|---|---|
| **OpenAI o1** | 15.00 | 60.00 | 83% | 78% |
| **OpenAI o3-mini** | 1.10 | 4.40 | 87% | 76% |
| **DeepSeek R1** | 0.55 | 2.19 | 79% | 71% |
| **Claude 3.7 Sonnet (ext. thinking)** | 3.00 | 15.00 | 80% | 78% |
| **Qwen QwQ-32B** (self-host) | 0.10* | 0.10* | 76% | 68% |

*\*Self-host cost on H100: ~$2/hr, ~200 tok/sec. Real price depends on load.*

R1 is **27x cheaper** than o1 on input and **27x cheaper** on output. With quality 79% vs 83% on AIME. This is not a marketing discount — it is a structural advantage of a more efficient RL loop.

### 3. A new metric appeared: cost-per-task

LLM applications used to measure cost in $/1M tokens. Now you must measure **$/task** — because one task can require vastly different reasoning volume. "Translate 'Hello' to Russian" is 100 tokens. "Prove that √2 is irrational" is 8,000 reasoning tokens.

For agent architects, this is **the main shift**: routing inside the agent is no longer "which model to call" but "what *reasoning budget* to allocate to this step."

### 4. The saved compute went into context length

A parallel 2025-2026 trend: context windows grew from 128K to 1M-10M tokens (Gemini 2.5 Pro, Llama 4). This is not exactly inference-time compute, but it is connected: long context is also compute spent at response time. Processing 1M tokens costs ~30 seconds of GPU time *before* the model generates any answer.

> Readers already familiar with the [[ru/arbitrazh-vnimaniya-pochemu-ii-agenty-povtoryayut-biznes-model-trafik-menedzherov|breakdown of agents and traffic managers]] will see the contrast: there the agents *bought attention*. Here they *buy compute*. The market is the same; the currency is different.

## Case: how Cursor rebuilt its architecture on o1

Cursor (AI-assisted coding IDE, $10B valuation in 2026) is a textbook transition case. Through mid-2025 they ran on Claude 3.5 Sonnet + GPT-4o for all tasks. In Q3 2025 they publicly described (Anysphere Blog, October 2025) how they rebuilt routing:

- **Simple edits** (rename variable, add import) → GPT-4o-mini, $0.0001/request
- **Medium-complexity refactoring** → Claude 3.5 Sonnet, $0.01/request
- **Architectural changes, multi-threaded logic bugs, PR review** → o1 or Claude 3.7 Extended Thinking, $0.30-$1.00/request

This delivered a **5x** drop in cost per IDE-hour of work, with quality rising (internal metric: 62% → 81% of edits accepted by users). The key insight: users do not mind paying $1 for a hard fix that works. Users do not want to pay $0.30 for 'let me see what is wrong' that returns garbage.

## Practical takeaways

1. **Stop measuring economics in $/1M tokens.** Measure in $/task. A task budget is the input: expected reasoning budget, ranging from 100 tokens (factual) to 20,000 (multi-step agentic workflow).

2. **Implement step-complexity routing inside the agent.** Simple steps go to a cheap model; complex steps go to a reasoning model. Cursor-style architecture. Without routing, inference-time compute eats the budget on flat ground.

3. **Self-host R1 / QwQ at 10+ req/sec sustained load.** The economics: an H100 at $2/hr delivers ~200 tok/sec on a 70B model. At sustained load, self-hosting is 3-5x cheaper than API *now*, and 10-15x cheaper as load grows.

4. **Plan for latency.** Reasoning models take 30-90 seconds per hard task. If the architecture assumes a synchronous user-facing response, you need either streaming visualisation ('the model is thinking, step 3 of 12') or a fast-path/slow-path split.

5. **Watch small reasoning models.** o3-mini, QwQ-32B, R1-distill-32B deliver 70-80% of o1 quality at 5-10% of the price. For most products that is enough. o1-class is needed only for hard cases.

6. **Prepare for on-device reasoning-as-a-service.** Qualcomm, Apple Neural Engine, and MediaTek APU all show reasoning models in the 3-7B range running on mobile silicon (late 2026 - early 2027). That will shift part of inference-time compute from cloud to device, with a corresponding shift in unit economics.

