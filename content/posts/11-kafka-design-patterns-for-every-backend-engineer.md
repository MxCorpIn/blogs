---
title: "11 Kafka Design Patterns for Every Backend Engineer"
description: "Event sourcing, CQRS, DLQ, outbox, sagas, and more—11 essential Apache Kafka patterns with when to use them, AWS notes, and code snippets."
type: guide
category: tools
tags: [kafka, backend, event-driven, system-design, aws]
keywords: [kafka design patterns, event sourcing kafka, transactional outbox, dead letter queue, cqrs kafka, saga pattern]
publishedAt: 2026-04-04
updatedAt: 2026-05-29
author: ossium
featured: false
---

Using Kafka well takes more than produce and consume. You need patterns for ordering, exactly-once semantics, large payloads, failure recovery, and integration with services like MSK, S3, DynamoDB, and Lambda.

This guide covers **11 essential Kafka patterns**—what each one is, when to use it, how it maps to AWS, and a small code snippet. Use it as a map for event-driven microservices, data pipelines, or migrations to Amazon MSK.

## Pattern overview

| # | Pattern | Category |
|---|---------|----------|
| 1 | Event Sourcing | Data & state |
| 2 | CQRS | Data & state |
| 3 | Event Carried State Transfer | Data & state |
| 4 | Claim Check | Performance |
| 5 | Dead Letter Queue (DLQ) | Reliability |
| 6 | Idempotent Consumer | Reliability |
| 7 | Transactional Outbox | Reliability |
| 8 | Compacted Topic | Data & state |
| 9 | Partition Key / Ordering | Reliability |
| 10 | Stream-Table Duality | Integration |
| 11 | Saga (Choreography) | Integration |

Each pattern below includes **what it is**, **when to use it**, **how on AWS**, and a **code snippet**.

---

## 1. Event Sourcing

**What it is:**  
Instead of storing only the current state of an entity, you store every state-changing event as an immutable, append-only sequence in Kafka. Current state is derived by replaying events. Kafka’s log storage makes this natural.

**When to use:**

- You need a full audit trail of every change
- You want to replay history to reconstruct past states or debug issues
- You need temporal queries (“what did the order look like yesterday at 3 PM?”)

**How on AWS:**  
Create an MSK topic with long retention (or backup to S3 via MSK Connect S3 Sink). Consumers rebuild state from the earliest offset. Tools like ksqlDB can materialize views from the event log.

```python
# Producer — append only
event = {
    "event_type": "OrderCreated",
    "order_id": "123",
    "amount": 100,
    "status": "pending",
}
producer.send("order_events", key="123", value=json.dumps(event))

# Consumer — rebuild state by replaying
state = {}
for msg in consumer:
    event = json.loads(msg.value)
    order_id = event["order_id"]
    if order_id not in state:
        state[order_id] = {}
    if event["event_type"] == "OrderCreated":
        state[order_id] = {"amount": event["amount"], "status": "pending"}
    elif event["event_type"] == "OrderPaid":
        state[order_id]["status"] = "paid"
```

**AWS tip:** Use Glue Schema Registry to evolve event schemas safely. Set `retention.bytes` or `retention.ms` based on compliance needs.

---

## 2. CQRS (Command Query Responsibility Segregation)

**What it is:**  
Separate the write path (commands that change state) from the read path (queries that retrieve data). Commands go to Kafka, which asynchronously updates one or more read-optimized models. Reads and writes scale independently and can use different data structures.

**When to use:**

- Read and write workloads scale differently (e.g. 1k writes/sec vs 100k reads/sec)
- You need multiple read models (mobile app, dashboard, analytics)
- You want to avoid complex JOINs by pre-joining into dedicated tables

**How on AWS:**  
Write commands to an MSK topic. A consumer (Lambda, Kafka Streams, or ksqlDB) updates read models in DynamoDB, Aurora, or OpenSearch. Reads go to those stores, not the write path.

```java
@KafkaListener(topics = "order_events")
public void updateReadModels(OrderEvent event) {
    DashboardView view = new DashboardView();
    view.setOrderId(event.getOrderId());
    view.setAmount(event.getAmount());
    view.setStatus(event.getStatus());
    dynamoDbMapper.save(view);

    IndexRequest request = new IndexRequest("orders")
        .id(event.getOrderId())
        .source(Map.of(
            "amount", event.getAmount(),
            "status", event.getStatus()
        ));
    openSearchClient.index(request);
}
```

