---
id: 1743150722248 # 文章id
date: 2025/04/16 16:04
title: JS Array.sort 从基础到中文排序 # 文章标题
description: JS Array.sort 从基础到中文排序 # 文章描述
tags: 前端,JS # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# JS Array.sort 从基础到中文排序

JavaScript 中的 `Array.sort()` 方法是实现数组排序的强大工具。它不仅可以对数字和字符串进行排序，还可以通过自定义排序函数实现更复杂的排序需求。

## `Array.sort()` 基础用法

`Array.sort()` 是 JavaScript 中数组对象的一个方法，用于对数组元素进行排序。它的基本语法如下：

```javascript
array.sort(compareFunction);
```

- `array` 是需要排序的数组。
- `compareFunction` 是一个可选的比较函数，用于定义排序规则。

### 1.1 数字排序

如果没有提供比较函数，`Array.sort()` 默认会将数组元素转换为字符串，然后按照 Unicode 码位值进行排序。这在数字排序时可能会导致意外的结果。例如：

```javascript
let numbers = [25, 2, 10, 100, 5];
numbers.sort();
console.log(numbers); // 输出：[10, 100, 2, 25, 5]
```

可以看到，数字被错误地按照字符串顺序排序了。为了避免这种情况，我们需要提供一个比较函数：

```javascript
let numbers = [25, 2, 10, 100, 5];
numbers.sort((a, b) => a - b);
console.log(numbers); // 输出：[2, 5, 10, 25, 100]
```

比较函数 `(a, b) => a - b` 确保了数字按照从小到大的顺序排序。如果需要降序排序，可以使用 `(a, b) => b - a`。

### 1.2 字符串排序

对于字符串数组，`Array.sort()` 默认的排序规则通常是有效的。它会按照 Unicode 码位值对字符串进行排序：

```javascript
let fruits = ['banana', 'apple', 'cherry', 'date'];
fruits.sort();
console.log(fruits); // 输出：["apple", "banana", "cherry", "date"]
```

如果需要按照其他规则排序，比如忽略大小写，可以自定义比较函数：

```javascript
let fruits = ['banana', 'Apple', 'cherry', 'date'];
fruits.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(fruits); // 输出：["Apple", "banana", "cherry", "date"]
```

这里使用了 `String.prototype.localeCompare()` 方法，它可以根据本地环境的规则比较字符串。

## 二、中文排序

在 JavaScript 中，对中文字符串进行排序时，不能直接使用默认的 `Array.sort()` 方法，因为默认排序是基于 Unicode 码位值的，而中文字符的码位值并不符合我们期望的排序规则。例如：

```javascript
let chineseWords = ['苹果', '香蕉', '橙子', '葡萄'];
chineseWords.sort();
console.log(chineseWords); // 输出：["橙子", "苹果", "葡萄", "香蕉"]
```

默认排序的结果显然不符合中文的字典顺序。为了实现正确的中文排序，我们需要使用 `String.prototype.localeCompare()` 方法，并指定语言环境为中文（如 `"zh-CN"`）。

### 2.1 使用 `localeCompare` 实现中文排序

`localeCompare` 方法允许我们指定语言环境和排序规则。以下是一个实现中文排序的示例：

```javascript
let chineseWords = ['苹果', '香蕉', '橙子', '葡萄'];
chineseWords.sort((a, b) => a.localeCompare(b, 'zh-CN'));
console.log(chineseWords); // 输出：["橙子", "葡萄", "苹果", "香蕉"]
```

这里，`"zh-CN"` 表示使用中文（简体）的语言环境进行排序。`localeCompare` 方法会根据指定的语言环境对字符串进行比较，从而实现正确的中文排序。

### 2.2 忽略大小写和标点符号

在某些情况下，我们可能希望在排序时忽略大小写或标点符号。`localeCompare` 方法提供了 `options` 参数，可以用来定义更复杂的排序规则。例如，忽略大小写：

```javascript
let mixedChineseWords = ['苹果', '香蕉', '橙子', '葡萄', '苹果'];
let options = { sensitivity: 'base' }; // 忽略大小写和标点符号
mixedChineseWords.sort((a, b) => a.localeCompare(b, 'zh-CN', options));
console.log(mixedChineseWords); // 输出：["橙子", "葡萄", "苹果", "苹果", "香蕉"]
```

在 `options` 中，`sensitivity` 属性可以设置为 `"base"`，表示忽略大小写和标点符号的差异。

## 三、性能优化

虽然 `localeCompare` 是实现中文排序的强大工具，但在处理大量数据时可能会对性能产生一定影响。以下是一些优化建议：

### 3.1 缓存排序结果

如果需要多次对同一个数组进行排序，可以考虑缓存排序结果，避免重复计算：

```javascript
let chineseWords = ['苹果', '香蕉', '橙子', '葡萄'];
let sortedWords = chineseWords.sort((a, b) => a.localeCompare(b, 'zh-CN'));
console.log(sortedWords); // 使用缓存的排序结果
```

### 3.2 使用 Web Workers

如果排序操作非常耗时，可以考虑将排序逻辑放在 Web Workers 中执行，避免阻塞主线程：

```javascript
// 在主线程中
let worker = new Worker('sortWorker.js');
worker.postMessage(chineseWords);

worker.onmessage = function (event) {
  console.log(event.data); // 接收排序结果
};

// 在 sortWorker.js 中
onmessage = function (event) {
  let sortedWords = event.data.sort((a, b) => a.localeCompare(b, 'zh-CN'));
  postMessage(sortedWords);
};
```

通过将排序逻辑放在 Web Workers 中，可以提高应用的响应性。

## 四、总结

JavaScript 的 `Array.sort()` 方法是一个功能强大的工具，能够满足多种排序需求。通过自定义比较函数，我们可以实现数字排序、字符串排序以及复杂的中文排序。在处理中文排序时，`String.prototype.localeCompare()` 方法是不可或缺的工具，它能够根据指定的语言环境实现正确的排序规则。

在实际开发中，我们还需要注意性能优化，避免在排序操作中阻塞主线程。通过合理使用缓存和 Web Workers，可以提高应用的性能和用户体验。

希望本文能够帮助你更好地理解和使用 JavaScript 的排序功能，无论是处理数字、字符串还是复杂的中文内容。

## 参考
