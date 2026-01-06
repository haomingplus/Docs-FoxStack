---
title: ConcurrentHashMap底层实现原理详解
createTime: 2026-01-06 00:00:00
permalink: /java-core/concurrenthashmap/
---

# ConcurrentHashMap 底层实现原理详解

## 一、概述

ConcurrentHashMap 是 Java 并发包 `java.util.concurrent` 中提供的线程安全哈希表。它相比 Hashtable 和 Collections.synchronizedMap() 提供了更高的并发性能。

### 1.1 核心特性

| 特性 | 说明 |
|------|------|
| 线程安全 | 保证多线程环境下数据一致性 |
| 高并发 | 读操作无锁，写操作分段/局部加锁 |
| 弱一致性 | 迭代器不抛出 ConcurrentModificationException |
| null 值 | 不允许 null 键和 null 值 |

### 1.2 与其他方案对比

| 方案 | 实现方式 | 并发性能 | 适用场景 |
|------|----------|----------|----------|
| Hashtable | 全表 synchronized 锁 | 低 | 不推荐使用 |
| synchronizedMap | 外部 synchronized 锁 | 低 | 简单场景 |
| ConcurrentHashMap | 分段锁 / CAS + synchronized | 高 | 高并发场景 |

---

## 二、JDK 1.7 实现：Segment 分段锁

### 2.1 数据结构

```
┌─────────────────────────────────────────────────────────────┐
│                    ConcurrentHashMap                        │
├─────────────────────────────────────────────────────────────┤
│  Segment[] (默认16个Segment)                                │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐   │
│  │ Seg[0] │ Seg[1] │ Seg[2] │ Seg[3] │  ...   │ Seg[15]│   │
│  └───┬────┴───┬────┴───┬────┴───┬────┴────────┴────┬────┘   │
│      │        │        │        │                   │         │
│      ▼        ▼        ▼        ▼                   ▼         │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐         ┌───────┐   │
│  │ HashEntry[] │ HashEntry[] │ HashEntry[] │ ... │ HashEntry[] │
│  │       │ │       │ │       │ │         │       │ │
│  │  链表  │ │  链表  │ │  链表  │ │  链表   │ │  链表  │   │
│  └───────┘ └───────┘ └───────┘ └───────┘         └───────┘   │
│      ▲        ▲        ▲        ▲                   ▲         │
│      │        │        │        │                   │         │
│   ReentrantLock (每个Segment独立锁)                          │
└─────────────────────────────────────────────────────────────┘

并发度 = 16 (默认 Segment 数量)
最多同时支持 16 个线程写操作（不同 Segment）
```

### 2.2 核心源码

```java
// Segment 继承 ReentrantLock，具有锁的语义
static final class Segment<K,V> extends ReentrantLock implements Serializable {
    transient volatile HashEntry<K,V>[] table;
    transient int threshold;
    transient int count;  // 元素个数
}

// HashEntry 节点
static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile HashEntry<K,V> next;  // volatile 保证可见性
}

// 默认并发度 16
static final int DEFAULT_CONCURRENCY_LEVEL = 16;

// 定位 Segment
final Segment<K,V> segmentFor(int hash) {
    // hash 高位用于定位 Segment
    return segments[(hash >>> segmentShift) & segmentMask];
}
```

### 2.3 put() 操作流程

```java
public V put(K key, V value) {
    if (value == null) throw new NullPointerException();

    int hash = hash(key.hashCode());
    // 1. 定位 Segment
    Segment<K,V> s = segmentFor(hash);

    return s.put(key, hash, value, false);
}

// Segment 内部的 put
V put(K key, int hash, V value, boolean onlyIfAbsent) {
    // 2. 加锁 (tryLock，不成功会自旋重试)
    lock();
    try {
        int c = count;
        if (c++ > threshold) {
            rehash();  // 扩容
        }

        HashEntry<K,V>[] tab = table;
        int index = hash & (tab.length - 1);
        HashEntry<K,V> first = tab[index];

        // 3. 遍历链表查找
        for (HashEntry<K,V> e = first; e != null; e = e.next) {
            if (e.hash == hash && key.equals(e.key)) {
                V oldValue = e.value;
                if (!onlyIfAbsent)
                    e.value = value;
                return oldValue;
            }
        }

        // 4. 新建节点插入 (头插法)
        HashEntry<K,V> newEntry = new HashEntry<K,V>(key, hash, first, value);
        tab[index] = newEntry;
        count = c; // 写 volatile 变量
        return null;
    } finally {
        // 5. 释放锁
        unlock();
    }
}
```

