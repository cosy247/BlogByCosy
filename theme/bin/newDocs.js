#!/usr/bin/env node

import { createRequire } from 'module';
import fs from 'fs';
import vuepressConfig from '../../vuepress.config.js';

const require = createRequire(import.meta.url);
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
    if (!template.filePath) {
        console.log(`❗ 请先配置模板文件路径: config.template.filePath`);
        stdio.close();
    }
    if (!(await isFileExisted(template.filePath))) {
        console.log(`❗ 请检查是否存在模板文件: ${template.filePath}`);
        stdio.close();
    }

    // 输入属性信息
    const attrs = {
        timestamp: Date.now(),
        filename: await getInput('🐲 请输入文件名 : '),
    };
    while (true) {
        if (!attrs.filename) {
            attrs.filename = await getInput('❗ 请输入文件名: ');
        } else if (await isFileExisted(`${vuepressConfig.public}/@${attrs.filename}.md`)) {
            attrs.filename = await getInput(`❗ 已存在草稿文件: @${attrs.filename}.md, 请重新输入文件名: `);
        } else if (await isFileExisted(`${vuepressConfig.public}/${attrs.filename}.md`)) {
            attrs.filename = await getInput(`❗ 已存在文件: ${attrs.filename}.md, 请重新输入文件名: `);
        } else {
            break;
        }
    }
    for (const { name, defaultValue, inputPrompt } of template.inputs) {
        if (inputPrompt) {
            const calcValue0 = getDefaultValue(attrs, defaultValue);
            const defaultValue0 = calcValue0 === "undefined" ? '' : calcValue0;
            const inputPrompt0 = `🐲 ${inputPrompt}${defaultValue ? `(${defaultValue0})` : ''} : `;
            attrs[name] = await getInput(inputPrompt0) || defaultValue0;
        } else {
            attrs[name] = getDefaultValue(attrs, defaultValue);
        }
    }

    // 生成模板文件
    let templateContent = fs.readFileSync(template.filePath, 'utf8');
    Object.entries(attrs).forEach(([key, value]) => {
        templateContent = templateContent.replaceAll(`{ ${key} }`, value);
    });
    fs.writeFileSync(`${vuepressConfig.public}/@${attrs.filename}.md`, templateContent);
    console.log(`🐲生成草稿文件成功: ${vuepressConfig.public}/@${attrs.filename}.md`);

    // 关闭
    stdio.close();
})(vuepressConfig.template);
