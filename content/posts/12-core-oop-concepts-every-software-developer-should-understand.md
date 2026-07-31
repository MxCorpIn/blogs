---
title: "12 Core OOP Concepts Every Software Developer Should Understand"
description: "Beginner-friendly OOP: classes, objects, interfaces, encapsulation, inheritance, polymorphism, abstraction, composition, and more—with Java examples."
type: guide
category: beginners
tags: [oop, java, programming, software-design, beginners]
keywords: [oop concepts, object oriented programming, encapsulation inheritance polymorphism, java oop tutorial]
publishedAt: 2026-06-26
updatedAt: 2026-06-26
author: ossium
featured: false
---

Object-oriented programming (OOP) can sound heavy at first—classes, objects, inheritance, polymorphism, abstraction. Underneath the jargon is a simple idea: **organize code around real-world things** instead of scattering data and logic across unrelated functions.

In a real project you model users, orders, payments, products, carts, invoices, and notifications. OOP keeps related data and related actions together so the codebase stays easier to understand, change, test, and maintain as it grows.

OOP is not only “create objects.” It is how you model problems, manage complexity, reduce duplication, and avoid a system that breaks every time you touch it. Below are **12 core concepts** every software developer should understand, explained simply with Java examples.

## Core building blocks

### 1. Classes

A **class** is a blueprint. It defines what data an object will hold and what actions it can perform. It does not represent one concrete thing by itself—only the structure.

Think of a car. A car has information (`brand`, `color`, `speed`) and actions (`start`, `stop`, `increaseSpeed`). A house blueprint shows rooms and walls; you cannot live in the blueprint—you build a house from it. Same idea: the class is the plan; objects are the instances.

```java
public class Car {
    private String brand;
    private String color;
    private int speed;

    public Car(String brand, String color) {
        this.brand = brand;
        this.color = color;
        this.speed = 0;
    }

    public void start() {
        System.out.println(brand + " car has started.");
    }

    public void increaseSpeed(int value) {
        speed = speed + value;
        System.out.println("Current speed: " + speed + " km/h");
    }

    public String getDetails() {
        return brand + " - " + color;
    }
}
```

`Car` groups data and behavior in one place instead of loose variables and free-floating functions. A class alone is only a template—you use it by creating objects.

### 2. Objects

If a class is a blueprint, an **object** is a real usable copy of that blueprint. From one `Car` class you can create many cars, each with its own values.

```java
Car car1 = new Car("Toyota", "Red");
Car car2 = new Car("Honda", "Blue");
Car car3 = new Car("Tesla", "Black");
```

`car1`, `car2`, and `car3` share the same structure but hold independent state:

```java
car1.start();
car1.increaseSpeed(40);

car2.start();
car2.increaseSpeed(60);

car3.start();
car3.increaseSpeed(80);
```

Raising `car1`’s speed does not change `car2`. Starting `car2` does not start `car3`. One blueprint can produce many houses; each house can have a different color, owner, and address. **Class = structure. Object = concrete values.**

### 3. Interfaces

An **interface** is a contract. It declares which methods a class must provide, without prescribing how they work. The class chooses the implementation.

Example: a notification system that can send email, SMS, WhatsApp, or push messages. Different channels, one shared job—send a message:

```java
public interface NotificationService {
    void sendMessage(String user, String message);
}
```

```java
public class EmailNotification implements NotificationService {
    @Override
    public void sendMessage(String user, String message) {
        System.out.println("Sending email to " + user + ": " + message);
    }
}

public class SMSNotification implements NotificationService {
    @Override
    public void sendMessage(String user, String message) {
        System.out.println("Sending SMS to " + user + ": " + message);
    }
}

public class WhatsAppNotification implements NotificationService {
    @Override
    public void sendMessage(String user, String message) {
        System.out.println("Sending WhatsApp message to " + user + ": " + message);
    }
}
```

All three implement `sendMessage()` differently. Callers can depend on the interface:

