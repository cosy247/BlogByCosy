#!/usr/bin/env node

import { createRequire } from 'module';
import fs from 'fs';
import vuepressConfig from '../../vuepress.config.js';
import inquirer from 'inquirer';

const require = createRequire(import.meta.url);
const blogMate = require(`../../${vuepressConfig.temp}/blogMate.json`);

const stdio = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
stdio.on('close', () => process.exit(0));

function isFileExisted(filename) {
  return new Promise((resolve) => {
    fs.access(filename, fs.constants.R_OK, (err) => {
      resolve(!err);
    });
  });
}

function getInput(questionText, defaultText) {
  return new Promise((resolve) => {
    stdio.question(questionText, (text) => {
      resolve(text || defaultText);
    });
  });
}

function getDefaultValue(attrs, defaultValue) {
  return new Function(...Object.keys(attrs), `return (\`${defaultValue}\`)`)(...Object.values(attrs));
}

// 执行函数
(async (template) => {
  // 检查模板文件是否存在
  if (!template.filePath) {
    console.log(`❗ 请先配置模板文件路径: config.template.filePath`);
    stdio.close();
  }
  if (!(await isFileExisted(template.filePath))) {
    console.log(`❗ 请检查是否存在模板文件: ${template.filePath}`);
    stdio.close();
  }

  // 定义属性信息
  const attrs = {
    $id: Date.now(),
    $filename: await getInput('🐲 请输入文件名 : '),
    $pageList: blogMate.pageList,
  };

  // 输入文件名
  while (true) {
    if (!attrs.$filename) {
      attrs.$filename = await getInput('❗ 请输入文件名: ');
    } else if (vuepressConfig.draft && (await isFileExisted(`${vuepressConfig.public}/@${attrs.$filename}.md`))) {
      attrs.$filename = await getInput(`❗ 已存在草稿文件: @${attrs.$filename}.md, 请重新输入文件名: `);
    } else if (await isFileExisted(`${vuepressConfig.public}/${attrs.$filename}.md`)) {
      attrs.$filename = await getInput(`❗ 已存在文件: ${attrs.$filename}.md, 请重新输入文件名: `);
    } else {
      break;
    }
  }

  // 输入属性信息
  for (const temp of template.inputs) {
    if (typeof temp.default === 'function') {
      temp.default = temp.default(attrs);
    }
    if (typeof temp.choices === 'function') {
      temp.choices = temp.choices(attrs);
    }

    attrs[temp.name] = (await inquirer.prompt(temp))[temp.name];
  }

  // 生成模板文件
  let templateContent = fs.readFileSync(template.filePath, 'utf8');
  Object.entries(attrs).forEach(([key, value]) => {
    templateContent = templateContent.replaceAll(`{ ${key} }`, value);
  });
  if (vuepressConfig.draft) {
    fs.writeFileSync(`${vuepressConfig.public}/@${attrs.$filename}.md`, templateContent);
    console.log(`🐲生成草稿文件成功: ${vuepressConfig.public}/@${attrs.$filename}.md`);
  } else {
    fs.writeFileSync(`${vuepressConfig.public}/${attrs.$filename}.md`, templateContent);
    console.log(`🐲生成文章文件成功: ${vuepressConfig.public}/${attrs.$filename}.md`);
  }

  // 关闭
  stdio.close();
})(vuepressConfig.template);
