// const path = require('path');
// const fs = require('fs');
import fs from 'fs';
import path from 'path';
import config from '../config';
import { exec } from 'child_process';

// 统计的属性
const statisticsAttrs = config.menus
  .filter((menu) => menu.type === 'statistics' && menu.statistics?.isMultiple)
  .map((d) => d.statistics.frontName);

// 统计的多选属性
const multipleAttrs = config.menus
  .filter((menu) => menu.type === 'statistics' && menu.statistics?.isMultiple)
  .map((d) => d.statistics.frontName);

function generatePageList() {
  const docsPath = path.join(__dirname, '../', config.docsDir);
  fs.readdir(docsPath, (err, files) => {
    if (err) return console.log(`❗premd: ${err}`);
    Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
          return new Promise((resolve) => {
            fs.stat(`${docsPath}/${file}`, (err, data) => {
              if (err || !data.isFile()) resolve('');
              else resolve(`${docsPath}/${file}`);
            });
          });
        })
    )
      .then((files) => {
        files = files.filter((d) => d);
        return Promise.all(
          files.map((file) => {
            return new Promise((resolve) => {
              const page = { file: file.split('/').at(-1).slice(0, -3), attrs: {}, date: '' };
              let flag = false;
              // 获取文章创建时间
              exec(`git log -- ${file}`, (err, d) => {
                if (!err) {
                  page.date = d
                    .toString()
                    .split('\n')
                    .findLast((d) => d.startsWith('Date:   '))
                    .slice(8);
                }
                if (flag) resolve(page);
                else flag = true;
              });
              // 获取文章的配置信息
              fs.readFile(file, (err, content) => {
                if (err) {
                  console.log(`❗premd: ${err}`);
                } else {
                  // 截取文件开头的配置信息文本
                  const pageConfig = content.toString().match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
                  if (pageConfig) {
                    pageConfig[0]
                      .replaceAll('\r', '')
                      .split('\n')
                      .filter((d) => d.trim())
                      .forEach((attr) => {
                        const [name, value = ''] = attr.split(':');
                        const val = value.split('#')[0].trim();
                        if (val === '') return;
                        if (multipleAttrs.includes(name)) {
                          page.attrs[name.trim()] = val.split(' ').map((d) => d.trim());
                        } else {
                          page.attrs[name.trim()] = val;
                        }
                      });
                  }
                }
                if (flag) resolve(page);
                else flag = true;
              });
            });
          })
        );
      })
      .then((pageList) => {
        // temp文件内
        const docsData = {
          pageList: pageList
            .filter((p) => p.attrs.shadow !== 'true' && p.file !== 'README')
            .sort((p1, p2) => new Date(p2.date).valueOf() - new Date(p1.date).valueOf()),
          statistics: {},
        };
        // 统计menu中的statistics
        statisticsAttrs.forEach((attrName) => (docsData.statistics[attrName] = {}));
        pageList.forEach((page) => {
          statisticsAttrs.forEach((attrName) => {
            const pageAttr = page.attrs[attrName];
            if (!pageAttr) return;
            if (multipleAttrs.includes(attrName)) {
              pageAttr.forEach((val) => {
                if (docsData.statistics[attrName][val]) {
                  docsData.statistics[attrName][val]++;
                } else {
                  docsData.statistics[attrName][val] = 1;
                }
              });
            } else {
              if (docsData.statistics[attrName][pageAttr]) {
                docsData.statistics[attrName][pageAttr]++;
              } else {
                docsData.statistics[attrName][pageAttr] = 1;
              }
            }
          });
        });
        // 写入temp文件
        const targetDir = path.join(__dirname, '../', config.tempDir);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        const targetFile = path.join(targetDir, 'docsData.json');
        fs.writeFile(targetFile, JSON.stringify(docsData), (err) => {
          if (err) console.log(`❗premd: ${err}`);
        });
      });
  });
}

generatePageList();

export default function (cc) {
  const docsDir = path.join(__dirname, '../', config.docsDir);
  return {
    name: 'vite:premd',
    enforce: 'pre',
    handleHotUpdate(ctx) {
      if (!ctx.file.startsWith(docsDir)) return;
      generatePageList();
    },
  };
}
