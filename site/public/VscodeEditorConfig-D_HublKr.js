const n=`---\r
id: 21\r
date: 2024/02/01\r
title: 格式化配置文件 editorConfig 属性说明\r
tags: Vscode使用\r
description: Vscode 格式化配置文件 editorConfig 属性说明\r
---\r
\r
# 格式化配置文件 editorConfig 属性说明\r
\r
## editorConfig 文件\r
\r
文件名为\`.editorConfig\`。其中属性为键值对形式\`key = value\`，结尾不用分号，注释使用井号\`#\`。当文件使用 editorConfig 格式化时会以当前文件同级开始由下向上查找，直到根目录或者配置 root 为 true 为止，多个配置文件为属性追加不覆盖形式合并。例如第一个文件配置 a=1、第二个文件配置 a=2，b=3，合并后为 a=1，b=3，这只是做解释而不是真实的配置。\r
\r
## Vscode 中使用\r
\r
Vscode 可以安装\`EditorConfig for VS Code\`插件，也可以安装其他组件。 ![Alt text](assets/VscodeEditorConfig/image.png)\r
\r
这里使用\`Prettier - Code formatter\`插件为例。 ![Alt text](assets/VscodeEditorConfig/image-1.png)\r
\r
其中配置\`Use Editor Config\`即可启动 editorConfig 文件中的格式化配置 ![Alt text](assets/VscodeEditorConfig/image-2.png)\r
\r
## 属性配置\r
\r
### [*]\r
\r
使用中括号时表明匹配的文件，[*]表示匹配全部文件，[\\*.js]表示匹配全部 js 文件\r
\r
### root = true\r
\r
告诉 EditorConfig 插件，这是根文件，不用继续往上查找\r
\r
### charset = utf-8\r
\r
设置字符集为 utf-8\r
\r
### indent_style = space\r
\r
缩进风格，space 为空格缩进、tab 为制表符缩进\r
\r
### indent_size = 2\r
\r
缩进的空格数\r
\r
### end_of_line = lf\r
\r
结尾换行符，可选 lf、cr、crlf\r
\r
### insert_final_newline = true\r
\r
在文件结尾插入新行\r
\r
### max_line_length = 120\r
\r
换内最大列数，超过时换行\r
\r
### trim_trailing_whitespace = true\r
\r
删除一行中的前后空格\r
\r
## 配置示例\r
\r
\`\`\`\r
[*]\r
root = true\r
charset = utf-8\r
indent_style = space\r
indent_size = 2\r
end_of_line = lf\r
insert_final_newline = true\r
trim_trailing_whitespace = true\r
max_line_length = 120\r
\`\`\`\r
`;export{n as default};
