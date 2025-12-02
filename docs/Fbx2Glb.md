---
id: 1764655579174 # 文章id
date: 2025/12/2 14:06 # 时间
title: Node.js 批量将 FBX 模型转 GLB 模型 # 文章标题
description: Node.js 批量将 FBX 模型转 GLB 模型 # 文章描述
tag: Node # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Node.js 批量将 FBX 模型转 GLB 模型

在 3D 可视化、WebGL 开发或元宇宙项目中，FBX 作为常用的 3D 模型格式，常因体积较大、浏览器兼容性不足等问题，需要转换为更轻量、更通用的 GLB 格式。GLB 作为 glTF 标准的二进制封装格式，不仅体积更小，还能直接被 Three.js、Babylon.js 等主流 3D 引擎支持，是 Web 端 3D 模型的优选格式。可以使用 Node.js 结合 `fbx2gltf` 工具，实现 FBX 模型的批量转换。

## 核心依赖工具

转换的核心是 [fbx2gltf](https://www.npmjs.com/package/fbx2gltf) 工具，它是一款专门用于 FBX 转 glTF/GLB 的命令行工具，支持 Windows、Mac、Linux 多平台。我们通过 npm 安装其 Node.js 封装版本：

```bash
npm install fbx2gltf --save-dev
```

安装后，工具的可执行文件会存放在 `node_modules/fbx2gltf/bin/[系统平台]` 目录下（Windows 平台为 `Windows_NT/FBX2glTF.exe`）。

## 目录结构约定

为了让批量转换更有序，建议提前规划目录结构：

```
your-project/
├── models/                # 存放原始 FBX 模型（支持子文件夹）
│   ├── 穿越机/
│   │   └── h582-大疆Avata2无人机_FBX.fbx
│   ├── 建筑模型/
│   │   └── source/
│   │       └── office.fbx
│   └── car/
│       └── sedan.fbx
├── public/
│   └── glb/               # 转换后的 GLB 输出目录（自动生成）
└── fbx-to-glb.js          # 转换脚本（本文核心代码）
```

其中有的 gbx 文件会被包一层 source 文件夹。

## 创建转换脚本

`fbx2gltf`使用示例：

```js
const convert = require('fbx2gltf');
convert('path/to/some.fbx', 'path/to/target.glb', ['--khr-materials-unlit']).then(
  (destPath) => {
    // yay, do what we will with our shiny new GLB file!
  },
  (error) => {
    // ack, conversion failed: inspect 'error' for details
  }
);
```

创建 `fbx2glb.js` 文件，遍历模型目录、格式筛选、批量转换逻辑，代码如下：

```javascript title=fbx2glb.js
const fs = require('fs');
const path = require('path');
const convert = require('fbx2gltf');

// 1. 配置核心路径（根据实际安装路径调整）
const inputDir = path.join(__dirname, 'models'); // 原始 FBX 目录
const outputDir = path.join(__dirname, 'public2/glb2'); // 输出 GLB 目录

/**
 * 异步遍历文件夹（含子文件夹），获取所有文件绝对路径
 * @param {string} dir - 目标文件夹路径
 * @returns {Promise<string[]>} 所有文件路径数组
 */
async function traverseDirPromise(dir) {
  const result = [];
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        // 递归处理子文件夹
        const subFiles = await traverseDirPromise(filePath);
        result.push(...subFiles);
      } else {
        result.push(filePath);
      }
    }
    return result;
  } catch (err) {
    console.error(`❌ 目录遍历失败：${err.message}`);
    throw err; // 抛出错误，中断流程
  }
}

/**
 * 4. FBX 转 GLB 核心函数
 * @param {string} fbxPath - 原始 FBX 文件路径
 */
async function convertFbxToGlb(fbxPath) {
  try {
    // 提取模型名称（适配子文件夹命名规则）
    const dirParts = path.dirname(fbxPath).split(path.sep);
    const [modelName1, modelName2] = dirParts.slice(-2);
    const modelName = modelName2 === 'source' ? modelName1 : modelName2; // 特殊目录适配
    const outputPath = path.join(outputDir, `${modelName}.glb`);

    convert(fbxPath, outputPath, ['--khr-materials-unlit']).then(
      () => {
        console.log(`✅ 转换成功 [${modelName}]：${outputPath}`);
      },
      (error) => {
        return console.error(`❌ 转换失败 [${modelName}]：${error.message}`);
      }
    );
  } catch (err) {
    console.error(`❌ 转换异常 [${path.basename(fbxPath)}]：${err.message}`);
  }
}

(async () => {
  // 初始化输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 遍历所有文件
  const allFiles = await traverseDirPromise(inputDir);

  // 筛选 FBX 文件并转换
  const fbxFiles = allFiles.filter((file) => path.extname(file).toLowerCase() === '.fbx');
  if (fbxFiles.length === 0) {
    return console.log('ℹ️  未找到需要转换的 FBX 文件');
  } else {
    console.log(`ℹ️  找到 ${fbxFiles.length} 个 FBX 文件，开始批量转换...`);
    fbxFiles.forEach((fbxPath) => convertFbxToGlb(fbxPath));
  }
})();
```

## 执行脚本

**使用 node 直接执行脚本：**

```bash
node fbx2glb.js
```

**集成 package.json 中**

```json
{
  "scripts": {
    "fbx2glb:": "node fbx-to-glb.js"
  }
}
```

并执行：

```bash
npm run fbx2glb
```

## 参考

1. [fbx2gltf - npm](https://www.npmjs.com/package/fbx2gltf)
