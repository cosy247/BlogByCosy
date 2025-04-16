const n=`---\r
id: 15\r
date: 2024/01/05\r
title: md文档转pdf\r
tags: 随笔\r
archive: \r
recommendations:\r
description: md文档转pdf\r
---\r
\r
# md文档转pdf\r
\r
## 原理\r
\r
通过md查看工具将其在浏览器中渲染出来，再利用浏览器的打印功能将其直接转换为pdf文件。\r
\r
## 实现\r
\r
1. 打开md，这里使用vscode并安装了Markdown Preview Enhanced插件。\r
\r
2. 在浏览器中预览md，不同软件方式不同。vscode中在预览中点击鼠标右键选择Open in Browser。\r
\r
![Alt text](./assets/MdTranslateToPdf/image-23.png)\r
\r
3. 在浏览器中右键选择打印\r
\r
![Alt text](./assets/MdTranslateToPdf/image-20.png)\r
\r
4. 在弹出的打印页面中选择Microsoft Print to PDF作为打印机\r
\r
![Alt text](./assets/MdTranslateToPdf/image-21.png)\r
\r
5. 点击打印，选择保存路径即可\r
\r
![Alt text](./assets/MdTranslateToPdf/image-22.png)\r
`;export{n as default};