### 2.4 get() 操作流程

```java
public V get(Object key) {
    int hash = hash(key.hashCode());
    // 1. 定位 Segment
    Segment<K,V> s = segmentFor(hash);
    HashEntry<K,V>[] tab = s.table;

    // 2. 定位链表头
    HashEntry<K,V> e = tab[hash & (tab.length - 1)];

    // 3. 遍历查找 (无锁)
    for (;;) {
        if (e == null)
            return null;
        if (e.hash == hash && key.equals(e.key))
            return e.value;
        e = e.next;
    }
}
```

**get() 无锁原理：**
- `HashEntry` 的 `value` 和 `next` 都是 `volatile`
- `volatile` 保证内存可见性
- 读取时总能看到最新值

### 2.5 size() 操作

```java
public int size() {
    Segment<K,V>[] segments = this.segments;
    long sum = 0;
    long last = 0;

    // 1. 尝试 2 次 RETRIES_BEFORE_LOCK 次
    int retries = -1;

    while (true) {
        if (retries++ == RETRIES_BEFORE_LOCK) {
            // 2. 统计失败，加锁所有 Segment
            for (int i = 0; i < segments.length; ++i)
                segments[i].lock();
        }

        sum = 0;
        for (int i = 0; i < segments.length; ++i) {
            sum += segments[i].count;
        }

        // 3. 检查统计过程中是否有修改
        if (retries > 0) {
            if (sum == last)  // 连续两次结果一致，认为准确
                break;
            last = sum;
        } else {
            // 4. 检查 modCount，有修改则重试
            if (segments[0].count == 0) { // 快速检查
                for (int i = 1; i < segments.length; ++i) {
                    sum += segments[i].count;
                }
                break;
            }
        }
    }

    // 5. 释放锁
    if (retries > RETRIES_BEFORE_LOCK) {
        for (int i = 0; i < segments.length; ++i)
            segments[i].unlock();
    }

    return (int)sum;
}
```

### 2.6 JDK 1.7 优缺点

| 优点 | 缺点 |
|------|------|
| 多线程可并发写入不同 Segment | 并发度受限于 Segment 数量 |
| 读操作完全无锁 | 扩容复杂，单个 Segment 扩容 |
| 相比全表锁性能大幅提升 | 占用内存较大（Segment 数组） |

---

## 三、JDK 1.8 实现：CAS + synchronized

### 3.1 数据结构演变

```
JDK 1.7:
┌─────────────────────────────────┐
│     Segment[] + HashEntry[]      │
│     (分段锁 + 链表)               │
└─────────────────────────────────┘
              ▼
JDK 1.8:
┌─────────────────────────────────┐
│          Node[] + 链表/红黑树     │
│     (CAS + synchronized 锁头节点)  │
└─────────────────────────────────┘
```

### 3.2 核心变化

| 变化点 | JDK 1.7 | JDK 1.8 |
|--------|---------|---------|
| 底层结构 | Segment + HashEntry | Node + 链表/红黑树 |
| 锁机制 | 分段锁 (ReentrantLock) | CAS + synchronized |
| 锁粒度 | Segment 级别 | Node 节点级别 |
| 并发度 | 受 Segment 数量限制 | 理论上数组长度 |
| 查询复杂度 | O(n) 链表 | O(n) 链表 / O(log n) 红黑树 |

### 3.3 核心数据结构

```java
// 基础节点
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile Node<K,V> next;
}

// TreeBin (红黑树头节点)
static final class TreeBin<K,V> extends Node<K,V> {
    TreeNode<K,V> root;
    volatile TreeNode<K,V> first;
    volatile int lockState;  // 锁状态
    static final int WRITER = 1;  // 写锁
    static final int WAITER = 2;  // 等待锁
    static final int READER = 4;  // 读锁
}

// ForwardingNode (扩容转移节点)
static final class ForwardingNode<K,V> extends Node<K,V> {
    final Node<K,V>[] nextTable;  // 指向新表
}
```

