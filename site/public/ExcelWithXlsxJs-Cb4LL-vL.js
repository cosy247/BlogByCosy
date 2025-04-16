const n=`---\r
id: 1738920126938 # 文章id\r
title: 使用 xlsx.js 轻松处理 Excel 数据 # 文章标题\r
description: 使用 xlsx.js 轻松处理 Excel 数据 # 文章描述\r
tags: JS 前端 # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# 使用 xlsx.js 轻松处理 Excel 数据\r
\r
[xlsx.js](https://www.npmjs.com/package/xlsx) 是一个开源的 JavaScript 库，用于读取、写入和处理 Excel 文件。它支持多种文件格式，包括 .xlsx、.xls、.csv 等，并且可以在浏览器和 node.js 环境中使用。XLSX.js 的核心功能包括：读取 Excel 文件：支持从文件中读取数据并将其转换为 JSON 格式，方便后续处理。写入 Excel 文件：可以将数据导出为 Excel 文件，支持自定义样式和格式。\r
\r
## 引入\r
\r
1. 通过 CDN 引入\r
\r
\`\`\`html title=hidden\r
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"><\/script>\r
\`\`\`\r
\r
1. npm 引入\r
\r
\`\`\`bash title=hidden\r
npm install xlsx\r
\`\`\`\r
\r
## 读取\r
\r
在以下表格内容时\r
\r
![alt text](assets/ExcelWithXlsxJs/image-1.png)\r
\r
1. 在 node 环境中可以直接读取路径文件：\r
\r
\`\`\`js\r
const workbook = XLSX.readFile(filepath, opts);\r
\`\`\`\r
\r
1. 在 web 环境中则可以读取存储中的文件数据：\r
\r
\`\`\`js\r
inputDom.addEventListener(\r
  'change',\r
  function handleFileAsync(e) {\r
    const file = e.target.files[0];\r
    const data = await file.arrayBuffer();\r
    const workbook = XLSX.read(data);\r
  }\r
);\r
\`\`\`\r
\r
> 读取到的数据保存在 \`Sheets\` 字段中，表单名保存在 \`SheetNames\` 中，这时还不方便直接处理;\r
\r
### sheet_to_json 读取为对象数组\r
\r
可以通过 \`sheet_to_json\` 将数据转化为对象数组，以第一行为键名，其他行为键值：\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);\r
\`\`\`\r
\r
\`\`\`json\r
[\r
  { "name": "Wendy", "age": 20, "sex": "w", "height": 158 },\r
  { "name": "Anna", "age": 19, "sex": "w", "height": 160 },\r
  { "name": "Ben,Ke", "age": 22, "sex": "m", "height": 172 }\r
]\r
\`\`\`\r
\r
### sheet_to_csv 读取为 csv 多行字符串\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);\r
\`\`\`\r
\r
\`\`\`text\r
name,age,sex,height\r
Wendy,20,w,158\r
Anna,19,w,160\r
"Ben,Ke",22,m,172\r
\`\`\`\r
\r
### sheet_to_html 快捷生成 html 代码\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);\r
\`\`\`\r
\r
\`\`\`html\r
<html>\r
  <head>\r
    <meta charset="utf-8" />\r
    <title>SheetJS Table Export</title>\r
  </head>\r
  <body>\r
    <table>\r
      <tr>\r
        <td data-t="s" data-v="name" id="sjs-A1">name</td>\r
        <td data-t="s" data-v="age" id="sjs-B1">age</td>\r
        <td data-t="s" data-v="sex" id="sjs-C1">sex</td>\r
        <td data-t="s" data-v="height" id="sjs-D1">height</td>\r
      </tr>\r
      <tr>\r
        <td data-t="s" data-v="Wendy" id="sjs-A2">Wendy</td>\r
        <td data-t="n" data-v="20" id="sjs-B2">20</td>\r
        <td data-t="s" data-v="w" id="sjs-C2">w</td>\r
        <td data-t="n" data-v="158" id="sjs-D2">158</td>\r
      </tr>\r
      <tr>\r
        <td data-t="s" data-v="Anna" id="sjs-A3">Anna</td>\r
        <td data-t="n" data-v="19" id="sjs-B3">19</td>\r
        <td data-t="s" data-v="w" id="sjs-C3">w</td>\r
        <td data-t="n" data-v="160" id="sjs-D3">160</td>\r
      </tr>\r
      <tr>\r
        <td data-t="s" data-v="Ben,Ke" id="sjs-A4">Ben,Ke</td>\r
        <td data-t="n" data-v="22" id="sjs-B4">22</td>\r
        <td data-t="s" data-v="m" id="sjs-C4">m</td>\r
        <td data-t="n" data-v="172" id="sjs-D4">172</td>\r
      </tr>\r
    </table>\r
  </body>\r
</html>\r
\`\`\`\r
\r
### sheet_to_text 生成制表符分隔的多行字符串\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_text(workbook.Sheets[workbook.SheetNames[0]]);\r
\`\`\`\r
\r
\`\`\`text\r
name	age	sex	height\r
Wendy	20	w	158\r
Anna	19	w	160\r
Ben,Ke	22	m	172\r
\`\`\`\r
\r
### sheet_to_formulae 获取每个单元格对应内容\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[0]]);\r
\`\`\`\r
\r
\`\`\`json\r
[\r
  "A1='name",\r
  "B1='age",\r
  "C1='sex",\r
  "D1='height",\r
  "A2='Wendy",\r
  "B2=20",\r
  "C2='w",\r
  "D2=158",\r
  "A3='Anna",\r
  "B3=19",\r
  "C3='w",\r
  "D3=160",\r
  "A4='Ben,Ke",\r
  "B4=22",\r
  "C4='m",\r
  "D4=172"\r
]\r
\`\`\`\r
\r
### 读取为二维数组\r
\r
没有直接的方法可以将数组处理成二维数组，但是可以通过设置 opts 方式完成。\r
\r
\`\`\`js\r
const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });\r
\`\`\`\r
\r
\`\`\`json\r
[\r
  ["name", "age", "sex", "height"],\r
  ["Wendy", 20, "w", 158],\r
  ["Anna", 19, "w", 160],\r
  ["Ben,Ke", 22, "m", 172]\r
]\r
\`\`\`\r
\r
## 创建，写入，下载\r
\r
\`\`\`js\r
const workbook = XLSX.utils.book_new(); // 通过 \`book_new\` 方法创建一个虚拟 workbook。\r
const worksheet = XLSX.utils.json_to_sheet(jsonData); // 通过 \`json_to_sheet\` 等方法创建一个虚拟 worksheet。\r
XLSX.utils.book_append_sheet(workbook, worksheet, \`Sheet1\`); // 将虚拟 worksheet 添加入虚拟 workbook中\r
XLSX.writeFile(workbook, \`filename.xlsx\`); // 导出创建的虚拟 workbook\r
\`\`\`\r
\r
类似创建虚拟 worksheet 的方法还有：\r
\r
1.  \`aoa_to_sheet\` 通过二维数组转为虚拟 worksheet。\r
1.  \`table_to_sheet\` 通过 table dom 标签转为虚拟 worksheet。\r
\r
对于已经存在的表单可以进行追加操作：\r
\r
1. \`sheet_add_aoa\` 将数组数据添加到现有的 worksheet 中。\r
1. \`sheet_add_json\` 将对象数据添加到现有的 worksheet 中。\r
\r
\`\`\`js\r
XLSX.utils.sheet_add_aoa(worksheet, [['emoji', 20, 'w', 165]]);\r
\`\`\`\r
\r
## 删除\r
\r
该库目前还没有直接删除表单或者列行的方法可以调用，这意味着在删除现有表单或数据时常常需要重建。\r
\r
如果只改变数据，使用工具函数进行自动生成也许会方便一些：\r
\r
\`\`\`js\r
const xlsxData = [\r
  {\r
    name: 'sheet1',\r
    data: [\r
      { name: 'Wendy', age: 20, sex: 'w', height: 158 },\r
      { name: 'Anna', age: 19, sex: 'w', height: 160 },\r
    ],\r
  },\r
  {\r
    name: 'sheet2',\r
    data: [{ name: 'Ben,Ke', age: 22, sex: 'm', height: 172 }],\r
  },\r
];\r
\`\`\`\r
\r
\`\`\`js\r
function data2workbook(data) {\r
  const workbook = XLSX.utils.book_new();\r
  data.forEach((sheet) => {\r
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);\r
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);\r
  });\r
  return workbook;\r
  // XLSX.writeFile(workbook, \`filename.xlsx\`);\r
}\r
\`\`\`\r
\r
## 参考\r
\r
[xlsx - npm](https://www.npmjs.com/package/xlsx)\r
`;export{n as default};
