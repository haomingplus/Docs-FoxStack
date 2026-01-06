---
title: HashMap 底层实现原理详解
createTime: 2026/01/06 10:08:13
permalink: /java-core/hashmap/
---
# HashMap 底层实现原理详解

## 一、概述

HashMap 是 Java 中最常用的集合之一，它基于哈希表实现，存储键值对映射。HashMap 允许 null 键和 null 值，且不保证映射的顺序。

### 核心特性

| 特性 | 说明 |
|------|------|
| 时间复杂度 | 平均 O(1)，最坏 O(n) 或 O(log n) |
| 线程安全 | 非线程安全，ConcurrentHashMap 是线程安全版本 |
| 容量 | 初始默认 16，必须是 2 的幂次方 |
| 负载因子 | 默认 0.75，平衡时间和空间成本 |

---

## 二、数据结构演变

### JDK 1.7：数组 + 链表

```
┌─────────────────────────────────────────────────────────────────────┐
│                      JDK7 HashMap 整体架构                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    数组 + 链表                                                       │
│    ┌───┬───┬───┬───┬───┬───┬───┬───┐                               │
│    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  Entry[] table                │
│    └─┬─┴───┴─┬─┴───┴─┬─┴───┴───┴───┘                               │
│      │       │       │                                              │
│      ▼       ▼       ▼                                              │
│    [E1]    [E3]    [E5]     链表（头插法）                            │
│      │       │                                                      │
│      ▼       ▼                                                      │
│    [E2]    [E4]                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### JDK 1.8：数组 + 链表 + 红黑树

```
┌─────────────────────────────────────────────────────────────────────┐
│                       JDK8 HashMap 整体架构                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    数组 + 链表 + 红黑树                                               │
│    ┌───┬───┬───┬───┬───┬───┬───┬───┐                               │
│    │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  Node[] table                 │
│    └─┬─┴───┴─┬─┴───┴─┬─┴───┴───┴───┘                               │
│      │       │       │                                              │
│      ▼       ▼       ▼                                              │
│    [N1]    [N3]   [TreeNode]   链表（尾插法）/ 红黑树                 │
│      │       │      /   \                                           │
│      ▼       ▼     /     \                                          │
│    [N2]    [N4]  [TN]   [TN]   链表长度>8 且容量>=64 时树化            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 三、核心源码解析

### 3.1 Node 节点结构

```java
// 基础节点，存储键值对
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;      // 哈希值
    final K key;         // 键
    V value;             // 值
    Node<K,V> next;      // 下一个节点

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
}
```

### 3.2 核心常量

```java
// 默认初始容量 16 (必须是2的幂)
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;

// 最大容量
static final int MAXIMUM_CAPACITY = 1 << 30;

// 默认负载因子 0.75
static final float DEFAULT_LOAD_FACTOR = 0.75f;

// 链表转红黑树的阈值
static final int TREEIFY_THRESHOLD = 8;

// 红黑树转链表的阈值
static final int UNTREEIFY_THRESHOLD = 6;

// 哈希桶数组转为树的最小容量
static final int MIN_TREEIFY_CAPACITY = 64;
```

### 3.3 哈希计算

```java
// 计算 key 的哈希值
static final int hash(Object key) {
    int h;
    // 1. 获取 key 的 hashCode
    // 2. 高16位异或低16位 (扰动函数)
    //    目的: 让高位的特征参与到低位的运算中，减少哈希碰撞
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// 计算数组索引
// n 必须是2的幂，所以 n-1 的二进制全是1
// index = hash & (n - 1) 等价于 hash % n，但位运算效率更高
int index = hash & (n - 1);
```

**扰动函数示意图：**

```
假设 hashCode = 0b 0001 0110 1010 1100 0011 0101 1101 1111

高位 (16bit)      低位 (16bit)
0001 0110 1010 1100  ^  0011 0101 1101 1111
─────────────────────────────────────────
                    = 0010 0011 0111 0011 (扰动后的 hash)

好处：高位特征参与到索引计算，减少碰撞
```

