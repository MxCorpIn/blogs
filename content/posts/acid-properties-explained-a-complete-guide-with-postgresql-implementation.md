---
title: "ACID Properties Explained: A Complete Guide with PostgreSQL"
description: "Learn ACID transactions-atomicity, consistency, isolation, durability-with hands-on PostgreSQL examples for banking-style transfers and isolation levels."
type: guide
category: tools
tags: [postgresql, databases, sql, transactions, backend]
keywords: [acid properties, postgresql transactions, isolation levels, atomicity consistency isolation durability]
publishedAt: 2026-02-28
updatedAt: 2026-02-28
author: ossium
featured: false
---

**ACID** is the set of guarantees that make relational databases reliable under failure and concurrency. This guide covers what a transaction is, walks through atomicity, consistency, isolation, and durability, and shows each idea with practical PostgreSQL SQL.

You only need basic SQL-if you can read `SELECT name FROM users`, you can follow along.

## What you'll learn

1. What a transaction is  
2. Why ACID matters  
3. **Atomicity** - all or nothing  
4. **Isolation** - concurrent transactions and isolation levels  
5. **Durability** - committed data survives crashes  
6. **Consistency** - valid state in, valid state out  

## What is a transaction?

A **transaction** is a group of SQL statements (`SELECT`, `UPDATE`, `INSERT`, and so on) treated as a **single unit of work**.

If a transaction runs five statements, either all five succeed or-if any one fails-the whole unit is rolled back and none of the changes stick.

Why group statements? Real workflows depend on multiple steps staying in sync. If one step fails mid-way, partial updates leave money, stock, or seats wrong.

### Example: e-commerce order

1. Check product availability  
2. Deduct money from the customer  
3. Reduce stock  
4. Create the order record  

If payment fails, the order must not be created. All steps form **one transaction**.

Without a transaction: statement 2 might succeed (money deducted) while statement 4 fails (no order)-money gone, nothing purchased.

```sql
BEGIN;

-- 1. Check product availability (and lock the row)
SELECT stock
FROM products
WHERE product_id = 101
FOR UPDATE;

-- 2. Deduct money from customer account
UPDATE customers
SET balance = balance- 500
WHERE customer_id = 1
  AND balance >= 500;

-- 3. Reduce stock quantity
UPDATE products
SET stock = stock- 1
WHERE product_id = 101
  AND stock > 0;

-- 4. Create order record
INSERT INTO orders (customer_id, product_id, amount)
VALUES (1, 101, 500);

COMMIT;
```

`BEGIN` starts the transaction; `COMMIT` ends it successfully. Everything between them is one atomic unit.

### Example: ticket booking

1. Check seat availability  
2. Block the seat  
3. Take payment  
4. Confirm booking  

If payment fails after the seat is blocked, the seat must be released. Outside a transaction, you can block a seat and never get paid.

```sql
BEGIN;

-- 1. Check seat availability and lock it
SELECT id
FROM seats
WHERE trip_id = 1
  AND seat_number = 'A1'
  AND status = 'available'
FOR UPDATE;

-- 2. Block the seat
UPDATE seats
SET status = 'blocked'
WHERE trip_id = 1
  AND seat_number = 'A1';

-- 3. Create booking
INSERT INTO bookings (user_id, trip_id, seat_id, status)
VALUES (1, 1, 10, 'blocked');

-- 4. Record payment
INSERT INTO payments (booking_id, amount, status)
VALUES (1, 500.00, 'success');

-- 5. Confirm booking
UPDATE bookings
SET status = 'confirmed'
WHERE id = 1;

UPDATE seats
SET status = 'booked'
WHERE id = 10;

COMMIT;
```

In short: a transaction is a bunch of SQL statements executed as one unit. In PostgreSQL, even a single SQL statement is already a transaction.

## Introduction to ACID

**ACID** properties are guarantees that databases provide so transactions are processed reliably-even when something goes wrong (power loss, crashes, concurrent users).

They are a major reason teams choose relational systems such as **PostgreSQL**, **MySQL**, **SQL Server**, and **Oracle**.

| Letter | Property | In one line |
|--------|----------|-------------|
| **A** | Atomicity | All statements succeed, or none do |
| **C** | Consistency | Every transaction moves the DB from one valid state to another |
| **I** | Isolation | Concurrent transactions don't corrupt each other's work |
| **D** | Durability | After `COMMIT`, changes survive crashes |

Concepts are the same across engines. Examples below use PostgreSQL (`psql`). You can apply the same ideas in Go, Java, TypeScript, or any ORM.

