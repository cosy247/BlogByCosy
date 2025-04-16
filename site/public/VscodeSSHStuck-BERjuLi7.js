const n=`---\r
id: 1735869600647 # 文章id\r
title: Vscode 连接服务器导致服务器卡死 # 文章标题\r
description: Vscode 连接服务器导致服务器卡死 # 文章描述\r
tags: Vscode使用 # 文章标签\r
archive: # 文章归档\r
recommendations: 240409103645 # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# Vscode 连接服务器导致服务器卡死\r
\r
在通过 Vscode 的 Remote-SSH 插件连接远程服务器时（这里使用的是阿里云云服务器），会在连接后一段时间卡死，检查服务器为 cpu 使用率 100%。\r
\r
## 解决\r
\r
在 Vscode 的设置里面搜索 \`search.followSymlinks\`，并将设置关闭掉。\r
\r
![alt text](assets/VscodeSSHStuck/image.png)\r
\r
可以在远程 tab 中单独关闭，也可以在用户 tab 中设置全部关闭。\r
`;export{n as default};
