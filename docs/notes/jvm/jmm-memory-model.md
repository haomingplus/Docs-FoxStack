---
title: Java内存模型（JMM）详解
createTime: 2026/01/06 12:21:58
permalink: /jvm/jmm-memory-model/
---
# Java内存模型（JMM）面试题详解

## 一、JMM概述

### 1.1 什么是JMM？

Java内存模型（Java Memory Model，简称JMM）是Java虚拟机规范中定义的一种抽象概念，**不是真实存在的**。它描述了Java程序中各种变量（线程共享变量）的访问规则，以及在JVM中将变量存储到内存和从内存中读取变量这样的底层细节。

### 1.2 为什么需要JMM？

由于不同平台的硬件架构和内存访问方式存在差异，JMM的作用是：
- **屏蔽掉各种硬件和操作系统的内存访问差异**
- 保证Java程序在各种平台下对内存的访问都能得到一致的效果
- 解决多线程场景下的并发问题

---

## 二、JMM的核心概念

### 2.1 主内存与工作内存

JMM规定了所有的变量都存储在**主内存**（Main Memory）中：

```
┌─────────────────────────────────────────────────────┐
│                    主内存（Main Memory）             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │ 共享变量A │  │ 共享变量B │  │ 共享变量C │  ...   │
│  └───────────┘  └───────────┘  └───────────┘       │
└─────────────────────────────────────────────────────┘
        ▲                ▲                ▲
        │                │                │
    ────┴────────        │            ────┴────────
        │    read/load   │          store/write │
        ▼                ▼                ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 线程1工作内存 │   │ 线程2工作内存 │   │ 线程3工作内存 │
│  (本地变量)  │   │  (本地变量)  │   │  (本地变量)  │
│  (变量副本)  │   │  (变量副本)  │   │  (变量副本)  │
└─────────────┘   └─────────────┘   └─────────────┘
```

每个线程都有自己的**工作内存**（Working Memory），工作内存中保存了该线程使用的变量的主内存副本。

### 2.2 内存间的交互操作

JMM定义了8种原子操作来实现主内存与工作内存之间的交互：

| 操作 | 说明 |
|------|------|
| **lock（锁定）** | 作用于主内存，标识变量为线程独占 |
| **unlock（解锁）** | 作用于主内存，释放独占变量 |
| **read（读取）** | 作用于主内存，将变量值传输到工作内存 |
| **load（载入）** | 作用于工作内存，将read的值放入工作内存副本 |
| **use（使用）** | 作用于工作内存，将工作内存值传递给执行引擎 |
| **assign（赋值）** | 作用于工作内存，将执行引擎值赋给工作内存变量 |
| **store（存储）** | 作用于工作内存，将工作内存值传送到主内存 |
| **write（写入）** | 作用于主内存，将store的值放入主内存变量 |

---

## 三、JMM的三大特性

### 3.1 原子性（Atomicity）

**定义**：一个操作或多个操作要么全部执行，要么全部不执行。

**JMM保证**：
- 对基本数据类型变量的读写是原子性的（long和double除外）
- `synchronized`关键字保证原子性
- `lock`和`unlock`保证原子性

```java
// 不是原子操作
int i = 0;  // 步骤1：读取i，步骤2：赋值
i++;        // 步骤1：读取i，步骤2：i+1，步骤3：写回

// 原子操作示例
synchronized (obj) {
    i++;  // 原子性保证
}
```

### 3.2 可见性（Visibility）

**定义**：当一个线程修改了共享变量的值，其他线程能够立即看到修改后的值。

**JMM保证可见性的方式**：
- **volatile**：保证可见性（通过MESI缓存一致性协议）
- **synchronized**：解锁前将工作内存值刷新到主内存
- **final**：final字段在构造器内一旦初始化完成，其他线程可见

```java
// volatile保证可见性
volatile boolean flag = false;

// 线程A
flag = true;  // 立即刷新到主内存

// 线程B
while (!flag) {
    // 能看到线程A的修改
}
```

### 3.3 有序性（Ordering）

**定义**：程序执行的顺序按照代码的先后顺序执行。

**指令重排序**：
编译器和处理器为了优化性能，会对指令序列进行重排序。

**JMM保证有序性的方式**：
- **volatile**：禁止指令重排
- **synchronized**：保证持有同一把锁的两个同步块只能串行进入