```java
public class AlertManager {
    private NotificationService notificationService;

    public AlertManager(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    public void sendAlert(String user) {
        notificationService.sendMessage(user, "Your order has been shipped.");
    }
}
```

`AlertManager` does not care whether delivery is email, SMS, or WhatsApp. Switching channels means passing a different implementation—not rewriting `AlertManager`:

```java
NotificationService email = new EmailNotification();
AlertManager alert1 = new AlertManager(email);
alert1.sendAlert("Shivam");

NotificationService sms = new SMSNotification();
AlertManager alert2 = new AlertManager(sms);
alert2.sendAlert("Rahul");
```

Adding push later is a new class that implements the same interface:

```java
public class PushNotification implements NotificationService {
    @Override
    public void sendMessage(String user, String message) {
        System.out.println("Sending push notification to " + user + ": " + message);
    }
}
```

**Interface = what must be done. Class = how it is done.**

## The four pillars of OOP

### 4. Encapsulation

**Encapsulation** keeps data and methods together in a class and prevents other code from freely mutating internal state. Important fields sit behind controlled access—like a safe you open only with the right keys.

A bank account has a holder name and balance, plus deposit, withdraw, and check-balance operations. If `balance` is public, invalid updates are trivial:

```java
public class BankAccount {
    public String accountHolder;
    public double balance;
}

BankAccount account = new BankAccount();
account.accountHolder = "Shivam";
account.balance = 5000;
account.balance = -10000; // invalid, but allowed
```

With encapsulation, fields are private and change only through validated methods:

```java
public class BankAccount {
    private String accountHolder;
    private double balance;

    public BankAccount(String accountHolder, double openingBalance) {
        this.accountHolder = accountHolder;
        this.balance = openingBalance >= 0 ? openingBalance : 0;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance = balance + amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Deposit amount must be positive.");
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance = balance - amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Invalid withdrawal amount.");
        }
    }

    public double getBalance() {
        return balance;
    }

    public String getAccountHolder() {
        return accountHolder;
    }
}
```

```java
BankAccount account = new BankAccount("Shivam", 5000);
account.deposit(2000);
account.withdraw(1000);
System.out.println(account.getBalance());
// account.balance = -10000; // not allowed
```

The class owns the rules. Later you can add minimum balance, fees, or daily limits inside `BankAccount` without teaching every caller those details. **Encapsulation protects data by controlling how it is accessed and changed.**

### 5. Abstraction

**Abstraction** hides unnecessary detail and exposes only what callers need. You use a capability without knowing every step behind it.

At an ATM you insert a card, enter a PIN, choose withdraw, enter an amount, and take cash. Behind the scenes the machine verifies the card, talks to the bank, checks balance, updates the account, and prints a receipt. You only see a simple interface.

Same idea in code. A food-delivery flow has many steps; the public API can be one method:

```java
public class FoodOrder {
    public void placeOrder(String foodItem, String userLocation) {
        checkRestaurantAvailability(foodItem);
        calculateDeliveryCharge(userLocation);
        applyDiscount();
        assignDeliveryPartner();
        sendConfirmation();
        System.out.println("Your order for " + foodItem + " has been placed successfully.");
    }

    private void checkRestaurantAvailability(String foodItem) {
        System.out.println("Checking restaurant availability for " + foodItem);
    }

    private void calculateDeliveryCharge(String userLocation) {
        System.out.println("Calculating delivery charge for " + userLocation);
    }

    private void applyDiscount() {
        System.out.println("Applying available discount.");
    }

    private void assignDeliveryPartner() {
        System.out.println("Assigning delivery partner.");
    }

    private void sendConfirmation() {
        System.out.println("Sending order confirmation.");
    }
}
```

```java
FoodOrder order = new FoodOrder();
order.placeOrder("Pizza", "Delhi");
```