### 3.4 关键变量

```java
// 核心数组
transient volatile Node<K,V>[] table;

// 扩容时的新数组
private transient volatile Node<K,V>[] nextTable;

// 基础计数值 (无锁 CAS 修改)
private transient volatile long baseCount;

// 扩容控制
private transient volatile int sizeCtl;
// sizeCtl 状态:
// -1: 正在初始化
// -N: (N-1) 个线程正在扩容
// 正数: 下次扩容的阈值 或 初始容量

// 扩容索引
private transient volatile int transferIndex;
```

### 3.5 put() 操作详解

```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null) throw new NullPointerException();

    // 1. 计算 hash (spread 扰动函数)
    int hash = spread(key.hashCode());

    int binCount = 0;
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;

        // 2. 表未初始化，先初始化
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();

        // 3. 计算索引，位置为空，CAS 插入
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
                break;  // CAS 成功，退出
        }

        // 4. 检测到 ForwardingNode，帮助扩容
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);

        // 5. 位置不为空， synchronized 加锁
        else {
            V oldVal = null;
            synchronized (f) {  // 锁头节点
                // 双重检查
                if (tabAt(tab, i) == f) {
                    // 链表节点
                    if (fh >= 0) {
                        binCount = 1;
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            // key 相同，覆盖
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            // 到达尾部，插入新节点
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key, value, null);
                                break;
                            }
                        }
                    }
                    // 红黑树节点
                    else if (f instanceof TreeBin) {
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key, value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }

            if (binCount != 0) {
                // 链表转红黑树
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }

    // 6. 增加 size (LongAdder 机制)
    addCount(1L, binCount);
    return null;
}
```

**put() 流程图：**

```
┌─────────────────────────────────────────┐
│           put(key, value)                │
└─────────────────┬───────────────────────┘
                  ▼
         ┌────────────────┐
         │   spread hash  │
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  table == null? │
         └────┬───────┬───┘
              │Yes    │No
              ▼       ▼
        ┌─────────┐  ┌────────────────┐
        │initTable│  │ 计算索引 i     │
        └────┬────┘  └────────┬───────┘
             │                │
             └────────┬───────┘
                      ▼
              ┌────────────────┐
              │ tab[i] == null? │
              └────┬───────┬───┘
                   │Yes    │No
                   ▼       ▼
            ┌─────────┐  ┌────────────────┐
            │CAS插入  │  │ hash == MOVED? │
            └─────────┘  └────┬───────┬───┘
                             │Yes    │No
                             ▼       ▼
                      ┌─────────┐  ┌──────────────┐
                      │帮助扩容  │  │synchronized  │
                      └─────────┘  │锁头节点      │
                                   └──────┬───────┘
                                          ▼
                                   ┌──────────────┐
                                   │ 遍历链表/树   │
                                   │ 插入或覆盖   │
                                   └──────┬───────┘
                                          ▼
                                   ┌──────────────┐
                                   │ 达到8转树?   │
                                   └──────┬───────┘
                                          ▼
                                   ┌──────────────┐
                                   │ addCount     │
                                   └──────────────┘
```

### 3.6 initTable() 初始化

```java
private final Node<K,V>[] initTable() {
    Node<K,V>[] tab; int sc;
    while ((tab = table) == null || tab.length == 0) {
        // sizeCtl < 0 表示其他线程正在初始化
        if ((sc = sizeCtl) < 0)
            Thread.yield(); // 让出 CPU

        // CAS 设置 sizeCtl 为 -1 (获取初始化权限)
        else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
            try {
                if ((tab = table) == null || tab.length == 0) {
                    int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                    @SuppressWarnings("unchecked")
                    Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                    table = tab = nt;
                    sc = n - (n >>> 2); // 0.75n，作为下次扩容阈值
                }
            } finally {
                sizeCtl = sc;
            }
            break;
        }
    }
    return tab;
}
```

### 3.7 get() 操作详解

