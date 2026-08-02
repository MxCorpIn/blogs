---
title: "Top 20 Java Scenario-Based Interview Questions for Experienced Developers"
description: "Practice production-style Java interview scenarios: collections, concurrency, JVM, immutability, caching, retries, and design-problem, approach, tradeoff."
type: guide
category: career
tags: [java, interviews, concurrency, jvm, backend]
keywords: [java interview questions, scenario based java, java concurrency interview, experienced java developer interview]
publishedAt: 2026-01-13
updatedAt: 2026-01-13
author: ossium
featured: false
---

Scenario-based Java interviews test one thing: **can you apply Java to real production problems?** Not recite definitions.

For experienced roles, expect depth in:

- Concurrency and multithreading  
- JVM and memory  
- Collections and performance tradeoffs  
- Java 8+ APIs  
- Design patterns and edge cases  

Practice as **problem → approach → tradeoff**.

## 1. Large list of objects-remove duplicates efficiently?

Use a `Set`.

- `HashSet` - fastest  
- `LinkedHashSet` - preserves insertion order  

For custom types, implement correct `equals()` / `hashCode()`.

```java
List<Employee> list = ...;
Set<Employee> unique = new LinkedHashSet<>(list);
List<Employee> result = new ArrayList<>(unique);
```

## 2. Handle `NullPointerException` in production?

Don’t “catch and pray.” Prevent:

- Validate at boundaries (API inputs)  
- Prefer empty collections over null  
- Use `Optional` only when it clarifies APIs  

```java
List<Order> orders = Optional.ofNullable(service.getOrders())
    .orElse(Collections.emptyList());
```

## 3. Thread-safe Singleton?

Practical options:

- **Enum singleton** - strong against serialization/reflection quirks  
- **Bill Pugh holder** - lazy + thread-safe  

```java
class Singleton {
  private Singleton() {}
  private static class Holder {
    private static final Singleton I = new Singleton();
  }
  public static Singleton getInstance() {
    return Holder.I;
  }
}
```

## 4. Checked exception without try-catch in the caller?

Propagate with `throws`:

```java
void readFile() throws IOException {
  // ...
}
```

## 5. Design a cache in Java?

Depends on needs:

- Simple in-memory: `ConcurrentHashMap`  
- Production local: Caffeine / Ehcache  
- Distributed: Redis  
- Always discuss **eviction** (LRU/TTL) and **invalidation** (the hard part)

## 6. Concurrent modification while iterating?

- `Iterator.remove()` when mutating during iteration  
- `CopyOnWriteArrayList` for read-heavy lists  
- `ConcurrentHashMap` for concurrent maps  

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
  if (it.next().equals("X")) {
    it.remove();
  }
}
```

## 7. Find a memory leak?

Tools: VisualVM, JProfiler, YourKit, Eclipse MAT. Take a heap dump; focus on **retained size**. Common causes: static references, caches without eviction, unclosed resources.

## 8. Create an immutable class?

- `final` class  
- `private final` fields  
- No setters  
- Defensive copies for mutable inputs  

```java
public final class Person {
  private final String name;
  private final List<String> tags;

  public Person(String name, List<String> tags) {
    this.name = name;
    this.tags = List.copyOf(tags);
  }

  public String name() { return name; }
  public List<String> tags() { return tags; }
}
```

## 9. Sort employees by salary, then name?

```java
employees.stream()
  .sorted(
    Comparator.comparing(Employee::getSalary)
      .thenComparing(Employee::getName)
  )
  .toList();
```

## 10. Safely stop a thread?

Use interruption or a `volatile` flag. Avoid deprecated `Thread.stop()`.

```java
class Worker implements Runnable {
  private volatile boolean running = true;

  public void stop() { running = false; }

  public void run() {
    while (running) {
      // work
    }
  }
}
```

## 11. Exceptions in multi-threaded apps?

- `Thread.setUncaughtExceptionHandler` for raw threads  
- For `ExecutorService`, inspect `Future.get()` (`ExecutionException`)  

## 12. Detect deadlock?

- `jstack`, `jconsole`, VisualVM  
- Programmatically: `ThreadMXBean.findDeadlockedThreads()`  

## 13. Ensure resource cleanup (file/DB)?

**try-with-resources** (preferred):

```java
try (BufferedReader br = Files.newBufferedReader(path)) {
  return br.readLine();
}
```

## 14. Prevent method overriding?

Mark the method `final`. Prevent inheritance with a `final` class.

## 15. Compare two JSON strings logically?

Parse to structured trees/maps; don’t compare raw string equality.

```java
ObjectMapper om = new ObjectMapper();
JsonNode a = om.readTree(json1);
JsonNode b = om.readTree(json2);
boolean same = a.equals(b);
```

## 16. Process large files without OOM?

Stream line-by-line: `BufferedReader` or `Files.lines()` (close the stream).

## 17. Implement retry logic?

Exponential backoff + max attempts. Production: Resilience4j / Spring Retry.

```java
int attempts = 0;
while (attempts < 3) {
  try {
    callApi();
    break;
  } catch (Exception e) {
    attempts++;
    Thread.sleep(200L * attempts);
  }
}
```

## 18. Immutability in multi-threaded code?

Immutability is the simplest thread-safety: `final` fields, no setters, no shared mutable state, immutable collections.

## 19. Schedule a task every 10 seconds?

Prefer `ScheduledExecutorService` over `Timer`:

```java
ScheduledExecutorService ses = Executors.newSingleThreadScheduledExecutor();
ses.scheduleAtFixedRate(task, 0, 10, TimeUnit.SECONDS);
```

## 20. Producer–consumer design?

`BlockingQueue` is the cleanest building block:

```java
BlockingQueue<String> q = new ArrayBlockingQueue<>(100);

// producer
q.put("msg");

// consumer
String msg = q.take();
```

## How to practice

For each item, rehearse:

1. **Clarifying questions** (scale, latency, consistency)  
2. **Default approach** with API choices  
3. **Tradeoffs** and failure modes  

Interviewers care less about trivia and more about whether you’ve **felt** these problems in production.