### 3.4 put() 方法详解

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;

    // 1. 初始化 table
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

    // 2. 计算索引，位置为空直接插入
    i = (n - 1) & hash;
    if ((p = tab[i]) == null)
        tab[i] = newNode(hash, key, value, null);

    // 3. 位置不为空，处理哈希冲突
    else {
        Node<K,V> e; K k;

        // 3.1 key 相同，直接覆盖
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;

        // 3.2 是红黑树节点
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);

        // 3.3 是链表节点
        else {
            for (int binCount = 0; ; ++binCount) {
                // 到达链表尾部，插入新节点
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    // 链表长度达到8，转换为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1)
                        treeifyBin(tab, hash);
                    break;
                }
                // 找到相同 key，退出循环
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }

        // 3.4 key 已存在，覆盖旧值
        if (e != null) {
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }

    ++modCount;
    // 4. 检查是否需要扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

**put() 流程图：**

```
┌─────────────────────────────────────────┐
│            put(key, value)               │
└─────────────────┬───────────────────────┘
                  ▼
         ┌────────────────┐
         │ 计算 hash 值   │
         │ 计算数组索引    │
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │ 索引位置为空?   │
         └────┬───────┬───┘
              │Yes     │No
              ▼        ▼
        ┌─────────┐  ┌────────────────┐
        │直接插入  │  │遍历链表/红黑树  │
        └─────────┘  └────┬───────────┘
                           ▼
                  ┌────────────────┐
                  │ 找到相同 key?   │
                  └────┬───────┬───┘
                       │Yes    │No
                       ▼       ▼
                 ┌─────────┐ ┌──────────┐
                 │覆盖value │ │插入新节点 │
                 └─────────┘ └────┬─────┘
                                   ▼
                           ┌────────────────┐
                           │ 链表长度 >= 8?  │
                           └────┬───────┬───┘
                                │Yes    │No
                                ▼       │
                         ┌──────────┐  │
                         │转为红黑树 │  │
                         └────┬─────┘  │
                              └───┬────┘
                                  ▼
                           ┌────────────────┐
                           │ size > 阈值?   │
                           └────┬───────┬───┘
                                │Yes    │No
                                ▼       ▼
                           ┌──────┐ ┌──────┐
                           │扩容  │ │完成  │
                           └──────┘ └──────┘
```

