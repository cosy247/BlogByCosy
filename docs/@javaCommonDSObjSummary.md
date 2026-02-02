---
id: 1769505981824 # 文章id
date: 2026/1/27 17:26 # 时间
title: Java 常用数据结构对象总结 # 文章标题
description: Java 常用数据结构对象总结 # 文章描述
tag: 后端 Java # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Java 常用数据结构对象总结

## 一、集合框架概览

Java集合框架主要分为三大类：List（列表）、Set（集合）和Map（映射）

## 二、List接口实现类

### 1. ArrayList

**特点**：基于动态数组实现，随机访问快

**常用操作**：

```java
// 创建
List<String> list = new ArrayList<>();

// 添加元素
list.add("元素1");
list.add(1, "插入元素"); // 指定位置插入

// 获取元素
String element = list.get(0);

// 遍历
for(String str : list) { /* 操作 */ }
list.forEach(System.out::println);

// 删除
list.remove(0); // 按索引
list.remove("元素1"); // 按对象

// 查找
int index = list.indexOf("元素1");
boolean exists = list.contains("元素1");

// 大小
int size = list.size();
```

**优点**：

- 随机访问性能高（O(1)）
- 尾部添加元素效率高
- 内存连续，缓存友好

**缺点**：

- 中间插入/删除慢（O(n)）
- 扩容成本高（需复制数组）

### 2. LinkedList

**特点**：基于双向链表实现

**常用操作**：

```java
LinkedList<String> list = new LinkedList<>();

// 特有操作
list.addFirst("头部添加");
list.addLast("尾部添加");
list.getFirst();
list.getLast();
list.removeFirst();
list.removeLast();

// 可用作栈或队列
list.push("压栈"); // 栈操作
list.pop(); // 弹出

list.offer("入队"); // 队列操作
list.poll(); // 出队
```

**优点**：

- 头部和尾部插入/删除快（O(1)）
- 不需要预分配空间
- 中间插入相对高效

**缺点**：

- 随机访问慢（O(n)）
- 内存不连续，缓存不友好
- 每个元素存储额外指针，内存占用大

### 3. Vector（线程安全但已过时）

**替代方案**：`Collections.synchronizedList(new ArrayList<>())` 或 `CopyOnWriteArrayList`

## 三、Set接口实现类

### 1. HashSet

**特点**：基于HashMap实现，无序

```java
Set<String> set = new HashSet<>();

set.add("元素");
set.remove("元素");
boolean exists = set.contains("元素");

// 遍历
for(String s : set) { /* 操作 */ }

// 其他操作
set.size();
set.isEmpty();
set.clear();
```

**优点**：

- 添加、删除、查找快（平均O(1)）
- 无重复元素

**缺点**：

- 无序
- 依赖hashCode()和equals()方法

### 2. LinkedHashSet

**特点**：保持插入顺序

```java
Set<String> set = new LinkedHashSet<>();
```

**优点**：

- 保持插入顺序
- 访问性能接近HashSet

**缺点**：

- 比HashSet稍慢
- 内存占用稍大

### 3. TreeSet

**特点**：基于红黑树，元素排序

```java
// 自然排序
Set<String> set = new TreeSet<>();

// 自定义排序
Set<String> set = new TreeSet<>((a, b) -> b.compareTo(a));

// 特有方法
TreeSet<Integer> treeSet = new TreeSet<>();
treeSet.add(5); treeSet.add(3); treeSet.add(8);

Integer first = treeSet.first(); // 最小元素
Integer last = treeSet.last();   // 最大元素
Integer lower = treeSet.lower(5); // 小于5的最大元素
Integer higher = treeSet.higher(5); // 大于5的最小元素
```

**优点**：

- 元素自动排序
- 范围查询高效

**缺点**：

- 插入和删除较慢（O(log n)）
- 要求元素实现Comparable或提供Comparator

## 四、Map接口实现类

### 1. HashMap

**特点**：基于哈希表，键值对存储

```java
Map<String, Integer> map = new HashMap<>();

// 添加/更新
map.put("key", 1);
map.putIfAbsent("key", 2); // 不存在才添加

// 获取
Integer value = map.get("key");
Integer orDefault = map.getOrDefault("key", 0);

// 遍历
for(Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

map.keySet().forEach(System.out::println);
map.values().forEach(System.out::println);

// 删除
map.remove("key");
map.remove("key", 1); // 键值都匹配才删除

// 判断
boolean hasKey = map.containsKey("key");
boolean hasValue = map.containsValue(1);
```