Callers use `placeOrder()`. They do not orchestrate availability checks, charges, discounts, or partner assignment. Change how partners are assigned inside `assignDeliveryPartner()` and the public call site stays the same.

**Encapsulation protects internal data. Abstraction hides internal process.** Related ideas, different problems.

### 6. Inheritance

**Inheritance** lets one class reuse properties and methods from another. The source is the **parent** (or base) class; the receiver is the **child** (or subclass). Use it to avoid repeating shared structure when a true parent–child relationship exists.

A company may have full-time employees, part-time employees, and interns. They share name, employee ID, department, and “show details,” but differ in pay:

```java
public class Employee {
    protected String name;
    protected String employeeId;
    protected String department;

    public Employee(String name, String employeeId, String department) {
        this.name = name;
        this.employeeId = employeeId;
        this.department = department;
    }

    public void showDetails() {
        System.out.println("Name: " + name);
        System.out.println("Employee ID: " + employeeId);
        System.out.println("Department: " + department);
    }
}
```

```java
public class FullTimeEmployee extends Employee {
    private double monthlySalary;

    public FullTimeEmployee(
            String name,
            String employeeId,
            String department,
            double monthlySalary) {
        super(name, employeeId, department);
        this.monthlySalary = monthlySalary;
    }

    public void calculateSalary() {
        System.out.println("Monthly Salary: " + monthlySalary);
    }
}

public class Intern extends Employee {
    private double stipend;

    public Intern(
            String name,
            String employeeId,
            String department,
            double stipend) {
        super(name, employeeId, department);
        this.stipend = stipend;
    }

    public void calculateStipend() {
        System.out.println("Monthly Stipend: " + stipend);
    }
}
```

```java
FullTimeEmployee emp1 = new FullTimeEmployee(
    "Shivam", "EMP101", "Engineering", 60000
);
emp1.showDetails();
emp1.calculateSalary();

Intern intern1 = new Intern(
    "Rahul", "INT201", "Development", 15000
);
intern1.showDetails();
intern1.calculateStipend();
```

Both reuse `showDetails()` from `Employee` and add their own behavior.

Prefer inheritance when there is a clear **is-a** relationship:

- A full-time employee **is an** employee
- An intern **is an** employee
- A car **is a** vehicle
- A dog **is an** animal

Do not inherit only to reuse a few lines of code. If the relationship is not natural, prefer composition.

**Inheritance reuses and extends parent behavior when a real is-a link exists.**

### 7. Polymorphism

**Polymorphism** means “many forms”: the same operation can behave differently depending on the object. In a payment system, credit card, UPI, and PayPal all expose `pay()`, but each implements it differently.

Two common forms:

1. **Compile-time polymorphism** — same method name, different parameters (**method overloading**)
2. **Runtime polymorphism** — subclasses (or interface implementations) override a method (**method overriding**)

Runtime polymorphism shows up constantly in real code:

```java
public interface PaymentMethod {
    void pay(double amount);
}
```

```java
public class CreditCardPayment implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " using Credit Card.");
    }
}

public class UpiPayment implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " using UPI.");
    }
}

public class PayPalPayment implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " using PayPal.");
    }
}
```

```java
import java.util.List;

public class Checkout {
    public static void main(String[] args) {
        List<PaymentMethod> paymentMethods = List.of(
            new CreditCardPayment(),
            new UpiPayment(),
            new PayPalPayment()
        );

        for (PaymentMethod paymentMethod : paymentMethods) {
            paymentMethod.pay(1000);
        }
    }
}
```

The loop does not branch on concrete type. It calls `paymentMethod.pay(1000)`, and the JVM runs the implementation for the actual object. Adding wallet payment is a new class:

```java
public class WalletPayment implements PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " using Wallet.");
    }
}
```

**Polymorphism lets different objects respond to the same method in their own way**, so you code against a common type and keep extension cheap.

## Object relationships: how classes work together

### 8. Association