### 3.5 get() 方法详解

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;

    // 1. 定位数组位置
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {

        // 2. 第一个节点就匹配
        if (first.hash == hash &&
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;

        // 3. 遍历后续节点
        if ((e = first.next) != null) {
            // 红黑树查找
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);

            // 链表查找
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

### 3.6 resize() 扩容机制

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;

    // 1. 计算新容量
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // 容量翻倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // 阈值翻倍
    }

    // 2. 初始化新数组
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;

    // 3. 数据迁移
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                // 单个节点，直接计算新位置
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                // 红黑树
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                // 链表
                else {
                    // JDK 1.8 优化：不需要重新计算每个节点的 hash
                    // 节点要么在原位置，要么在 原位置+oldCap
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // (e.hash & oldCap) == 0 表示索引不变
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // 索引变为 原索引 + oldCap
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

**扩容位置计算原理：**

```
假设 oldCap = 16 (0b10000)，newCap = 32 (0b100000)

对于任意 hash，计算索引:
- 旧索引: hash & (16 - 1) = hash & 0b1111
- 新索引: hash & (32 - 1) = hash & 0b11111

关键位是第 5 位 (从0开始是第4位):
- (hash & 16) == 0: 新索引 = 旧索引
- (hash & 16) != 0: 新索引 = 旧索引 + 16

示例:
hash1 = 0bxxxx 0xxxx → 位置不变
hash2 = 0bxxxx 1xxxx → 位置 = 原位置 + 16
```

---

## 四、红黑树转换机制

### 4.1 为什么使用红黑树？

- 链表过长时，查找时间复杂度 O(n)
- 红黑树查找时间复杂度 O(log n)
- 阈值选 8 是统计学权衡的结果

### 4.2 为什么阈值是 8？

泊松分布统计：

```
假设负载因子为 0.65，哈希碰撞符合泊松分布
链表长度        概率
0:             0.6065301
1:             0.3032653
2:             0.0758163
3:             0.0126360
4:             0.0015795
5:             0.0001579
6:             0.0000132
7:             0.0000009
8:             0.0000001 (极低概率)

结论：8 是一个合理的临界值
```

### 4.3 何时转红黑树？

```java
// 两个条件同时满足
1. 单个桶内链表长度 >= TREEIFY_THRESHOLD (8)
2. 数组总长度 >= MIN_TREEIFY_CAPACITY (64)

如果数组长度 < 64，优先扩容而非树化
```

### 4.4 何时退化为链表？

```java
// 红黑树节点数 <= UNTREEIFY_THRESHOLD (6)
// 在 remove 操作时触发
```

---

## 五、JDK 1.7 vs 1.8 对比

| 特性 | JDK 1.7 | JDK 1.8 |
|------|---------|---------|
| 底层结构 | 数组 + 链表 | 数组 + 链表 + 红黑树 |
| 链表插入 | 头插法 | 尾插法 |
| 扰动函数 | 4次位运算 + 5次异或 | 1次位运算 + 1次异或 |
| 扩容后位置 | 重新计算 | 原位置 或 原位置+旧容量 |

### 为什么 JDK 1.8 改用尾插法？

**JDK 1.7 头插法死循环问题：**

```
扩容前 (假设线程A、B同时扩容):
index1: [3] → [7] → null

线程A扩容到一半被挂起:
index1: [7] → [3] (顺序反转)

线程B完成扩容:
index1: [3] → [7]

线程A恢复执行，继续扩容:
index1: [3] → [7]
         ↑         ↓
         └─────────┘  (形成环链表)

后果: get() 时死循环
```

**尾插法优势：**
- 保持元素顺序，不会出现环链表
- 多线程扩容不会导致死循环（但仍有数据丢失风险）

---

## 六、线程安全问题

### 6.1 HashMap 非线程安全表现

| 问题 | 场景 | 后果 |
|------|------|------|
| 数据丢失 | 多线程同时 put | 覆盖导致数据丢失 |
| 死循环 | JDK 1.7 扩容 | 链表成环，CPU 100% |
| 数据不一致 | 扩容时读取 | 读取到错误数据 |

### 6.2 并发解决方案

```java
// 1. ConcurrentHashMap (推荐)
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();

// 2. Collections.synchronizedMap
Map<String, String> map = Collections.synchronizedMap(new HashMap<>());

// 3. 手动加锁
synchronized (map) {
    map.put(key, value);
}
```

---

## 七、常见面试题

### Q1: 为什么容量必须是 2 的幂？

```
1. 索引计算用位运算: index = hash & (n - 1)
2. n-1 的二进制全是 1，保证 hash 充分参与运算
3. 扩容时位置计算优化 (原位置 或 原位置+旧容量)
```

### Q2: 负载因子为什么是 0.75？

```
- 太小 (如 0.5): 空间浪费，扩容频繁
- 太大 (如 1.0): 哈希冲突增多，性能下降
- 0.75 是时间和空间的平衡点 (泊松分布统计)
```

### Q3: HashMap 的 key 需要满足什么条件？

```java
// 1. 实现 hashCode() 方法
// 2. 实现 equals() 方法
// 3. hashCode() 相等时，equals() 必须相等
// 4. equals() 相等时，hashCode() 必须相等
// 5. 作为 key 最好是不可变对象 (String、Integer 等)
```

### Q4: HashMap 和 Hashtable 的区别？

| 特性 | HashMap | Hashtable |
|------|---------|-----------|
| 线程安全 | 非线程安全 | 线程安全 (synchronized) |
| null 键/值 | 允许 | 不允许 |
| 继承 | AbstractMap | Dictionary |
| 迭代器 | Fail-Fast | Fail-Safe |
| 性能 | 较高 | 较低 |

---

## 八、性能优化建议

### 8.1 初始容量设置

```java
// 已知元素数量时，设置初始容量避免扩容
int expectedSize = 1000;
// 容量 = expectedSize / 0.75 + 1，向上取 2 的幂
int capacity = (int) (expectedSize / 0.75F) + 1;
Map<String, String> map = new HashMap<>(capacity);

// 或使用 Guava
Map<String, String> map = Maps.newHashMapWithExpectedSize(expectedSize);
```

### 8.2 合理选择 Key

```java
// 推荐: 不可变、计算快、分布均匀
String key = "user:123:" + timestamp;  // 好
String key = object.toString();          // 可能不好 (看实现)

// 不推荐: 可变对象
List<String> list = new ArrayList<>();
map.put(list, "value");  // list 修改后无法找到
```

---

## 九、总结

HashMap 是 Java 集合框架的核心组件，理解其底层原理有助于：

1. 正确选择集合类型
2. 避免性能陷阱
3. 排查线上问题
4. 深入学习 ConcurrentHashMap

**核心要点：**

- 数组 + 链表 + 红黑树组合结构
- 扰动函数优化哈希分布
- 尾插法避免死循环
- 负载因子 0.75 平衡性能
- 非线程安全，并发用 ConcurrentHashMap