```java
public V get(Object key) {
    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
    int h = spread(key.hashCode());

    // 整个过程无锁
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (e = tabAt(tab, (n - 1) & h)) != null) {

        // 检查头节点
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                return e.val;
        }

        // 红黑树查找
        else if (eh < 0)
            return (p = e.find(h, key)) != null ? p.val : null;

        // 链表查找
        while ((e = e.next) != null) {
            if (e.hash == h &&
                ((ek = e.key) == key || (ek != null && key.equals(ek))))
                return e.val;
        }
    }
    return null;
}
```

**get() 无锁原理：**
- `Node` 的 `val` 和 `next` 都是 `volatile`
- `tabAt()` 使用 `Unsafe.getObjectVolatile()` 读取
- 保证读取到最新值

### 3.8 扩容机制 (多线程协同)

```java
// 扩容入口
private final void addCount(long x, int check) {
    // ... 增加 baseCount

    if (check >= 0) {
        Node<K,V>[] tab, nt; int n, sc;
        while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&
               (n = tab.length) < MAXIMUM_CAPACITY) {
            int rs = resizeStamp(n);

            // sc > 0 表示没有其他线程在扩容
            if (sc < 0) {
                // 帮助扩容
                if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                    sc == rs + MAX_RESIZERS || (nt = nextTable) == null ||
                    transferIndex <= 0)
                    break;
                if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))
                    transfer(tab, nt);
            }
            // 发起扩容
            else if (U.compareAndSwapInt(this, SIZECTL, sc, (rs << RESIZE_STAMP_SHIFT) + 2)) {
                transfer(tab, null);
            }
        }
    }
}

// 数据迁移
private final void transfer(Node<K,V>[] tab, Node<K,V>[] nextTab) {
    int n = tab.length, stride;

    // 每个线程处理的步长
    if ((stride = (NCPU > 1) ? (n >>> 3) / NCPU : n) < MIN_TRANSFER_STRIDE)
        stride = MIN_TRANSFER_STRIDE;

    if (nextTab == null) {
        // 初始化 nextTable
        try {
            @SuppressWarnings("unchecked")
            Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n << 1];
            nextTab = nt;
        } catch (Throwable ex) {
            sizeCtl = Integer.MAX_VALUE;
            return;
        }
        nextTable = nextTab;
        transferIndex = n;  // 从后往前分配任务
    }

    int nextn = nextTab.length;

    // ForwardingNode 节点 (标记正在迁移)
    ForwardingNode<K,V> fwd = new ForwardingNode<K,V>(nextTab);

    boolean advance = true;
    boolean finishing = false;

    for (int i = 0, bound = 0;;) {
        Node<K,V> f; int fh;

        // 分配任务区间
        while (advance) {
            int nextIndex, nextBound;
            if (--i >= bound || finishing) {
                advance = false;
            } else if ((nextIndex = transferIndex) <= 0) {
                i = -1;
                advance = false;
            } else if (U.compareAndSwapInt(this, TRANSFERINDEX, nextIndex,
                    nextBound = (nextIndex > stride ? nextIndex - stride : 0))) {
                bound = nextBound;
                i = nextIndex - 1;
                advance = false;
            }
        }

        if (i < 0 || i >= n || i + n >= nextn) {
            // 扩容完成
            if (finishing) {
                nextTable = null;
                table = nextTab;
                sizeCtl = (n << 1) - (n >>> 1);
                return;
            }
            // 再次检查
            if (U.compareAndSwapInt(this, SIZECTL, sc = sizeCtl, sc - 1)) {
                if ((sc - 2) != resizeStamp(n) << RESIZE_STAMP_SHIFT)
                    return;
                finishing = advance = true;
                i = n;
            }
        }

        // 当前位置为空，放入 ForwardingNode
        else if ((f = tabAt(tab, i)) == null) {
            advance = casTabAt(tab, i, null, fwd);
        }

        // 已处理过
        else if ((fh = f.hash) == MOVED) {
            advance = true;
        }

        // 处理数据迁移
        else {
            synchronized (f) {
                if (tabAt(tab, i) == f) {
                    Node<K,V> ln, hn;
                    // 链表处理
                    if (fh >= 0) {
                        int runBit = fh & n;
                        Node<K,V> lastRun = f;
                        for (Node<K,V> p = f.next; p != null; p = p.next) {
                            int b = p.hash & n;
                            if (b != runBit) {
                                runBit = b;
                                lastRun = p;
                            }
                        }
                        if (runBit == 0) {
                            ln = lastRun;
                            hn = null;
                        } else {
                            hn = lastRun;
                            ln = null;
                        }
                        for (Node<K,V> p = f; p != lastRun; p = p.next) {
                            int ph = p.hash; K pk = p.key; V pv = p.val;
                            if ((ph & n) == 0)
                                ln = new Node<K,V>(ph, pk, pv, ln);
                            else
                                hn = new Node<K,V>(ph, pk, pv, hn);
                        }
                        setTabAt(nextTab, i, ln);
                        setTabAt(nextTab, i + n, hn);
                        setTabAt(tab, i, fwd);
                        advance = true;
                    }
                    // 红黑树处理
                    else if (f instanceof TreeBin) {
                        // ... 类似处理，分为低位和高位两棵树
                    }
                }
            }
        }
    }
}
```

