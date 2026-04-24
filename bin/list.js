import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../docs');

// 补零工具函数（确保数字为两位数）
const padZero = (num) => num.toString().padStart(2, '0');

// 格式化日期时间（补零处理）
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // 月份从0开始
  const day = padZero(date.getDate());
  return `${year}/${month}/${day}`;
};

// 收集所有.md文件
async function collectMdFiles(dir) {
  let files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMdFiles(fullPath)));
    else if (entry.isFile() && path.extname(fullPath) === '.md') files.push(fullPath);
  }
  return files;
}

// 提取信息（支持标题后带注释）
async function extractInfo(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    // 匹配标题（忽略#注释）
    const titleMatch = content.match(/^\s*title\s*:\s*(['"]?)(.*?)\1\s*(?:#.*)?$/m);
    const title = titleMatch ? titleMatch[2].trim() : '';

    // 提取日期（仅保留有日期的文件）
    const dateMatch = content.match(/^\s*date\s*:\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2})/m);
    if (!dateMatch) return null;
    const date = new Date(dateMatch[1].replace(/-/g, '/'));

    return { filePath, title, date };
  } catch (err) {
    console.error(`读取失败 ${filePath}:`, err.message);
    return null;
  }
}

// 主函数
async function main() {
  try {
    await fs.access(docsDir);
    const mdFiles = await collectMdFiles(docsDir);
    const fileInfos = (await Promise.all(mdFiles.map(extractInfo))).filter(Boolean);

    // 排序逻辑
    fileInfos.sort((a, b) => {
      const aPin = path.basename(a.filePath).startsWith('@');
      const bPin = path.basename(b.filePath).startsWith('@');
      if (aPin !== bPin) return aPin ? 1 : -1;
      return b.date - a.date;
    });

    // 计算最长路径长度（用于对齐）
    const maxPathLength = fileInfos.reduce((max, info) => Math.max(info.filePath.length, max), 0);

    // 输出格式（时间补零）
    console.log(`找到 ${fileInfos.length} 个带日期的markdown文件：\n`);
    fileInfos.forEach((info) => {
      const pinnedMark = path.basename(info.filePath).startsWith('@') ? '📌' : '📘';
      const dateStr = formatDate(info.date); // 使用补零后的日期格式
      console.log(`${pinnedMark} ${info.filePath.padEnd(maxPathLength)} ${dateStr}  ${info.title}`);
    });
  } catch (err) {
    console.error(err.code === 'ENOENT' ? `错误：docs目录不存在 - ${docsDir}` : `执行出错: ${err.message}`);
  }
}

main();
