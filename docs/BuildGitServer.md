---
id: 1751264797561 # 文章id
date: 2025-07-01 15:52
title: 搭建git服务器(linux) # 文章标题
description: 搭建git服务器(linux) # 文章描述
tag: Git # 文章标签
archive: # 文章归档
recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# 搭建 git 服务器(linux)

这里只要为个人使用的 git 仓库。

## 安装 git

在 Ubuntu 上，可以通过以下命令安装 Git：

```bash
sudo apt install git
```

安装完成后，运行以下命令检查 Git 版本：

```bash
git --version
```

如果显示了 Git 的版本号，说明安装成功。

## 创建 Git 裸仓库

创建一个目录如 `/git/test.git`，并在文件夹下创建 git 裸仓库:

```bash
mkdir -p /git/test.git
cd /git/test.git
git init --bare
```

## 连接 Git 仓库

到目前为止服务器仓库已经搭建完成，对应的 origin 地址为 `root@192.168.45.4:/git/test.git`。 根据自己的用户名，ip 地址和仓库地址进行修改。

## 免密连接

在添加了远程地址后，进行推送，拉取等操作时还需要输入密码。由于使用的 ssh 连接，可以通过密钥方式解决。

1. 运行命令生成密钥对：

```bash
ssh-keygen -t rsa
```

改命令会在 `C:\Users\dhn\.ssh` 中生成两个文件：私钥 `id_rsa` 和公钥 `id_rsa.pub`。

2. 把 `id_rsa.pub` 文件内容复制到在服务器的 `/root/.ssh/authorized_keys` 文件中。文件内容为一行，复制过去为单独一行。

设置完成后，在进行 git 操作将不再需要输入密码。

<!--
## 密码缓存

在添加了远程地址后，进行推送，拉取等操作时还需要输入密码。可使用 git 缓存功能对用户密码进行缓存。

- 设置全局缓存功能，默认 15 分钟：

```bash
git config --global credential.helper
```

- 设置具体的时间，单位秒：

```bash
git config --global credential.helper "cache --timeout=3600"
```

- 设置单个仓库，到该仓库目录下：

```bash
git config credential.helper "cache --timeout=3600"
```

在设置完后可以查看仓库目录下的`config`文件：

```bash title=config
[core]
	repositoryformatversion = 0
	filemode = true
	bare = true
[credential]
	helper = cache --timeout=3600
```

- core.bare 表示裸仓库
- credential.helper 缓存用户信息策论 -->
