---
id: 1777363074789 # 文章id
date: 2026/4/28 15:57 # 时间
title: 零成本自动化！用 GitHub Actions 实现前端项目推送自动部署 # 文章标题
description: 零成本自动化！用 GitHub Actions 实现前端项目推送自动部署 # 文章描述
tag: 前端,Git # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# 零成本自动化！用 GitHub Actions 实现前端项目推送自动部署

使用 GitHub Pages 托管静态网站时，可以使用 GitHub Actions 来实现推送后自动打包部署功能。达到推送了某个分支后代理的项目自动更新。

## 配置 Github

## 完整配置代码（带详细注解）

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
# ============================================
# GitHub Actions 工作流配置文件
# 用途：当代码推送到 master 分支时，自动构建并部署到 GitHub Pages
# 适用项目：VitePress / Vite / Vue / React 等前端项目
# ============================================

# 工作流名称（会在 GitHub Actions 界面显示）
name: 部署 VitePress 项目到 GitHub Pages

# ============================================
# 触发条件配置
# ============================================
on:
  push: # 当执行 git push 操作时触发
    branches: # 限制触发的分支
      - master # 只有推送到 master 分支时才执行
      # - main         # 如果你的默认分支是 main，改为这个
      # - dev          # 可添加多个分支，如 dev 分支触发测试环境部署

# ============================================
# 权限配置（非常重要！缺少任何一项都会导致部署失败）
# ============================================
permissions:
  contents: read # 允许工作流读取仓库代码（用于 checkout 拉取代码）
  pages: write # 允许工作流写入 GitHub Pages（用于部署）
  id-token: write # 允许 OIDC 身份验证（GitHub Pages 部署必需）

# ============================================
# 任务定义（一个工作流可以包含多个 job，这里只定义一个）
# ============================================
jobs:
  # 任务 ID（自定义，用于标识这个构建和部署任务）
  build-and-deploy:
    # 运行环境：使用 Ubuntu 最新版 LTS 镜像
    # 其他选项：windows-latest, macos-latest
    runs-on: ubuntu-latest

    # 环境配置（用于 GitHub Pages 部署）
    environment:
      name: github-pages # 固定值，必须叫 github-pages
      url: ${{ steps.deployment.outputs.page_url }} # 部署完成后输出的 Pages 访问地址

    # ==========================================
    # 步骤列表（按顺序依次执行）
    # ==========================================
    steps:
      # ---------- 步骤 1：拉取仓库代码 ----------
      - name: Checkout # 步骤显示名称
        # actions/checkout 是 GitHub 官方提供的 Action
        # 作用：将仓库代码克隆到运行器中
        # @v4 表示使用版本 4（建议使用带版本的标签，避免 breaking changes）
        uses: actions/checkout@v4
        # 可选参数（本例未启用）：
        # with:
        #   ref: master               # 可指定拉取特定分支
        #   fetch-depth: 1            # 只拉取最新一次提交，加快速度

      # ---------- 步骤 2：配置 Node.js 运行环境 ----------
      - name: 设置 Node.js
        # actions/setup-node 是 GitHub 官方提供的 Action
        # 作用：安装并配置指定版本的 Node.js
        uses: actions/setup-node@v4
        with:
          # 指定 Node.js 版本（必须与你本地开发版本一致或兼容）
          node-version: 20 # 可选值：18, 20, 22 等

          # 开启 npm 依赖缓存（大幅加速后续工作流执行）
          # 首次运行会缓存 node_modules，后续运行直接恢复缓存，跳过 npm install
          cache: 'npm' # 可选值：npm, yarn, pnpm

          # 可选：指定缓存依赖路径（一般默认即可）
          # cache-dependency-path: package-lock.json

      # ---------- 步骤 3：安装依赖并构建项目 ----------
      - name: 安装依赖 & 构建
        # run 用于执行 Shell 命令（支持多行命令）
        run: |
          # 打印 Node 版本（便于调试）
          node --version
          # 打印 npm 版本
          npm --version
          # 安装项目依赖（会使用缓存，若缓存命中则极快）
          npm install
          # 执行项目构建命令（具体命令在 package.json 的 scripts 中定义）
          npm run build
        # 说明：如果你的项目使用 yarn 或 pnpm，将 npm 替换为对应命令即可
        # 例如：yarn install && yarn build

      # ---------- 步骤 4：上传构建产物 ----------
      - name: 上传 Pages 产物
        # actions/upload-pages-artifact 是 GitHub 官方提供的 Action
        # 作用：将构建生成的静态文件打包上传，供下一步部署使用
        uses: actions/upload-pages-artifact@v3
        with:
          # 指定要上传的文件夹路径
          # ⚠️ 重要：这个路径必须与你的项目构建输出目录一致
          path: './dist' # Vite/Vue/React 默认输出 dist
          # 其他框架的常见配置：
          # - Create React App: './build'
          # - Next.js (静态导出): './out'
          # - Vue CLI: './dist'
          # - 原生 HTML（无构建）: '.'

      # ---------- 步骤 5：自动部署到 GitHub Pages ----------
      - name: 部署到 GitHub Pages
        # actions/deploy-pages 是 GitHub 官方提供的 Action
        # 作用：将上一步上传的产物部署到 GitHub Pages 服务
        uses: actions/deploy-pages@v4
        # 为当前步骤设置 ID，方便其他步骤引用其输出（如 environment.url）
        id: deployment
        # deploy-pages 会自动读取上一步 upload-pages-artifact 上传的内容
        # 无需额外配置参数
```