**Association** means one object knows about another, but both can exist independently. Ownership is weak.

A teacher and a student are associated: a teacher can teach many students; a student can learn from many teachers. If one leaves, the other still exists.

```java
import java.util.ArrayList;
import java.util.List;

public class Teacher {
    private String name;
    private List<Student> students;

    public Teacher(String name) {
        this.name = name;
        this.students = new ArrayList<>();
    }

    public void addStudent(Student student) {
        students.add(student);
    }

    public void showStudents() {
        System.out.println(name + " teaches:");
        for (Student student : students) {
            System.out.println(student.getName());
        }
    }
}

public class Student {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Teacher teacher = new Teacher("Mr. Sharma");
        Student student1 = new Student("Aman");
        Student student2 = new Student("Priya");

        teacher.addStudent(student1);
        teacher.addStudent(student2);
        teacher.showStudents();
    }
}
```

Students are created separately; the teacher holds references, not exclusive ownership.

Other associations: a doctor treats patients, a driver drives a car, a customer places an order. **Objects are connected and remain independent.**

### 9. Aggregation

**Aggregation** is a special association: one object **has** another, but the part can still live on its own. Ownership is weak “has-a.”

A school has teachers. If the school closes, teachers still exist and can join another school.

```java
import java.util.ArrayList;
import java.util.List;

public class School {
    private String name;
    private List<Teacher> teachers;

    public School(String name) {
        this.name = name;
        this.teachers = new ArrayList<>();
    }

    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
    }

    public void showTeachers() {
        System.out.println("Teachers in " + name + ":");
        for (Teacher teacher : teachers) {
            System.out.println(teacher.getName());
        }
    }
}

public class Teacher {
    private String name;
    private String subject;

    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }

    public String getName() {
        return name + " teaches " + subject;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Teacher teacher1 = new Teacher("Mr. Sharma", "Math");
        Teacher teacher2 = new Teacher("Ms. Verma", "Science");

        School school = new School("Green Valley School");
        school.addTeacher(teacher1);
        school.addTeacher(teacher2);
        school.showTeachers();

        School anotherSchool = new School("Sunrise Public School");
        anotherSchool.addTeacher(teacher1);
    }
}
```

Teachers are created outside `School` and only referenced. The same teacher can belong to another school. **The whole has parts; the parts survive without the whole.**

Other examples: a department has employees, a library has books, a team has players.

### 10. Composition

**Composition** is the stronger “has-a.” One object owns another, and the **part should not exist without the whole**. The child object’s lifetime is tied to the parent’s.

A house **has** rooms. If the house is destroyed, those rooms do not continue as independent rooms of that house. An order **has** order lines that only make sense as part of that order.

In code, the parent often creates the parts and does not expose them as free-standing entities for reuse elsewhere:

```java
import java.util.ArrayList;
import java.util.List;

public class House {
    private String address;
    private final List<Room> rooms;

    public House(String address, int bedroomCount) {
        this.address = address;
        this.rooms = new ArrayList<>();
        rooms.add(new Room("Kitchen"));
        rooms.add(new Room("Living Room"));
        for (int i = 1; i <= bedroomCount; i++) {
            rooms.add(new Room("Bedroom " + i));
        }
    }

    public void showRooms() {
        System.out.println("Rooms in house at " + address + ":");
        for (Room room : rooms) {
            System.out.println("- " + room.getName());
        }
    }

    private static class Room {
        private final String name;

        private Room(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
```

```java
House house = new House("12 Maple Street", 2);
house.showRooms();
// Rooms are created and owned by House; they are not independent objects
// meant to be reused after the house is gone.
```

Contrast with aggregation: teachers can move between schools. In composition, rooms belong to that house. **Strong ownership and shared lifetime.**

Other examples: a car has an engine (in many models the engine is not shared as a free-floating part of another car at the same time), a document has paragraphs, a UI window has its child controls.

Use composition when parts are meaningless or unsafe without the owner. Prefer aggregation when parts have independent life cycles.

