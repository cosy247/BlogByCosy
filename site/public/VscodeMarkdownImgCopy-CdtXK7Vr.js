const n=`---\r
id: 22\r
date: 2023/12/24\r
title: Vscode 编写 Mardown 时复制图片自动保存到目标文件夹\r
tags: Vscode使用\r
draft: 存在这一行时表示在草稿箱中\r
---\r
\r
# Vscode 编写 Mardown 时复制图片自动保存到目标文件夹\r
\r
在使用 Vscode 编写 Markdown 时可以直接复制图片自动生成链接，并将图片生成到文档同级下。当文件多时不方便管理需要将其保存到指定的对应文件夹下。\r
\r
## 使用 markdown.copyFiles.destination 设置\r
\r
在设置中搜索 \`markdown.copyFiles.destination\` 或者自行查找\r
\r
![Alt text](assets/VscodeMarkdownImgCopy/image.png)\r
\r
点击添加项，并输入值即可：\r
\r
> \`项\`表示文件的匹配方式，可以使用\`*\`表示全部 markdown 文件，路径不用关心项目的路径，只要匹配成功即可；  \r
> \`值\`表示素材的保存路径，可以使用上方的值来动态生成保存路径，使用斜杠开头表示以项目根目录为开始路径，直接写路径或者以\`./\`开头则以编辑文件的目录为开始路径；\r
\r
当前这设置的效果为：\r
\r
> 在 docs/blog 下的所有 fileName.md 文件中复制图片时将自动保存到 docs/blog/asstes/fileName/下\r
\r
同时设置多个规则：\r
\r
> 当设置多个规则时，会从上到小依次匹配文件的路径，并在有匹配成功的情况下第一个满足匹配的路径，没有匹配成功时将复制到文档的同级目录下（默认）。\r
\r
## 当前 Vscode 版本信息\r
\r
可在\`帮助>>关于\`中查看\r
\r
| 版本            | 1.82.1 (user setup)                      |\r
| --------------- | ---------------------------------------- |\r
| 提交            | 6509174151d557a81c9d0b5f8a5a1e9274db5585 |\r
| 日期            | 2023-09-08T08:45:05.575Z                 |\r
| Electron        | 25.8.0                                   |\r
| ElectronBuildId | 23503258                                 |\r
| Chromium        | 114.0.5735.289                           |\r
| Node.js         | 18.15.0                                  |\r
| V8              | 11.4.183.29-electron.0                   |\r
| OS              | Windows_NT x64 10.0.22621                |\r
`;export{n as default};
