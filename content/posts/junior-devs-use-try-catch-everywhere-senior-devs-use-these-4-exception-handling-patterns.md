---
title: "Junior Devs Use try-catch Everywhere. Senior Devs Use These 4 Patterns"
description: "Why wrapping every method in try-catch hides bugs-and four senior patterns: validation first, exception hierarchy, @ControllerAdvice, and Result objects."
type: article
category: tools
tags: [java, spring-boot, error-handling, software-engineering, backend]
keywords: [exception handling best practices, try catch anti pattern, spring controlleradvice, result object pattern, java custom exceptions]
publishedAt: 2026-02-01
updatedAt: 2026-05-01
author: ossium
featured: false
---

A codebase full of try-catch around every controller, service, repository, and utility is not “safe coding.” It’s often a **silent failure factory**.

When every method swallows errors, you get production incidents with no logs, no alerts, and no trail until a customer complains. **Wrapping everything in try-catch is fear-based programming**, not defensive design. Senior engineers reach for try-catch last-only when it’s the right tool.

## Why juniors default to try-catch

Something might fail? Wrap it. Compiler complains? Catch it. The tutorial had a try-catch? Copy it.

Try-catch is **reactive**. Overusing it says: “I don’t know what will go wrong, so I’ll catch anything.” Seniors ask first: **Can I prevent this from going wrong?**

## Pattern 1: Validate first, catch never

The most common misuse is catching invalid input after it already broke something.

```java
// ❌ Catching what validation should have prevented
@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody UserRequest request) {
    try {
        User user = userService.create(request);
        return ResponseEntity.ok(user);
    } catch (NullPointerException e) {
        return ResponseEntity.badRequest().body(null);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(null);
    }
}
```

**Prefer validation at the boundary:**

```java
// ✅ Validate at the door
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserRequest request) {
    User user = userService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(user);
}

public class UserRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Must be a valid email")
    @NotNull(message = "Email is required")
    private String email;

    @Min(value = 18, message = "Must be at least 18")
    private int age;
}
```

**Rule:** If you’re catching exceptions caused by bad input, you have a **validation** problem-not an exception-handling problem.

## Pattern 2: A custom exception hierarchy

Juniors catch `Exception`. Seniors make failures **self-explanatory**.

```java
// ❌ Generic exceptions tell you nothing useful
try {
    orderService.process(order);
} catch (Exception e) {
    logger.error("Something failed: " + e.getMessage());
    return ResponseEntity.internalServerError().build();
}
```

**Prefer a structured hierarchy:**

```java
public class AppException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public AppException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() { return status; }
    public String getErrorCode() { return errorCode; }
}

public class NotFoundException extends AppException {
    public NotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id, HttpStatus.NOT_FOUND, "NOT_FOUND");
    }
}

public class BusinessRuleViolatedException extends AppException {
    public BusinessRuleViolatedException(String rule) {
        super("Business rule violated: " + rule, HttpStatus.CONFLICT, "BUSINESS_RULE_VIOLATED");
    }
}

// Service: no try-catch required for domain failures
public Order processOrder(OrderRequest request) {
    Order order = orderRepository.findById(request.getOrderId())
        .orElseThrow(()-> new NotFoundException("Order", request.getOrderId()));

    if (order.isAlreadyProcessed()) {
        throw new BusinessRuleViolatedException("Order already processed");
    }
    return orderRepository.save(order);
}
```

When `NotFoundException` is thrown, you already know **what**, **why**, and roughly **which HTTP status**-no guesswork in every catch block.

**Rule:** If you catch a generic exception and then reverse-engineer what failed, your exceptions aren’t specific enough.

## Pattern 3: `@ControllerAdvice` - handle exceptions in one place

Juniors paste the same catch logic across controllers. Seniors centralize it.

```java
// ❌ Same catch block in every controller
@GetMapping("/orders/{id}")
public ResponseEntity<Order> getOrder(@PathVariable Long id) {
    try {
        return ResponseEntity.ok(orderService.findById(id));
    } catch (NotFoundException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}
```

**Prefer one global handler:**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(e.getErrorCode(), e.getMessage()));
    }

    @ExceptionHandler(BusinessRuleViolatedException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(BusinessRuleViolatedException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(e.getErrorCode(), e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String details = e.getBindingResult().getFieldErrors().stream()
            .map(error-> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("VALIDATION_FAILED", details));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception e) {
        logger.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "Something went wrong"));
    }
}

// Controllers stay thin
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderService.findById(id);
}
```

**Rule:** If the same catch block appears in more than one controller, you need a `@ControllerAdvice` (or equivalent central handler).

## Pattern 4: Result objects for expected failures

Not every failure is exceptional. “User not found” can be a **normal outcome**. Using exceptions for routine control flow is expensive and noisy.

```java
// ❌ Exception for a common case
public User findUser(Long id) {
    return userRepository.findById(id)
        .orElseThrow(()-> new NotFoundException("User", id));
}
// Every caller must handle the exception
```

**Prefer explicit results when failure is expected:**

```java
public class Result<T> {
    private final T value;
    private final String error;
    private final boolean success;

    private Result(T value, String error, boolean success) {
        this.value = value;
        this.error = error;
        this.success = success;
    }

    public static <T> Result<T> ok(T value) {
        return new Result<>(value, null, true);
    }

    public static <T> Result<T> failure(String error) {
        return new Result<>(null, error, false);
    }

    public boolean isSuccess() { return success; }
    public T getValue() { return value; }
    public String getError() { return error; }
}

public Result<User> findUser(Long id) {
    return userRepository.findById(id)
        .map(Result::ok)
        .orElse(Result.failure("User not found with id: " + id));
}

Result<User> result = userService.findUser(123L);
if (result.isSuccess()) {
    return ResponseEntity.ok(result.getValue());
}
return ResponseEntity.notFound().build();
```

**Rule:** If a scenario is expected business behavior-not a bug or infrastructure failure-prefer a **Result** (or `Optional`) over throwing.

## Mental model: exceptional vs expected

| Kind | Examples | Handle with |
|------|----------|-------------|
| **Exceptional** | DB down, API timeout, OOM | try-catch, logging, alerts, maybe retry |
| **Expected** | User missing, order already shipped, payment declined | Validation, Result/`Optional`, clean control flow |

Once you categorize failures this way, try-catch usage drops-not because you ignore errors, but because you handle them **honestly**.

## Action plan

1. Replace one “catch bad input” block with `@Valid` (or equivalent).  
2. Replace one `catch (Exception e)` with a **specific** domain exception.  
3. Collapse repeated controller catch blocks into **`@ControllerAdvice`**.  
4. Replace one throw for a routine case with a **Result** / `Optional`.  

Don’t rewrite everything at once. Each change makes failure modes more visible-and that’s the real gap between junior and senior error handling.