**多线程协同扩容：**

```
数组: [0] [1] [2] [3] ... [14] [15] (假设长度16)
                      │
                      │ transferIndex (从后往前分配)
                      ▼

线程1: 处理 [12-15] → CAS 设置 ForwardingNode
线程2: 处理 [8-11]  → CAS 设置 ForwardingNode
线程3: 处理 [4-7]   → CAS 设置 ForwardingNode

get() 遇到 ForwardingNode → 去 nextTable 查找
put() 遇到 ForwardingNode → 帮助扩容
```

---

## 四、关键设计思想

### 4.1 CAS (Compare And Swap)

```java
// 底层使用 Unsafe 类
static final <K,V> boolean casTabAt(Node<K,V>[] tab, int i,
                                    Node<K,V> c, Node<K,V> v) {
    return U.compareAndSwapObject(tab, ((long)i << ASHIFT) + ABASE, c, v);
}

// 等价于:
// if (tab[i] == c) {
//     tab[i] = v;
//     return true;
// }
// return false;
```

**CAS 优势：**
- 无锁，避免线程阻塞
- 高并发场景性能好
- 配合自旋重试

### 4.2 synchronized 锁升级

JDK 1.8 中 synchronized 经过优化：

| 锁状态 | 说明 |
|--------|------|
| 偏向锁 | 单线程访问，无竞争 |
| 轻量级锁 | 少量线程竞争，自旋 |
| 重量级锁 | 多线程竞争，阻塞 |

ConcurrentHashMap 利用锁升级，低竞争时开销很小。

### 4.3 LongAdder 计数机制

```java
// baseCount: 无竞争时直接 CAS 更新
// CounterCell: 有竞争时分散到数组

// CounterCell 结构
@sun.misc.Contended  // 防止伪共享
static final class CounterCell {
    volatile long value;
    CounterCell(long x) { value = x; }
}

// CounterCell[] 数组
transient volatile CounterCell[] counterCells;
```

**LongAdder 原理：**

```
高并发场景:
线程1 → CounterCell[0]++
线程2 → CounterCell[1]++
线程3 → CounterCell[2]++
...
最终统计 = baseCount + sum(CounterCell[])

避免所有线程竞争同一个变量
```

---

## 五、JDK 1.7 vs 1.8 对比

| 对比项 | JDK 1.7 | JDK 1.8 |
|--------|---------|---------|
| 底层结构 | Segment + HashEntry | Node + 链表/红黑树 |
| 锁实现 | ReentrantLock | CAS + synchronized |
| 锁粒度 | Segment 级别 | Node 首节点级别 |
| 查询复杂度 | O(n) | O(n) / O(log n) |
| 内存占用 | 较大 | 较小 |
| 扩容机制 | Segment 独立扩容 | 多线程协同扩容 |
| 并发度理论值 | 16 | 数组长度 |

### 为什么放弃分段锁？

1. **内存占用**：Segment 数组和 HashEntry 数组占用更多内存
2. **并发粒度**：分段锁并发度受限（默认 16）
3. **JDK 1.6 后 synchronized 优化**：性能接近 ReentrantLock
4. **CAS 成熟**：Unsafe 的 CAS 操作稳定可靠

---

## 六、常见面试题

### Q1: ConcurrentHashMap 的 get() 为什么不需要加锁？

