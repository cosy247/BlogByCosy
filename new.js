import { createRequire } from "module";
import fs from "fs";

const docsPath = "./docs";
const require = createRequire(import.meta.url);
const readline = require("readline");
const stdio = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

stdio.on("close", () => process.exit(0));

function getInput(questionText, defaultText) {
  return new Promise((resolve) => {
    stdio.question(questionText, (text) => {
      resolve(text || defaultText);
    });
  });
}

function isFileExisted(fileName) {
  return new Promise((resolve) => {
    fs.access(fileName, (err) => {
      resolve(!!!err);
    });
  });
}

// 获取用户输入
let fileName = await getInput("🐲请输入文件名: ");
while (true) {
  if (!fileName) {
    fileName = await getInput("❗ 请输入文件名: ");
  } else if (await isFileExisted(`${docsPath}/@${fileName}.md`)) {
    fileName = await getInput(`❗ 已存在草稿文件: @${fileName}.md, 请重新输入文件名: `);
  } else if (await isFileExisted(`${docsPath}/${fileName}.md`)) {
    fileName = await getInput(`❗ 已存在文件: ${fileName}.md, 请重新输入文件名: `);
	} else {
		break;
	}
}
const fileTitle = await getInput(`🐲 请输入文章标题(${fileName}): `, fileName);
const fileDescription = await getInput(`🐲 请输入文章描述(${fileTitle}): `, fileTitle);

// 生成模板文件
let templateContent = fs.readFileSync(".md", "utf8");
templateContent = templateContent.replaceAll("{ id }", Date.now());
templateContent = templateContent.replaceAll("{ title }", fileTitle);
templateContent = templateContent.replaceAll("{ description }", fileDescription);
fs.writeFileSync(`${docsPath}/@${fileName}.md`, templateContent);
console.log(`🐲生成草稿文件成功: ${docsPath}@${fileName}.md`);

// // 退出
stdio.close();