Install PostgreSQL from the [official downloads page](https://www.postgresql.org/download/) if needed.

### Setup: banking demo database

```sql
CREATE DATABASE acid_tutorial;
```

Connect to it:

```sql
\c acid_tutorial
```

Create accounts and seed data:

```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    balance INT NOT NULL
);

INSERT INTO accounts (name, balance)
VALUES
    ('Shivam', 5000),
    ('Rohit', 2000),
    ('Aman', 3000),
    ('Rahul', 3000);
```

A simple transfer:

```sql
BEGIN;

UPDATE accounts SET balance = balance- 500 WHERE name = 'Rohit';
UPDATE accounts SET balance = balance + 500 WHERE name = 'Rahul';

COMMIT;
```

Both statements apply together: Rohit’s balance decreases by 500, Rahul’s increases by 500. That’s the baseline for the ACID demos below.

## Atomicity

> Either the entire transaction happens, or nothing happens.

If five statements are in a transaction and the third fails (network blip, crash, logic error), statements already run are rolled back. From the outside, the transaction never happened.

### Simulate a failure

```sql
BEGIN;

UPDATE accounts SET balance = balance- 300 WHERE name = 'Shivam';

-- Simulate an error
SELECT 1 / 0;

UPDATE accounts SET balance = balance + 300 WHERE name = 'Aman';

COMMIT;
```

`SELECT 1 / 0` raises `ERROR: division by zero`. PostgreSQL aborts the transaction. Shivam’s debit is **not** kept-the balance is unchanged.

Check:

```sql
SELECT name, balance FROM accounts WHERE name = 'Shivam';
-- balance still 5000 (or whatever it was before this failed tx)
```

In production, the “error” might be a process kill or power cut; atomicity still rolls incomplete work back.

Without `BEGIN`/`COMMIT`, the first `UPDATE` could commit on its own while the second never runs-exactly the inconsistent state transactions exist to prevent.

## Isolation

**Isolation** controls how much one transaction can see (or be affected by) other transactions running at the same time.

When many users hit the app at once, the server opens concurrent DB transactions. A core design question: can another session see your updates **before** you `COMMIT`? Isolation levels answer that.

### Concurrency anomalies

Three classic problems:

#### 1. Dirty read

Transaction **T1** reads data written by **T2** that has not committed yet. If T2 later rolls back, T1 read data that never officially existed.

Example timeline:

1. T2: debit Shivam → balance becomes 4700 (not committed)  
2. T1: reads Shivam’s balance → 4700  
3. T2: fails and rolls back → real balance still 5000  
4. T1 already returned 4700 to the client → **dirty read**

#### 2. Nonrepeatable read

A transaction reads the same row twice and gets different values because another transaction updated and committed between the reads.

1. T1 reads Shivam’s balance → 5000  
2. T2 updates Shivam and commits → 5500  
3. T1 reads again → 5500  

T1 didn’t update the row; the value still “changed by itself.”

#### 3. Phantom read

A query run twice returns a different **set of rows** (not just different column values) because another transaction inserted or deleted rows that match the filter.

1. T1: all orders over $100 → 10 rows  
2. T2: inserts a new order over $100 and commits  
3. T1: same query → 11 rows (a “phantom” appeared)

Phantoms change **which rows exist** for a predicate; nonrepeatable reads change **values of rows already seen**.

### Isolation levels

Standard SQL defines four levels. Stricter levels mean stronger consistency-and often more locking or aborts under load. Pick based on the app’s needs.

| Isolation level | Dirty read | Nonrepeatable read | Phantom read |
|-----------------|------------|--------------------|--------------|
| READ UNCOMMITTED | Possible | Possible | Possible |
| READ COMMITTED | Prevented | Possible | Possible |
| REPEATABLE READ | Prevented | Prevented | Prevented* |
| SERIALIZABLE | Prevented | Prevented | Prevented |

\*PostgreSQL’s `REPEATABLE READ` also prevents phantom reads in practice (stricter than the SQL standard’s minimum for this level). See the [PostgreSQL isolation docs](https://www.postgresql.org/docs/current/transaction-iso.html).

PostgreSQL implements **READ COMMITTED**, **REPEATABLE READ**, and **SERIALIZABLE**. It does **not** implement true `READ UNCOMMITTED` (requesting it behaves like `READ COMMITTED`).

### Read Committed (default)

Default if you don’t specify a level: no dirty reads; nonrepeatable and phantom reads can still happen.

```sql
BEGIN; -- isolation is READ COMMITTED by default

SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance- 100 WHERE id = 1;

COMMIT;
```

#### Two-session demo

Open two `psql` sessions connected to `acid_tutorial`.

**Session A:**

```sql
BEGIN;
SELECT balance FROM accounts WHERE name = 'Shivam';
-- e.g. 5000
```

**Session B:**

```sql
BEGIN;
UPDATE accounts SET balance = balance + 500 WHERE name = 'Shivam';
-- do not commit yet
```

**Session A again (before B commits):**

```sql
SELECT balance FROM accounts WHERE name = 'Shivam';
-- still 5000 - no dirty read of B's uncommitted change
```

**Session B:**

```sql
COMMIT;
```

**Session A (after B commits):**

```sql
SELECT balance FROM accounts WHERE name = 'Shivam';
-- now 5500 - nonrepeatable read within the same transaction

COMMIT;
```

So at this level: **no dirty reads**, but **nonrepeatable reads** (and phantoms, if you set them up) can appear.

**When to use:** Default for most apps-product browsing, profile updates, typical CRUD. Fine for ~most use cases unless you need a stable snapshot for the whole transaction.

### Repeatable Read

Stricter than Read Committed. Within a transaction you see a **stable snapshot**: dirty reads, nonrepeatable reads, and (in PostgreSQL) phantom reads are prevented for that snapshot.

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1;
UPDATE accounts SET balance = balance- 100 WHERE id = 1;

COMMIT;
```

#### Two-session demo

**Session A:**

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE name = 'Shivam';
-- e.g. 5500
```

**Session B:**

```sql
UPDATE accounts SET balance = balance + 500 WHERE name = 'Shivam';
COMMIT;
-- committed balance is now 6000
```

**Session A again:**

```sql
SELECT balance FROM accounts WHERE name = 'Shivam';
-- still 5500 - snapshot is fixed for this transaction
COMMIT;
```

Both selects in A return the same value even though B committed a change in between.

**When to use:** You need a consistent view for the whole transaction-e.g. check availability, then insert a reservation, without mid-flight value changes confusing your logic.

### Serializable

Strongest level. The database behaves as if transactions ran **one at a time** (serial order), even when they actually overlap.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

UPDATE accounts SET balance = balance- 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

PostgreSQL may let concurrent serializable transactions start, then check for conflicts at commit. If a conflict would break serializability, one transaction fails:

```text
ERROR:  could not serialize access due to concurrent update
```

#### Conflict sketch

```sql
-- T1
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT balance FROM accounts WHERE id = 1; -- reads current balance
UPDATE accounts SET balance = balance- 100 WHERE id = 1;

-- T2 (overlapping)
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE accounts SET balance = balance- 200 WHERE id = 1;
COMMIT; -- succeeds

-- T1
COMMIT; -- may fail with serialization error
```

If T1 read a row and T2 modified that row concurrently, PostgreSQL may abort T1 so the result still matches some serial order of the two transactions.

Application code should **retry** failed serializable transactions when that error appears.

**When to use:** Payments, inventory allocation, financial ledgers-places where incorrect interleaving is worse than occasional retries.

## Durability

> Once `COMMIT` succeeds, the data must not be lost.

PostgreSQL relies on:

- **WAL** (Write-Ahead Log)  
- **fsync** / disk flush policies  
- Recovery by replaying WAL after a crash  

Typical commit path:

1. Transaction reaches `COMMIT`  
2. Changes are recorded in the WAL  
3. WAL is flushed to durable storage  
4. Then commit is acknowledged to the client  

If the server dies after a successful commit, recovery replays WAL and restores those changes. Mentally: **successful `COMMIT` means the effects will persist** across restarts (assuming correctly configured storage and no catastrophic disk loss).

Internals of WAL and checkpoints go deep; for ACID, remember that durability is why “committed” is a strong promise.

## Consistency

**Consistency** means every committed transaction takes the database from one **valid** state to another valid state-respecting schema rules, constraints, and business invariants.

Rules include:

- Primary key and unique constraints  
- Foreign keys  
- Check constraints  
- Data types  
- Triggers and other declarative/enforced rules  

The database enforces what you declare; application design chooses the right constraints and transaction boundaries. Atomicity, isolation, and durability all support consistency: if any ACID property fails, “valid state” can break.

### Constraints

```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    balance INT CHECK (balance >= 0)
);

INSERT INTO accounts (balance) VALUES (100); -- ok
INSERT INTO accounts (balance) VALUES (-50); -- ERROR: violates CHECK constraint
```

A statement that violates a constraint aborts (and with a multi-statement transaction, you roll back the unit). That keeps balances and references valid.

### Triggers

Use triggers when rules are too complex for simple checks:

```sql
CREATE FUNCTION ensure_balance() RETURNS trigger AS $$
BEGIN
    IF NEW.balance < 0 THEN
        RAISE EXCEPTION 'Balance cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_balance
BEFORE INSERT OR UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION ensure_balance();
```

```sql
INSERT INTO accounts (name, balance) VALUES ('Mohit', 100);
-- ok

INSERT INTO accounts (name, balance) VALUES ('Messi',-50);
-- ERROR: Balance cannot be negative

UPDATE accounts SET balance =-20 WHERE id = 1;
-- ERROR: Balance cannot be negative
```

Any transaction that breaks the rule is rejected so the database stays consistent.

## Putting it together

| Property | Practical takeaway |
|----------|--------------------|
| **Atomicity** | Wrap multi-step business ops in `BEGIN` … `COMMIT`; use `ROLLBACK` on failure |
| **Consistency** | Model rules with constraints, FKs, checks, and careful app logic |
| **Isolation** | Default to Read Committed; raise the level when concurrent bugs show up |
| **Durability** | Trust `COMMIT` only after it succeeds; design retries for serialization failures |

Transactions turn several SQL statements into one reliable unit. ACID is why that unit stays correct under errors and concurrency-the reason banking-style transfers and seat bookings can be implemented safely on PostgreSQL.

## Further reading

- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)  
- [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)  
- [Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html)  
