const r=`---\r
id: 2\r
date: 2023/10/11\r
title: JS实现Blob、File、ArrayBuffer、base64、URL之间互转\r
tags: JS 前端\r
description: JS实现Blob、File、ArrayBuffer、base64、URL之间互转\r
---\r
\r
# js 实现 Blob、File、ArrayBuffer、base64、URL 之间互转\r
\r
## 引言\r
\r
在处理文件数据时常常需要将其转换为其他的类型数据以方便后续操作。例如在引入第三方库时，支持的类型可能在项目不能直接获取到，那么就需要进行类型转换。其中主要的类型包括 Blob、File、ArrayBuffer、base64、URL 。\r
\r
## 类型解释\r
\r
### Blob\r
\r
Blob（Binary Large Object）是一种二进制大对象，是一种存储大量二进制数据的容器。\r
\r
### File\r
\r
File 通常为用户在 input 上选择文件的结果。 继承于 Blob，一些处理 Blob 的函数也可以直接处理 FIle（如：URL.createObjectURL）。\r
\r
### ArrayBuffer\r
\r
ArrayBuffer 是一种用于表示通用的、固定长度的原始二进制数据缓冲区的对象。它提供了一种在内存中分配固定大小的缓冲区，可以存储各种类型的二进制数据。ArrayBuffer 本身并不能直接操作数据，而是需要使用 TypedArray 视图或 DataView 对象来读取和写入数据。\r
\r
### base64\r
\r
Base64 是一种用于表示二进制数据的编码方式，通过将二进制数据转换为文本字符串，以便在文本环境中传递。\r
\r
### URL\r
\r
URL 可以分为两种，一种为 base64 拼接上类型的 DataURL 地址，另一种为 createObjectURL 方法创建的当前页面生命周期下的 ObjectURL 地址。\r
\r
> DataURL: data:image/png;base64,iVBORw0KGgoAAAANS...\r
\r
> ObjectURL: blob:https://f1eb432b-1ef7-42...\r
\r
## Blob 类型转换\r
\r
对于 Blob 的 b 部分类型转换可以利用 FileReader 类的读取函数完成。其中包括 readAsArrayBuffer，readAsDataURL，readAsText（得到字符串形式内容）。\r
\r
### Blob 转 ArrayBuffer\r
\r
\`\`\`javascript\r
function blobToArrayBuffer(blob) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onload = () => resolve(reader.result);\r
    reader.readAsArrayBuffer(blob);\r
  });\r
}\r
\`\`\`\r
\r
### Blob 转 File\r
\r
直接使用 File 构造方法即可，可以指定文件名称，文件类型（如：image/jpeg），修改时间\r
\r
\`\`\`javascript\r
function blobToFile(blob, fileName, type = '', lastModified = Date.now()) {\r
  return new File(blob, fileName, { type, lastModified });\r
}\r
\`\`\`\r
\r
### Blob 转 DataURL\r
\r
\`\`\`javascript\r
function blobToDataURL(blob) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onloadend = () => resolve(reader.result);\r
    reader.readAsDataURL(blob);\r
  });\r
}\r
\`\`\`\r
\r
### Blob 转 base64\r
\r
先使用 FileReader 将 Blob 转为 DataURL，再对将 DataURL 的类型去掉既可以。\r
\r
\`\`\`javascript\r
function blobToBase64(blob) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onloadend = () => resolve(reader.result.split(',')[1]);\r
    reader.readAsDataURL(blob);\r
  });\r
}\r
// 使用 blobToDataURL\r
function blobToBase64(blob) {\r
  return new Promise((resolve) => {\r
    blobToDataURL(blob).then((dataURL) => resolve(dataURL.split(',')[1]));\r
  });\r
}\r
\`\`\`\r
\r
### Blob 转 ObjectURL\r
\r
\`\`\`javascript\r
function blobToObjectURL(blob) {\r
  return URL.createObjectURL(blob);\r
}\r
\`\`\`\r
\r
## File 类型转换\r
\r
### File 转 Blob、ArrayBuffer、base64、DataURL\r
\r
在大多数情况下是不需要转换的，因为 File 本来就继承与 Blob。在必须转换的情况下可以利用 FileReader.readAsArrayBuffer 获取到 arrayBuffer，再将 arrayBuffer 转为 Blob\r
\r
ArrayBuffer、DataURL 也可以通过 FileReader 转换\r
\r
base64 只需要把 DataURL 的类型去掉即可\r
\r
\`\`\`javascript\r
function fileToBlob(file) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onload = () => resolve(new Blob([reader.result], { type: file.type }));\r
    reader.readAsArrayBuffer(file);\r
  });\r
}\r
function fileToArrayBuffer(file) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onload = () => resolve(reader.result);\r
    reader.readAsArrayBuffer(file);\r
  });\r
}\r
function fileToDataURL(file) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onload = () => resolve(reader.result);\r
    reader.readAsDataURL(file);\r
  });\r
}\r
function fileToBase64(file) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onload = () => resolve(reader.result.split(',')[1]);\r
    reader.readAsDataURL(file);\r
  });\r
}\r
\`\`\`\r
\r
### File 转 ObjectURL\r
\r
\`\`\`javascript\r
function blobToObjectURL(blob) {\r
  return URL.createObjectURL(blob);\r
}\r
\`\`\`\r
\r
## ArrayBuffer 类型转换\r
\r
ArrayBuffer 是没有指定类型的二进制缓存，所以在一些转换时需要提供具体的类型。\r
\r
### ArrayBuffer 转 Blob、File\r
\r
直接使用 Blob、File 构造函数即可，可以指定数据类型。文件可以指定文件名和修改时间。\r
\r
\`\`\`javascript\r
function arrayBufferToBlob(arrayBuffer, type) {\r
  return new Blob(arrayBuffer, { type });\r
}\r
function arrayBufferToFile(arrayBuffer, fileName, type = '', lastModified = Date.now()) {\r
  return new File(arrayBuffer, fileName, { type, lastModified });\r
}\r
\`\`\`\r
\r
### ArrayBuffer 转 Base64\r
\r
需要先将 ArrayBuffer 转为二进制字符串，再将二进制字符串转为 Base64\r
\r
\`\`\`javascript\r
function arrayBufferToBase64(arrayBuffer) {\r
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));\r
}\r
\`\`\`\r
\r
### ArrayBuffer 转 DataURL\r
\r
1. 先将 ArrayBuffer 转为 base64，再加上类型即可。(推荐)\r
2. 先将 ArrayBuffer 转为 Blob，再使用 FileReader.readAsDataURL 获取。\r
\r
\`\`\`javascript\r
function arrayBufferToDataURL(arrayBuffer, type) {\r
  return \`data:\${type};base64,\${btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))}\`;\r
}\r
function arrayBufferToDataURL(arrayBuffer, type) {\r
  return new Promise((resolve) => {\r
    const reader = new FileReader();\r
    reader.onloadend = () => resolve(reader.result);\r
    reader.readAsDataURL(new Blob(arrayBuffer, { type }));\r
  });\r
}\r
\`\`\`\r
\r
### ArrayBuffer 转 ObjectURL\r
\r
需要先将 ArrayBuffer 转为 Blob 或者 File，再使用 createObjectURL 转为 ObjectURL\r
\r
\`\`\`javascript\r
function arrayBufferToObjectURL(arrayBuffer, type) {\r
  return URL.createObjectURL(new Blob(arrayBuffer, { type }));\r
}\r
\`\`\`\r
\r
### String 转 ArrayBuffer\r
\r
有时需要将其他类型转换为 ArrayBuffer，比如将字符串转为 ArrayBuffer：\r
\r
\`\`\`javascript\r
function stringToArrayBuffer(text) {\r
  return new TextEncoder().encode(text).buffer;\r
}\r
\`\`\`\r
\r
## DataURL 类型转换\r
\r
### DataURL 转 base64\r
\r
直接去掉类型即可\r
\r
\`\`\`javascript\r
function stringToArrayBuffer(dataURL) {\r
  return dataURL.split(',')[1];\r
}\r
\`\`\`\r
\r
### DataURL 转 ArrayBuffer\r
\r
在转为 ArrayBuffer 时需要先提取 base64 并解码，然后定义二进制字符串长度的 ArrayBuffer 并关联 Unit8Array，最后将字符串转为 UTF-16 码元并写入关联的 Unit8Array 中\r
\r
\`\`\`javascript\r
function dataURLToArrayBuffer(dataURL) {\r
  const base64 = dataURL.split(',')[1];\r
  const binaryString = atob(base64);\r
  const arrayBuffer = new ArrayBuffer(binaryString.length);\r
  const uint8Array = new Uint8Array(arrayBuffer);\r
  for (let i = 0; i < binaryString.length; i++) {\r
    uint8Array[i] = binaryString.charCodeAt(i);\r
  }\r
  return arrayBuffer;\r
}\r
\`\`\`\r
\r
### DataURL 转 Blob、File\r
\r
转为 Blob 或 File 时其实是几种数据切换：DataURL => base64 => binaryArray => typedArray => Blob\\File\r
\r
其中使用 atob 将 base64 解码为字符串，定义 Unit8Array 的 typedArray 用于缓存 UTF-16 码元，通过 String.chartCodeAt 获取字符的 UTF-16，最后使用 Blob\\File 的构造函数完成类型转换。由于 Blob 和 File 构造函数可以接受 typedArray，那么就没必要转 ArrayBuffer 了。另外转 File 时可以指定文件名\r
\r
\`\`\`javascript\r
function base64ToUnit8Array(base64) {\r
  const binaryString = atob(base64);\r
  const uint8Array = new Uint8Array(binaryString.length);\r
  for (let i = 0; i < binaryString.length; i++) {\r
    uint8Array[i] = binaryString.charCodeAt(i);\r
  }\r
  return uint8Array;\r
}\r
function dataURLToBlob(dataURL) {\r
  const [type, base64] = dataURL.split(',');\r
  return new Blob([base64ToUnit8Array(base64)], { type });\r
}\r
function dataURLToFile(dataURL, fileName) {\r
  const [type, base64] = dataURL.split(',');\r
  return new File([base64ToUnit8Array(base64)], fileName, { type });\r
}\r
\`\`\`\r
\r
### DataURL 转 ObjectURL\r
\r
由于 createObjectURL 接受 Blob 或 File，所以需要先转为 Blob 或 File。这里转为 Blob。\r
\r
\`\`\`javascript\r
function dataURLToObjectURL(dataURL) {\r
  const [type, base64] = dataURL.split(',');\r
  const binaryString = atob(base64);\r
  const uint8Array = new Uint8Array(binaryString.length);\r
  for (let i = 0; i < binaryString.length; i++) {\r
    uint8Array[i] = binaryString.charCodeAt(i);\r
  }\r
  return URL.createObjectURL(new Blob([uint8Array], { type }));\r
}\r
// 使用 dataURLToBlob\r
function dataURLToObjectURL(dataURL) {\r
  const type = dataURL.split(',')[0];\r
  return URL.createObjectURL(dataURLToBlob(dataURL), { type });\r
}\r
\`\`\`\r
\r
## ObjectURL 类型转换\r
\r
一般情况下是不会有 ObjectURL 转为其他类型的需求的，因为 ObjetcURL 的生命周期只在当前页面，只会在当前页面由其他资源生成，既然已经存在其原资源，也就没有必要再转换，如果需要其他类型的也完全可以使用原资源来转换。如果需要转换，那么第一步就是通过请求拉到定义的数据。这些转换也是适用远程请求的。\r
\r
### ObjectURL 转 Blob、File\r
\r
\`\`\`javascript\r
// function objectURLToBlob(objectURL, fileType) {\r
function objectURLToFile(objectURL, fileName, fileType) {\r
  const xhr = new XMLHttpRequest();\r
  xhr.open('GET', objectURL, true);\r
  xhr.responseType = 'blob';\r
  return new Promise((resolve, reject) => {\r
    xhr.onload = () => {\r
      if (xhr.status === 200) {\r
        const blob = xhr.response;\r
        // resolve(blob);\r
        const file = new File([blob], fileName, { type: fileType });\r
        resolve(file);\r
      } else {\r
        reject(new Error('Failed to load the resource'));\r
      }\r
    };\r
    xhr.onerror = () => reject(new Error('Network error'));\r
    xhr.send();\r
  });\r
}\r
\`\`\`\r
\r
### ObjectURL 转 ArrayBuffer、base64、DataURL\r
\r
先获取到文件数据，之后再使用 Blob 或者 File 类型转为 DataURL 或 ArrayBuffer 或其他类型即可。\r
\r
## 总结\r
\r
1. 对于 File 和 Blob 的转为其他类型大多依赖 FileReader。\r
\r
2. 其他类型转为 File 或者 Blob 时最终都是通过构造函数完成的。\r
\r
3. base64 和 DataURL 的转换只是类型的截取和拼接。\r
\r
4. 转为 ObjectURL 时需要先转为 Blob 或者 File 再通过 createObjectURL 生成。\r
`;export{r as default};