---

## 四、happens-before原则

这是JMM中判断数据是否存在竞争、线程是否安全的主要依据。

### 4.1 八大原则

| 原则 | 说明 |
|------|------|
| **程序次序规则** | 单线程内代码执行按顺序，语义依赖的不会被重排 |
| **管程锁定规则** | unlock操作先于对同一把锁的lock操作 |
| **volatile变量规则** | volatile写先于volatile读 |
| **线程启动规则** | Thread对象的start()先于线程动作 |
| **线程终止规则** | 线程的所有操作先于对此线程的终止检测 |
| **线程中断规则** | interrupt()先于中断代码的检测 |
| **对象终结规则** | 构造函数执行结束先于finalize() |
| **传递性** | A先于B，B先于C，则A先于C |

### 4.2 happens-before示例

```java
class VolatileExample {
    int x = 0;
    volatile boolean v = false;

    // 线程A执行
    public void writer() {
        x = 42;      // 1
        v = true;    // 2
    }

    // 线程B执行
    public void reader() {
        if (v == true) {  // 3
            // 这里x一定是42
            System.out.println(x);  // 4
        }
    }
}

/*
 * happens-before关系：
 * 1 happens-before 2（程序次序规则）
 * 2 happens-before 3（volatile规则）
 * 3 happens-before 4（程序次序规则）
 * 结论：1 happens-before 4，因此x=42对线程B可见
 */
```

---

## 五、volatile关键字深入理解

### 5.1 volatile的特性

| 特性 | 说明 |
|------|------|
| 保证可见性 | ✅ 写操作立即刷新到主内存，读操作从主内存读取 |
| 保证有序性 | ✅ 禁止指令重排序（内存屏障） |
| 保证原子性 | ❌ 单次读写是原子的，复合操作不保证 |

### 5.2 volatile内存语义

```
volatile写操作：
工作内存 → 立即刷新到 → 主内存
    ↓
  插入StoreStore屏障（禁止上方普通写与volatile写重排）
  插入StoreLoad屏障（禁止volatile写与下方读重排）

volatile读操作：
主内存 → 立即读取到 → 工作内存
    ↓
  插入LoadLoad屏障（禁止volatile读与下方读重排）
  插入LoadStore屏障（禁止volatile读与下方写重排）
```

### 5.3 volatile不适用场景

```java
// ❌ 不适用：复合操作不保证原子性
volatile int count = 0;
count++;  // 实际是count = count + 1，非原子操作

// ✅ 正确做法：使用AtomicInteger
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();
```

### 5.4 volatile适用场景

**1. 状态标志位**

```java
volatile boolean shutdownRequested;

public void shutdown() {
    shutdownRequested = true;
}

public void doWork() {
    while (!shutdownRequested) {
        // ...
    }
}
```

**2. 单例模式（DCL）**

```java
public class Singleton {
    // volatile禁止指令重排，防止其他线程获取到未初始化完全的对象
    private volatile static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                    // new操作实际分为三步：
                    // 1. 分配内存
                    // 2. 初始化对象
                    // 3. 将引用指向分配的内存
                    // 无volatile可能重排为1→3→2
                }
            }
        }
        return instance;
    }
}
```

**3. 读写锁（一写多读）**

```java
volatile int value;

// 写操作加锁保证原子性
public synchronized void setValue(int value) {
    this.value = value;
}

// 读操作只需volatile保证可见性
public int getValue() {
    return value;
}
```

---

## 六、final域的内存语义

### 6.1 final域的重排序规则

1. **编译器**：final域的写操作，编译器会禁止在构造函数内对final域的读写重排
2. **编译器**：初次读对象引用与初次读该对象包含的final域，不能重排

### 6.2 final域可见性保证

```java
public class FinalExample {
    final int x;  // final变量
    int y;        // 普通变量
    static FinalExample obj;

    public FinalExample() {
        x = 1;   // 1. 写final域
        y = 2;   // 2. 写普通域
    }

    public static void writer() {
        obj = new FinalExample();  // 3. 将对象引用写入共享变量
    }

    public static void reader() {
        FinalExample object = obj;  // 4. 读对象引用
        int a = object.x;  // 5. 读final域
        int b = object.y;  // 6. 读普通域
    }
}

/*
 * happens-before关系：
 * 1 happens-before 2（构造函数内次序）
 * 2 happens-before 3（final规则：构造函数返回前，final域必定初始化完成）
 * 3 happens-before 4（线程启动规则）
 *
 * 结果：
 * - 线程B至少能看到线程A构造对象时final域的正确值
 * - 普通域y可能读不到初始值（指令重排）
 */
```