**AWS tip:** Use DynamoDB GSIs for different query patterns. Size Lambda batch size and concurrency to avoid throttling.

---

## 3. Event Carried State Transfer

**What it is:**  
Events carry the full state consumers need—not just an ID. Consumers don’t call back to the source service, which reduces coupling, network hops, and latency.

**When to use:**

- Consumers often need the same contextual data with every event
- You want to decouple producer and consumer as long as the event contract holds
- Latency matters and extra network hops are expensive

**How on AWS:**  
Design payloads generously. Version events with Glue Schema Registry. Stay under MSK’s default 1MB message limit.

```python
# Instead of only user_id
event = {
    "event_type": "UserUpdated",
    "user_id": "123",
    "name": "Alice Chen",
    "email": "alice@example.com",
    "timezone": "America/New_York",
    "preferences": {
        "notifications_enabled": True,
        "email_digest": "daily",
    },
    "last_login_ts": 1700000000,
}
producer.send("user_events", key="123", value=json.dumps(event))

def handle_user_update(event):
    send_email(event["email"], "Your profile was updated")
    if event["preferences"]["notifications_enabled"]:
        send_push_notification(event["user_id"])
```

**AWS tip:** Set schema compatibility to `BACKWARD` or `FORWARD`. Monitor message size in CloudWatch.

---

## 4. Claim Check

**What it is:**  
Store large payloads (files, big JSON) in external storage such as S3. The Kafka message holds only a reference (claim check). Consumers fetch the payload when needed.

**When to use:**

- Messages exceed Kafka’s `max.message.bytes` (default 1MB)
- You want less broker disk I/O and network traffic
- Large payloads are used infrequently

**How on AWS:**  
Upload to S3 with a unique key. Publish the S3 URI (and optional presigned URL). Apply S3 lifecycle rules to expire old objects.

```python
import boto3
from uuid import uuid4

s3 = boto3.client("s3")
s3_key = f"order-attachments/{uuid4()}/invoice.pdf"
s3.upload_file("/tmp/invoice.pdf", "my-kafka-bucket", s3_key)

presigned_url = s3.generate_presigned_url(
    "get_object",
    Params={"Bucket": "my-kafka-bucket", "Key": s3_key},
    ExpiresIn=3600,
)

claim_check = {
    "order_id": "123",
    "s3_bucket": "my-kafka-bucket",
    "s3_key": s3_key,
    "presigned_url": presigned_url,
    "size_bytes": 10485760,
}
producer.send("order_attachments", key="123", value=json.dumps(claim_check))
```

**AWS tip:** Expire objects after a short window (e.g. 7 days). Prefer S3 Intelligent-Tiering for cost control.

---

## 5. Dead Letter Queue (DLQ)

**What it is:**  
After retries are exhausted, failed messages go to a separate dead-letter topic instead of blocking the main stream. The DLQ is a quarantine for inspection or delayed replay.

**When to use:**

- Poison pills (malformed messages that always fail)
- Downstream failures retries won’t fix (e.g. schema mismatch)
- You need visibility into failures without stopping the pipeline

**How on AWS:**  
Use a naming convention like `main-topic.dlq`. On failure, publish to the DLQ, commit the offset, and alert on DLQ depth.

```python
def consume_with_dlq():
    dlq_producer = KafkaProducer(bootstrap_servers="msk-broker:9092")

    for msg in consumer:
        try:
            process_message(msg)
            consumer.commit()
        except MalformedDataError as e:
            dlq_producer.send(f"{msg.topic}.dlq", msg.value, key=msg.key)
            consumer.commit()
            logger.error(f"Sent malformed message to DLQ: {e}")
        except TransientError:
            if retry_count[msg.offset] > MAX_RETRIES:
                dlq_producer.send(f"{msg.topic}.dlq", msg.value)
                consumer.commit()
```

**AWS tip:** For Lambda event source mappings, configure a native DLQ (SQS/SNS). For custom MSK consumers, implement DLQ in the app.

---

## 6. Idempotent Consumer

