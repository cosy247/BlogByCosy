const n=`---\r
id: 1735888790018 # 文章id\r
title: NRM - NPM 的镜像源管理工具 # 文章标题\r
description: NRM - NPM 的镜像源管理工具 # 文章描述\r
tags: NPM # 文章标签\r
archive: # 文章归档\r
recommendations: 1729751422783 # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# NRM - NPM 的镜像源管理工具\r
\r
NRM 是一个 NPM 源管理器，它可以帮助用户轻松地在不同的 NPM 源之间切换。它支持多种源，包括 npm、cnpm、taobao、yarn、tencent、npmMirror 和 huawei 等。通过使用 nrm，用户可以快速地更改 NPM 的源，以提高包的下载速度或解决某些包在特定源上无法下载的问题。\r
\r
## 安装\r
\r
推荐全局安装\r
\r
\`\`\`shell title="hidden"\r
npm install -g nrm\r
\`\`\`\r
\r
## 常用命令\r
\r
- 列出所有可用的源，星号 (\\*) 表示当前使用的源。\r
\r
\`\`\`shell title="hidden"\r
nrm ls\r
\`\`\`\r
\r
![alt text](./assets/NPMRegistryManager/image-1.png)\r
\r
- 切换到指定的源。\r
\r
\`\`\`shell title="hidden"\r
nrm use <registry>\r
\`\`\`\r
\r
- 添加一个新的自定义源。\r
\r
\`\`\`shell title="hidden"\r
nrm use <registry> <url>\r
\`\`\`\r
\r
- 删除一个已存在的源。\r
\r
\`\`\`shell title="hidden"\r
nrm del <registry>\r
\`\`\`\r
\r
- 测试所有源的响应时间，以帮助选择最快的源。\r
\r
\`\`\`shell title="hidden"\r
nrm test\r
\`\`\`\r
\r
![alt text](./assets/NPMRegistryManager/image.png)\r
`;export{n as default};