### 11. Dependency

**Dependency** means one class **uses** another temporarily. It does not own it or keep it as permanent state. Among the relationships here, it is the weakest.

A food-order service may use a message sender only while placing an order:

```java
public class MessageSender {
    public void sendMessage(String phoneNumber, String message) {
        System.out.println("Sending message to " + phoneNumber + ": " + message);
    }
}

public class FoodOrderService {
    public void placeOrder(String foodItem, String phoneNumber, MessageSender messageSender) {
        System.out.println("Order placed for: " + foodItem);
        messageSender.sendMessage(
            phoneNumber,
            "Your order for " + foodItem + " has been placed successfully."
        );
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        FoodOrderService orderService = new FoodOrderService();
        MessageSender messageSender = new MessageSender();
        orderService.placeOrder("Pizza", "9876543210", messageSender);
    }
}
```

`FoodOrderService` does not store `MessageSender` as a field. The link exists only while `placeOrder()` runs. That is a **uses-a** relationship.

Other examples: a report generator uses a printer, checkout uses a discount calculator, a controller uses a validator, an uploader uses a compressor.

### 12. Realization

**Realization** is the relationship between an interface and the class that implements it. The interface is the contract; the class supplies the working code.

A delivery app might support bike, car, and drone partners. All must deliver an order:

```java
public interface DeliveryPartner {
    void deliverOrder(String orderId, String address);
}
```

```java
public class BikeDelivery implements DeliveryPartner {
    @Override
    public void deliverOrder(String orderId, String address) {
        System.out.println("Delivering order " + orderId + " by bike to " + address);
    }
}

public class CarDelivery implements DeliveryPartner {
    @Override
    public void deliverOrder(String orderId, String address) {
        System.out.println("Delivering order " + orderId + " by car to " + address);
    }
}

public class DroneDelivery implements DeliveryPartner {
    @Override
    public void deliverOrder(String orderId, String address) {
        System.out.println("Delivering order " + orderId + " by drone to " + address);
    }
}
```

```java
public class DeliveryService {
    private DeliveryPartner deliveryPartner;

    public DeliveryService(DeliveryPartner deliveryPartner) {
        this.deliveryPartner = deliveryPartner;
    }

    public void shipOrder(String orderId, String address) {
        deliveryPartner.deliverOrder(orderId, address);
    }
}
```

```java
DeliveryPartner partner = new BikeDelivery();
DeliveryService service = new DeliveryService(partner);
service.shipOrder("ORD101", "Delhi");
```

`DeliveryService` depends on `DeliveryPartner`, not a concrete partner. A new `RobotDelivery` can implement the same interface without rewriting the service:

```java
public class RobotDelivery implements DeliveryPartner {
    @Override
    public void deliverOrder(String orderId, String address) {
        System.out.println("Delivering order " + orderId + " by robot to " + address);
    }
}
```

**Realization connects the contract to the implementation.** It also enables polymorphism: many classes behind one type, each with its own behavior.

## How the 12 concepts fit together

| Concept | One-line idea |
| --- | --- |
| Class | Blueprint for data and behavior |
| Object | Concrete instance of a class |
| Interface | Contract of required behavior |
| Encapsulation | Protect data; expose safe operations |
| Abstraction | Hide complexity; show essentials |
| Inheritance | Reuse via is-a hierarchy |
| Polymorphism | Same call, different behavior by type |
| Association | Related objects, independent lives |
| Aggregation | Has-a with independent parts |
| Composition | Has-a with owned, dependent parts |
| Dependency | Temporary uses-a relationship |
| Realization | Class implements an interface |

## Final thoughts

Once these ideas click, you will spot them in backends, mobile apps, frameworks, design patterns, and low-level design interviews.

Practice with small examples and map them to real domains—accounts, orders, notifications, payments. That is how OOP stops being vocabulary and becomes how you structure software.
