---
id: 1729751422783 # 文章id
date: 2024/10/24 14:57
title: NPM 代理与镜像配置 # 文章标题
description: NPM 代理与镜像配置 # 文章描述
tag: NPM # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
hidden: false # 是否隐藏
top: 0 # 是否置顶，数字越大优先级越高
---

# npm 代理与镜像配置

## 代理配置

- 设置 http 代理

```shell title="hidden"
npm config set proxy http://127.0.0.1:7890
```

- 设置 https 代理

```shell title="hidden"
npm config set https-proxy http://127.0.0.1:7890
```

- 取消 http 代理

```shell title="hidden"
npm config delete proxy
```

- 取消 https 代理

```shell title="hidden"
npm config delete https-proxy
```

- 查看 http 代理

```shell title="hidden"
npm get proxy
```

- 查看 https 代理

```shell title="hidden"
npm get https-proxy
```

## 镜像配置

- 设置镜像源（官方）

```shell title="hidden"
npm config set registry https://registry.npmjs.org/
```

- 设置镜像源（淘宝）

```shell title="hidden"
npm config set registry https://registry.npmmirror.com
```

- 取消镜像源（转为官方镜像源）

```shell title="hidden"
npm config delete registry
```

- 查看镜像源

```shell title="hidden"
npm get registry
```

- 单次使用镜像源

```shell title="hidden"
npm install --registry=https://registry.npmmirror.com
```