---

## 七、锁的内存语义

### 7.1 synchronized内存语义

```
线程A（解锁）                    线程B（加锁）
┌─────────────────┐             ┌─────────────────┐
│  工作内存        │             │  工作内存        │
│  ┌───────────┐  │   flush     │  ┌───────────┐  │
│  │  变量副本  │  │────────────→│  │  变量副本  │  │
│  └───────────┘  │             │  └───────────┘  │
└─────────────────┘             └─────────────────┘
        ▲                              │
        │ unlock                       │ lock
        │                              │
        ▼                              ▼
┌─────────────────────────────────────────────────────┐
│                    主内存（Main Memory）             │
└─────────────────────────────────────────────────────┘

happens-before: 线程A解锁 happens-before 线程B加锁
```

### 7.2 锁释放与获取的内存语义

- **释放锁**：将工作内存中的共享变量刷新到主内存
- **获取锁**：将主内存中的共享变量读取到工作内存

---

## 八、JMM与硬件内存架构

### 8.1 硬件内存架构

```
CPU缓存层次结构：

┌─────────────────────────────────────────────────────────┐
│                        CPU核心                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ ALU/寄存器│  │  L1缓存   │  │  L2缓存   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      L3缓存（共享）                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       主内存（RAM）                      │
└─────────────────────────────────────────────────────────┘
```

### 8.2 缓存一致性协议（MESI）

MESI协议用于保证多核CPU缓存的一致性：

| 状态 | 说明 |
|------|------|
| **M（Modified）** | 已修改，当前缓存行与主内存不一致，且该数据只存在于当前缓存 |
| **E（Exclusive）** | 独占，当前缓存行与主内存一致，且不存在于其他缓存 |
| **S（Shared）** | 共享，当前缓存行与主内存一致，且存在于多个缓存 |
| **I（Invalid）** | 无效，当前缓存行无效 |

---

## 九、常见面试问题总结

### Q1: volatile和synchronized的区别？

| 特性 | volatile | synchronized |
|------|----------|--------------|
| 可见性 | ✅ 保证 | ✅ 保证 |
| 有序性 | ✅ 保证（禁止重排） | ✅ 保证 |
| 原子性 | ❌ 不保证 | ✅ 保证 |
| 阻塞线程 | ❌ 否 | ✅ 是 |
| 性能 | 较高 | 较低 |

### Q2: 为什么DCL单例需要volatile？

```java
private volatile static Singleton instance;

instance = new Singleton();
```

`new Singleton()`字节码层面分为三步：
1. 分配对象内存空间
2. 初始化对象
3. 将引用指向分配的内存地址

步骤2和3可能重排序为1→3→2，导致其他线程获取到未初始化的对象。

volatile通过内存屏障禁止这种重排序。

### Q3: happens-before是什么？

JMM中定义的一种偏序关系，用于判断数据是否存在竞争、操作是否线程安全。如果操作A happens-before 操作B，那么A的操作结果对B可见，且A的执行顺序在B之前。

### Q4: JMM如何解决缓存一致性问题？

1. **总线锁**：早期CPU使用，性能差
2. **MESI缓存一致性协议**：现代CPU使用，通过缓存行状态管理
3. **内存屏障**：禁止特定类型的重排序

---

## 十、总结

```
┌─────────────────────────────────────────────────────────────┐
│                        JMM核心内容                           │
├─────────────────────────────────────────────────────────────┤
│  抽象结构：主内存 + 工作内存                                  │
│  三大特性：原子性、可见性、有序性                              │
│  实现机制：volatile、synchronized、final、happens-before      │
│  底层原理：内存屏障、缓存一致性协议、指令重排序               │
└─────────────────────────────────────────────────────────────┘
```

**掌握JMM的关键**：
1. 理解主内存与工作内存的交互
2. 理解happens-before原则
3. 掌握volatile和synchronized的内存语义
4. 了解底层硬件支持（MESI、内存屏障）