**What it is:**  
A consumer that can process the same message more than once without duplicate side effects (double charge, double email, double counter). Kafka’s default delivery is at-least-once.

**When to use:**

- Side effects are non-idempotent (DB writes, emails, payments)
- You can’t rely solely on Kafka exactly-once
- You prefer simple business logic over distributed transactions

**How on AWS:**  
Keep an idempotency store (DynamoDB with TTL, or ElastiCache). Record `key + partition + offset` (or a business idempotency key) before committing the offset. Use conditional writes.

**AWS tip:** On-demand DynamoDB + TTL for your replay window (e.g. 7 days). For higher throughput, Redis `SETNX` works well.

---

## 7. Transactional Outbox

**What it is:**  
Solves the dual-write problem: a DB update and a Kafka publish must stay consistent. Write business data and an outbox row in the **same local DB transaction**. A poller or CDC process publishes from the outbox to Kafka.

**When to use:**

- You need reliable delivery between your database and Kafka
- Cross-system dual writes are racing or partially failing
- Kafka transactions alone aren’t enough for your topology

**How on AWS:**  
Use RDS/Aurora with an outbox table. Poll with Lambda/ECS, or stream with Debezium on MSK Connect.

```python
# Same DB transaction as business data
with db.transaction():
    db.execute(
        "INSERT INTO orders (id, amount, status) VALUES (%s, %s, %s)",
        (order_id, 100, "created"),
    )
    outbox_payload = json.dumps({
        "event_type": "OrderCreated",
        "order_id": order_id,
        "amount": 100,
    })
    db.execute(
        "INSERT INTO outbox (id, payload, status, created_at) VALUES (%s, %s, %s, %s)",
        (uuid4(), outbox_payload, "pending", datetime.utcnow()),
    )
```

```python
def lambda_handler(event, context):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, payload FROM outbox WHERE status='pending' "
        "ORDER BY created_at LIMIT 100"
    )
    for row in cursor.fetchall():
        kafka_producer.send("order_events", value=row["payload"])
        cursor.execute(
            "UPDATE outbox SET status='sent', sent_at=NOW() WHERE id=%s",
            (row["id"],),
        )
    conn.commit()
```

**AWS tip:** Prefer Debezium CDC over long-term polling. Alarm on outbox table growth.

---

## 8. Compacted Topic

**What it is:**  
A topic with `cleanup.policy=compact` keeps only the **latest message per key**. Older values for that key are removed during compaction—turning the topic into a replicated key-value log.

**When to use:**

- You need the latest state per entity (profile, price, config)
- New consumers should bootstrap without full history
- You’re building a changelog (Debezium CDC often uses compacted topics)

**How on AWS:**  
Set `cleanup.policy=compact` on the MSK topic. Tune `min.cleanable.dirty.ratio` for compaction frequency.

```python
# Only the latest per key matters
producer.send(
    "user_profiles",
    key="user123",
    value='{"name":"Alice","theme":"dark"}',
)
producer.send(
    "user_profiles",
    key="user123",
    value='{"name":"Alice","theme":"light","email":"alice@x.com"}',
)

# Reading near the end yields the latest value per key after compaction
consumer.assign([TopicPartition("user_profiles", 0)])
consumer.seek_to_end()
```

**AWS tip:** Monitor compaction lag. Use `delete.retention.ms` for tombstone lifetime. Compacted topics pair well with ksqlDB `CREATE TABLE`.

---

## 9. Partition Key / Ordering Pattern

**What it is:**  
Kafka guarantees order **within a single partition**. A message key routes all related events to the same partition so per-entity order is preserved.

**When to use:**

- Strict order per entity (order, user, device, session)
- Parallelism across entities, sequential processing within one
- Stateful consumers that must process one key in sequence

**How on AWS:**  
Use high-cardinality keys (`order_id`, `user_id`). Avoid low-cardinality keys that create hot partitions. Size partitions for max consumer parallelism.

```python
# Same key → same partition → order preserved
producer.send("order_events", key="order_123", value=json.dumps({"event": "created"}))
producer.send("order_events", key="order_123", value=json.dumps({"event": "paid"}))
producer.send("order_events", key="order_123", value=json.dumps({"event": "shipped"}))

# Different keys may go to different partitions
producer.send("order_events", key="order_456", value=json.dumps({"event": "created"}))
```

