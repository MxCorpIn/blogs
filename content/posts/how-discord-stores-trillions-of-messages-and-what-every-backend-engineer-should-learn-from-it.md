---
title: "How Discord Stores Trillions of Messages (And What Backend Engineers Should Learn)"
description: "LSM trees, hot partitions, request coalescing, and ScyllaDB: Discord cut 177 Cassandra nodes to 72 and P99 from 200ms to 5ms. Lessons for any backend."
type: article
category: tools
tags: [distributed-systems, cassandra, scylladb, backend, system-design]
keywords: [discord architecture, cassandra hot partitions, lsm tree, request coalescing, scylladb migration, discord message storage]
publishedAt: 2026-07-12
updatedAt: 2026-07-16
author: ossium
featured: false
draft: false
---

By 2022, Discord had a problem that more hardware could not fix.

Their message store-**trillions of messages** across a 177-node Cassandra cluster-was working. Mostly. Massive public channels with hundreds of thousands of active members made specific nodes buckle. P99 latency on those channels hit hundreds of milliseconds. Tuning was not enough.

The root cause was architectural. Understanding it means going deeper than "use Cassandra for scale": how Cassandra stores data, why that creates hot partitions, and how the fix required rethinking the layer *above* the database.

## What Cassandra is under the hood

Cassandra is a distributed wide-column database built on two ideas:

1. **LSM-tree storage** - a write-optimized storage engine  
2. **Consistent hashing** - distribute data across nodes without a central coordinator  

### The LSM-tree: writes are always fast

Traditional databases (Postgres, MySQL) store data in **B-trees**. Updating a row means finding the page, modifying in place, and writing back-random disk seeks.

Cassandra never modifies data in place. Every write is an **append**.

The write path:

1. **Commit log** - append sequentially to a log on disk (sequential writes are far faster than random).  
2. **Memtable** - insert into an in-memory sorted structure.  
3. **Client ACK** - once both succeed, the client gets success.  
4. **SSTable flush** - later, the Memtable flushes to an immutable sorted file on disk (SSTable).  

Writes are effectively O(1): no random seeks, no in-place mods, little lock contention.

**Tradeoff: reads are more expensive.** A read checks the Memtable plus every SSTable that might hold the row, then merges. More SSTables → slower reads. **Compaction** merges SSTables in the background to keep that cost manageable-but compaction itself is expensive I/O.

```text
LSM-tree in one sentence:
Writes are O(1) always. Reads are O(k) where k = number of SSTables.
Compaction keeps k small by merging SSTables, at I/O cost.
```

## The data model: design for queries, not entities

Cassandra has **no query planner**. It cannot efficiently join tables or filter on arbitrary columns. It only efficiently runs queries that match the physical layout.

Every table has:

- A **partition key** - which node(s) own the data (via consistent hashing). Rows with the same partition key live together, sorted on disk.  
- **Clustering keys** - sort order *within* a partition. Range scans inside one partition are efficient.  

Discord's messages schema (simplified):

```sql
PRIMARY KEY ((channel_id, bucket), message_id)
--           ↑ partition key       ↑ clustering key
```

Optimized for: "give me the last 50 messages in this channel." `(channel_id, bucket)` colocates a channel's messages; `message_id` (Snowflake / time-ordered) keeps them sorted. One node, sequential read.

Ask "all messages by this user across channels" and this schema cannot answer efficiently-you'd need another table with `user_id` as the partition key and a duplicate copy of the data.

**Rule:** one table per query pattern. Duplication is normal. Flexibility comes from modeling, not a planner.

## The problem: hot partitions

Consistent hashing spreads data evenly *in theory*. With 177 nodes, each should hold ~1/177th. Traffic is never even.

A `#general` channel with 500,000 active members maps to one partition key: `(channel_id=12345, bucket=current_month)`. That key hashes to specific nodes. Those nodes receive:

- Tens of thousands of writes per second  
- Tens of thousands of reads (history loads)  
- Amplified read cost as the partition spans many SSTables  

Meanwhile most of the cluster sits idle.

**You cannot fix this with more hardware.** Double to 354 nodes-the hot partition still routes to the same nodes. Adding capacity helps average throughput, not the hot key.

Worse: Cassandra on the JVM. Under load, GC freezes threads on the busiest nodes for hundreds of milliseconds. Tail latency becomes unpredictable.

A hot partition is a **structural** problem, not a capacity problem.

## The fix: Data Services + request coalescing

Insight: 50,000 users asking for the same data should be one database query.

Discord built an intermediate **Data Services** layer (Rust) between the API and Cassandra.

### Mechanism 1: Consistent hash routing

Every request carries a routing key (`channel_id`). Data Services routes all traffic for the same channel to the same instance-prerequisite for coalescing.

### Mechanism 2: Request coalescing

Once all requests for `channel_id=12345` land on one instance:

```text
t=0ms:   Request 1 arrives → start Cassandra query → mark "in-flight"
t=1ms:   Requests 2–50,000 arrive → in-flight query exists → wait
t=15ms:  Cassandra responds → fan out result to all callers
```

**50,000 requests → 1 Cassandra query.** The hot node sees one query per time window for that channel, regardless of concurrent viewers.

This is **not caching**. A cache stores a result for later (stale after TTL). Coalescing merges *simultaneous in-flight* requests-all callers get current data.

## Switch to ScyllaDB: same model, no GC

Coalescing fixed traffic amplification. GC pauses remained.

**ScyllaDB** is Cassandra rewritten in C++:

- **Same data model** - CQL, partition/clustering keys, SSTables, wire protocol  
- **No JVM** - no garbage collector; deterministic memory management  
- **Shard-per-core** - each CPU core owns its shard, memory, and event loop; less lock contention  

From the app's perspective: configuration change, not a rewrite. Same queries, schema, and clients.

Results for Discord:

- **177 nodes → 72 nodes** for the same workload  
- **P99 latency: ~200ms → ~5ms** (GC pauses gone)  

Not a new algorithm-remove surprise costs and match multi-core hardware. A "boring" engineering win.

## Migration: trillions of messages safely

Three phases:

### Phase 1: Fast bulk transfer

A custom migrator at **~3.2 million messages/sec** finished in **~9 days** instead of months. Speed was strategic: fast enough to avoid a long dual-write period and all its sync risk.

_Principle:_ sometimes make the one-time operation fast enough that you do not need a complex sync mechanism.

### Phase 2: Shadow validation

Data was in ScyllaDB-was it correct? Live reads still served from Cassandra (source of truth); the same requests were also sent to ScyllaDB and compared. Mismatches investigated. Shadow traffic catches real edge cases synthetic tests miss.

### Phase 3: Decisive cutover

ScyllaDB became primary in one switch-not a slow percentage rollout. Front-load risk into phases 1 and 2; the flip should be boring.

## What to take away

- **LSM tradeoffs are everywhere:** RocksDB, LevelDB, InfluxDB, HBase-write-optimized storage is usually an LSM variant.  
- **Hot partitions are universal:** Kafka (hot partition), Redis Cluster (hot key), time-based Postgres partitions. Structural fix: coalescing or load-spreading *above* storage.  
- **Consistent hashing is a routing primitive:** Cassandra routes data; Discord's Data Services routes requests. Same idea, different layer.  
- **Migration template:** bulk transfer (fast) → shadow validation (real traffic) → decisive cutover (boring).  
- **Boring fixes win:** ScyllaDB's win was less GC and better hardware use-not a flashy algorithm. Ask which implementation has fewer surprise costs.  