**优点**：

- 增删改查快（平均O(1)）
- 实现简单

**缺点**：

- 无序
- 线程不安全
- 哈希冲突影响性能

### 2. LinkedHashMap

**特点**：保持插入顺序或访问顺序

```java
// 插入顺序
Map<String, Integer> map1 = new LinkedHashMap<>();

// 访问顺序（适合构建LRU缓存）
Map<String, Integer> map2 = new LinkedHashMap<>(16, 0.75f, true);
```

### 3. TreeMap

**特点**：基于红黑树，按键排序

```java
Map<String, Integer> map = new TreeMap<>();

// 特有方法
TreeMap<String, Integer> treeMap = new TreeMap<>();
String firstKey = treeMap.firstKey();
String lastKey = treeMap.lastKey();
Map.Entry<String, Integer> floor = treeMap.floorEntry("key"); // 小于等于
```

### 4. ConcurrentHashMap（推荐）

**特点**：线程安全的HashMap

```java
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();

// 原子操作
concurrentMap.computeIfAbsent("key", k -> 1);
concurrentMap.merge("key", 1, Integer::sum);
```

## 五、队列实现类

### 1. ArrayDeque

**特点**：双端队列，数组实现

```java
Deque<String> deque = new ArrayDeque<>();

// 作为栈
deque.push("a"); deque.pop();

// 作为队列
deque.offer("a"); deque.poll();

// 双端操作
deque.addFirst("first");
deque.addLast("last");
```

### 2. PriorityQueue

**特点**：优先级队列

```java
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(5); pq.offer(2); pq.offer(8);

pq.poll(); // 总是返回最小元素（2）

// 自定义优先级
Queue<String> pq2 = new PriorityQueue<>((a, b) -> b.length() - a.length());
```

## 六、线程安全集合

| 类名                    | 特点               | 适用场景           |
| ----------------------- | ------------------ | ------------------ |
| `CopyOnWriteArrayList`  | 写时复制，读快写慢 | 读多写少，遍历频繁 |
| `ConcurrentHashMap`     | 分段锁/乐观锁      | 高并发Map          |
| `ConcurrentLinkedQueue` | 无锁队列           | 高并发队列         |
| `BlockingQueue`接口     | 阻塞队列           | 生产者-消费者模式  |

## 七、选择指南

1. **需要快速随机访问** → `ArrayList`
2. **频繁在中间插入/删除** → `LinkedList`
3. **去重且不关心顺序** → `HashSet`
4. **去重且保持插入顺序** → `LinkedHashSet`
5. **需要排序集合** → `TreeSet`
6. **键值对存储，不关心顺序** → `HashMap`
7. **需要键排序** → `TreeMap`
8. **线程安全Map** → `ConcurrentHashMap`
9. **栈或队列操作** → `ArrayDeque`
10. **优先级处理** → `PriorityQueue`

## 八、性能对比

| 数据结构   | 获取     | 添加      | 删除     | 包含     | 内存 |
| ---------- | -------- | --------- | -------- | -------- | ---- |
| ArrayList  | O(1)     | O(1)~O(n) | O(n)     | O(n)     | 少   |
| LinkedList | O(n)     | O(1)      | O(1)     | O(n)     | 多   |
| HashSet    | O(1)     | O(1)      | O(1)     | O(1)     | 中等 |
| TreeSet    | O(log n) | O(log n)  | O(log n) | O(log n) | 多   |
| HashMap    | O(1)     | O(1)      | O(1)     | O(1)     | 中等 |

## 九、最佳实践

1. **预估容量**：`new ArrayList<>(initialCapacity)`
2. **使用接口类型声明**：`List<String> list = new ArrayList<>()`
3. **遍历时避免修改集合**（ConcurrentModificationException）
4. **重写hashCode()和equals()** 正确使用HashSet/HashMap
5. **考虑使用不可变集合**：`List.copyOf()`, `Set.copyOf()`, `Map.copyOf()`
6. **使用Stream API**进行集合操作：
   ```java
   list.stream()
       .filter(s -> s.length() > 3)
       .map(String::toUpperCase)
       .collect(Collectors.toList());
   ```

选择合适的数据结构可以显著提升程序性能，需要根据具体的使用场景和需求来决定。

## 参考