```java
// 原因:
1. Node 的 val 和 next 都是 volatile
2. volatile 保证内存可见性
3. 读操作不修改数据结构
4. 可能读到旧数据，但不会读到错误数据（弱一致性）
```

### Q2: ConcurrentHashMap 的 size() 如何统计？

```java
// JDK 1.8:
// 1. baseCount + CounterCell[] sum
// 2. 弱一致性，不保证精确值

// JDK 1.7:
// 1. 先尝试无锁统计
// 2. 连续两次结果一致则返回
// 3. 否则加锁所有 Segment 统计
```

### Q3: ConcurrentHashMap 不允许 null 键值的原因？

```java
// 原因:
1. 在多线程并发场景，null 存在二义性
   - key 不存在 返回 null
   - key 存在但 value 是 null 也返回 null

2. containsKey() 和 get() 无法区分这两种情况
3. 单线程的 HashMap 可以用 containsKey() 判断
4. 多线程中判断和调用之间可能被修改
```

### Q4: 为什么使用 Node 而不是 Entry？

```java
// 命名变更:
1. Map.Entry 是接口
2. Node 是实现类，更直观
3. TreeNode、TreeBin 等特殊节点统一后缀
```

### Q5: 扩容时读操作如何处理？

```java
// 遇到 ForwardingNode:
1. ForwardingNode.find() 方法
2. 去 nextTable 中查找
3. 保证读操作不会阻塞
```

---

## 七、性能优化建议

### 7.1 初始容量设置

```java
// 已知预期大小，设置初始容量避免扩容
int expectedSize = 10000;
// 注意：ConcurrentHashMap 的初始容量就是数组大小
// 不像 HashMap 需要 expectedSize / 0.75
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>(expectedSize);
```

### 7.2 适当场景选择

| 场景 | 推荐方案 |
|------|----------|
| 单线程 | HashMap |
| 低并发 (读多写少) | ConcurrentHashMap |
| 高并发读写 | ConcurrentHashMap |
| 需要强一致性 | synchronized 外层加锁 |

### 7.3 避免的坑

```java
// 1. 复合操作不原子
if (!map.containsKey(key)) {
    map.put(key, value);  // 非原子操作
}
// 应该使用 putIfAbsent
map.putIfAbsent(key, value);

// 2. size() 非精确值
int size = map.size();  // 近似值，非实时精确

// 3. 迭代器弱一致性
for (Map.Entry<String, String> entry : map.entrySet()) {
    // 可能遗漏新增元素
    // 不抛 ConcurrentModificationException
}
```

---

## 八、总结

ConcurrentHashMap 是 Java 并发编程的核心工具，其演进体现了并发优化的思路：

### 核心要点

| 版本 | 核心技术 | 关键改进 |
|------|----------|----------|
| JDK 1.7 | 分段锁 | 降低锁竞争 |
| JDK 1.8 | CAS + synchronized | 细化锁粒度 + 红黑树优化 |

### 设计精髓

1. **读写分离思想**：读无锁，写局部锁
2. **锁粒度细化**：从分段到节点级别
3. **CAS 无锁化**：避免线程阻塞
4. **多线程协同**：扩容时多线程帮助迁移
5. **红黑树优化**：链表过长时转换，保证查询性能

### 使用建议

- **首选**：高并发场景下使用 ConcurrentHashMap
- **初始化**：已知容量时设置初始容量
- **复合操作**：使用原子方法 (putIfAbsent、compute 等)
- **不要**：用 null 作为键或值
- **注意**：迭代器是弱一致的

---

## 附录：核心原子方法

```java
// 仅当 key 不存在时插入
V putIfAbsent(K key, V value)

// 仅当 key 存在且值等于 expected 时移除
boolean remove(Object key, Object value)

// 仅当 key 存在且值等于 oldValue 时替换
boolean replace(K key, V oldValue, V newValue)

// 计算（函数式编程）
V compute(K key, BiFunction<K,V,V> remappingFunction)
V computeIfAbsent(K key, Function<K,V> mappingFunction)
V computeIfPresent(K key, BiFunction<K,V,V> remappingFunction)

// 合并
V merge(K key, V value, BiFunction<V,V,V> remappingFunction)
```
