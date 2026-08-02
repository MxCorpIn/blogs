---
title: "The Stripe System Design Question That Separates Senior From Staff Engineers"
description: "Exactly-once payments under retries: idempotency keys, in-progress state machines, CAS, and when sagas enter the conversation-senior vs staff depth."
type: article
category: career
tags: [system-design, distributed-systems, idempotency, interviews, payments]
keywords: [stripe system design interview, idempotency keys, exactly once payment, staff engineer interview, saga pattern payments]
publishedAt: 2026-03-23
updatedAt: 2026-05-14
author: ossium
featured: false
---

Payment systems sit on banks, card networks, merchants, and internal services. A network blip triggers a client retry. Did the first charge succeed? You may not know. Double charge, double fulfill, fraud flags-all possible.

**How do you guarantee a payment executes exactly once when nothing in the network is guaranteed?**

How you answer reveals depth: happy-path architecture vs failure-surface reasoning.

## The deceptively simple question

Happy path: user clicks Pay → call payments API → store result.

Interviewers care about the **gap** between sending a request and knowing the result. Distributed systems live there.

Schemas, service boundaries, and rate limits matter-but the core is delivery semantics:

| Guarantee | Risk |
|-----------|------|
| At most once | Lost operations |
| At least once | Duplicate side effects |
| Exactly once | Must be **built** at the application layer |

A retry is indistinguishable from a new request unless you make them distinguishable.

## The senior answer: idempotency keys

Client generates a unique ID per intended operation and sends it with every attempt. Server stores the key and result. Same key again → return stored result; do not re-run the charge.

You’re trading storage for safety. Each intended operation gets a fingerprint that survives retries.

Stripe’s public docs describe this: clients send an `Idempotency-Key` header; the server deduplicates. A senior should explain:

- How to store and expire records  
- Happy-path end-to-end flow  
- Why this stops the simple double-charge case  

Stopping here is the usual senior ceiling-and the door to the staff follow-up.

## The staff answer: state between key and result

Scenario:

1. Fresh idempotency key arrives  
2. Card is charged  
3. Server crashes before writing “success”  
4. Client retries with the same key  
5. No stored result → charge again  

The original bug reappears **inside** the “solution.”

Treat the idempotency record as a **state machine**, not a dumb cache:

| State | On retry |
|-------|----------|
| Missing | Start fresh; write **in progress** before side effects |
| In progress | Conflict / wait-do not re-execute |
| Completed | Return cached result |

Concurrent retries need **compare-and-swap** or a lock so only one holder of “in progress” exists. That adds latency and makes the idempotency store a critical-path dependency. The trade-off-latency and availability for correctness-is what the question is really probing.

## The hidden dimension: multi-service side effects

Your payment service may call several downstreams. One fails mid-flight: bank notified, inventory not updated, email not sent. Top-level idempotency does not automatically coordinate every child effect.

That boundary is **distributed transaction design**-where **sagas** live: local steps plus compensating actions, eventual consistency, not 2PC across five services.

Strong candidates reach keys + state machines. Exceptional candidates name coordination patterns (saga, outbox, explicit compensations) and their costs.

## Mental model

| Operation shape | You need |
|-----------------|----------|
| No side effects | Idempotency free |
| Side effects, single service | Idempotency keys + state machine |
| Side effects across services | Plus saga / outbox / compensations |

Portable line for any design discussion:

> Exactly-once semantics in a distributed system require idempotency at the **application** layer, not the transport layer.

## What interviewers are measuring

Not whether you’ve heard the word “idempotency.” Whether you:

- Find where your answer still breaks  
- Explain trade-offs of the fix  
- Go one level deeper than the textbook key  

Payments make missing guarantees expensive. The question is less about Stripe and more about clear thinking when nothing is guaranteed and everything has a cost.

The next hard problem-making compensating transactions themselves idempotent so recovery is safe to retry-is where much of the interesting systems work continues.
