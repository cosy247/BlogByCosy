const n=`---\r
id: 1729751422783 # 文章id\r
title: NPM 代理与镜像配置 # 文章标题\r
description: NPM 代理与镜像配置 # 文章描述\r
tags: NPM # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否置顶，数字越大优先级越高\r
---\r
\r
# npm 代理与镜像配置\r
\r
## 代理配置\r
\r
- 设置 http 代理\r
\r
\`\`\`shell title="hidden"\r
npm config set proxy http://127.0.0.1:7890\r
\`\`\`\r
\r
- 设置 https 代理\r
\r
\`\`\`shell title="hidden"\r
npm config set https-proxy http://127.0.0.1:7890\r
\`\`\`\r
\r
- 取消 http 代理\r
\r
\`\`\`shell title="hidden"\r
npm config delete proxy\r
\`\`\`\r
\r
- 取消 https 代理\r
\r
\`\`\`shell title="hidden"\r
npm config delete https-proxy\r
\`\`\`\r
\r
- 查看 http 代理\r
\r
\`\`\`shell title="hidden"\r
npm get proxy\r
\`\`\`\r
\r
- 查看 https 代理\r
\r
\`\`\`shell title="hidden"\r
npm get https-proxy\r
\`\`\`\r
\r
## 镜像配置\r
\r
- 设置镜像源（官方）\r
\r
\`\`\`shell title="hidden"\r
npm config set registry https://registry.npmjs.org/\r
\`\`\`\r
\r
- 设置镜像源（淘宝）\r
\r
\`\`\`shell title="hidden"\r
npm config set registry https://registry.npmmirror.com\r
\`\`\`\r
\r
- 取消镜像源（转为官方镜像源）\r
\r
\`\`\`shell title="hidden"\r
npm config delete registry\r
\`\`\`\r
\r
- 查看镜像源\r
\r
\`\`\`shell title="hidden"\r
npm get registry\r
\`\`\`\r
\r
- 单次使用镜像源\r
\r
\`\`\`shell title="hidden"\r
npm install --registry=https://registry.npmmirror.com\r
\`\`\`\r
`;export{n as default};