```java
@KafkaListener(topics = "order_events", concurrency = "3")
public void listen(ConsumerRecord<String, String> record) {
    String orderId = record.key(); // order_123 events stay sequential
    // process in order for this key
}
```

**AWS tip:** Watch partition skew (`BytesInPerPartition`). If needed, salt keys carefully or increase partitions.

---

## 10. Stream-Table Duality

**What it is:**  
Kafka is both a **stream** (events over time) and a **table** (current state per key). You can aggregate a stream into a table, or emit a table’s changelog as a stream—core to Kafka Streams and ksqlDB.

**When to use:**

- Join a real-time stream with slowly changing reference data
- Maintain live materialized views
- Power real-time dashboards or monitoring

**How on AWS:**  
Run ksqlDB or Kafka Streams on ECS/EKS (or managed Confluent on AWS). RocksDB backs local state; compacted topics hold changelogs.

```sql
CREATE TABLE user_profiles (
    user_id VARCHAR PRIMARY KEY,
    name VARCHAR,
    email VARCHAR
) WITH (
    KAFKA_TOPIC = 'user_changes',
    VALUE_FORMAT = 'JSON'
);

CREATE STREAM clickstream (
    user_id VARCHAR,
    page VARCHAR,
    timestamp BIGINT
) WITH (
    KAFKA_TOPIC = 'clicks',
    VALUE_FORMAT = 'JSON'
);

CREATE STREAM enriched_clicks AS
SELECT
    c.user_id,
    c.page,
    c.timestamp,
    u.name,
    u.email
FROM clickstream c
JOIN user_profiles u ON c.user_id = u.user_id
EMIT CHANGES;
```

```java
KTable<String, UserProfile> userTable = builder.table("user_changes");
KStream<String, ClickEvent> clickStream = builder.stream("clicks");

KStream<String, EnrichedClick> enriched = clickStream.join(
    userTable,
    (click, profile) -> new EnrichedClick(click, profile),
    Joined.with(Serdes.String(), clickSerde, profileSerde)
);
```

**AWS tip:** Monitor state-store size and changelog lag. Prefer managed ksqlDB if you don’t want to operate RocksDB yourself.

---

## 11. Saga (Choreography)

**What it is:**  
A distributed transaction without a central coordinator. Each service does local work, publishes events, and other services react. On failure, compensating events undo prior steps. Kafka is the backbone.

**When to use:**

- Distributed workflows across microservices without 2PC
- Long-running transactions that shouldn’t hold locks
- Loosely coupled services owned by different teams

**How on AWS:**  
Topics per domain (`order_events`, `payment_events`). For complex branching, combine with Step Functions (orchestration) while still using Kafka for events.

```python
# Order service — starts the saga
def create_order(order):
    db.insert(order, status="PENDING")
    producer.send(
        "order_events",
        value={"event": "OrderCreated", "order_id": order.id},
    )

# Payment service
def handle_order_created(event):
    try:
        charge_credit_card(event["order_id"])
        producer.send(
            "payment_events",
            value={"event": "PaymentProcessed", "order_id": event["order_id"]},
        )
    except InsufficientFunds:
        producer.send(
            "payment_events",
            value={"event": "PaymentFailed", "order_id": event["order_id"]},
        )
        producer.send(
            "order_events",
            value={"event": "OrderCancelled", "order_id": event["order_id"]},
        )

# Order service — compensation
def handle_order_cancelled(event):
    db.update(event["order_id"], status="CANCELLED")
    refund_any_pre_authorizations(event["order_id"])
```

**AWS tip:** Monitor DLQs for failed saga steps. Use Step Functions when choreography becomes hard to reason about.

---

## Quick takeaways

| Goal | Patterns to start with |
|------|------------------------|
| Reliability | Outbox, Idempotent Consumer, DLQ, Partition Key |
| State & history | Event Sourcing, CQRS, Compacted Topic, Event Carried State |
| Scale & integration | Claim Check, Stream-Table Duality, Saga |

These patterns aren’t theoretical—they’re how production teams keep event systems resilient, scalable, and maintainable on Kafka and AWS MSK.
