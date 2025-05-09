import fs from 'fs';
import path from 'path';
import config from '../../config';
import { exec } from 'child_process';

/** 统计的属性名称 */
const statisticsAttrs = config.menus.filter((menu) => menu.type === 'statistics').map((d) => d.statistics.frontName);

/** 统计的多选属性名称 */
const multipleAttrs = config.menus
  .filter((menu) => menu.type === 'statistics' && menu.statistics?.isMultiple)
  .map((d) => d.statistics.frontName);

/**
 * @description: 获取两个字符串的相似度
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
function getSimilarity(str1, str2) {
  let sameNum = 0;
  //寻找相同字符
  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str2.length; j++) {
      if (str1[i] === str2[j]) {
        sameNum++;
        break;
      }
    }
  }
  let length = str1.length > str2.length ? str1.length : str2.length;
  return (sameNum / length) * 100 || 0;
}

function generatePageList() {
  const docsPath = path.join(__dirname, '../../docs');
  fs.readdir(docsPath, (err, files) => {
    if (err) return console.log(`❗premd: ${err}`);
    Promise.all(
      files
        .filter((file) => file.endsWith('.md') && file[0] != '@')
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
                  page.date =
                    d
                      .toString()
                      .split('\n')
                      .findLast((d) => d.startsWith('Date:   '))
                      ?.slice(8) || Date.now();
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
        /**temp文件内容 */
        const docsData = {
          /** 文章列表，去除隐藏文件和README，以时间排序 */
          pageList: pageList
            .filter((p) => p.attrs.shadow !== 'true' && p.file !== 'README')
            .sort((p1, p2) => new Date(p2.date).valueOf() - new Date(p1.date).valueOf()),
          /** 数据属性的集合 */
          statistics: {},
        };

        /** 用户配置的相关文章推荐数 */
        const similarRecommendNumber = Number(config.similarRecommendNumber);
        /**
         * 判断用户是否开启自动推荐功能
         */
        if (similarRecommendNumber > 0) {
          // 为每个文章寻找相似文章
          docsData.pageList.forEach((page) => {
            /** 生成相似判断的字符串 */
            const simiName = `${page.attrs.title}${statisticsAttrs.map((n) => page.attrs[n])}`;
            /** 用户自己为文章添加的相关推荐 */
            const recommendations = (page.attrs.recommendations || '').split(' ').filter((d) => d);
            /** 获取与全部文章的相似度 */
            const similaritys = docsData.pageList.map((page2) => {
              /** 相似度，id为目标文章id，value为相似度 */
              const similarity = { id: page2.attrs.id, value: 0 };
              /**
               * 1. 用户推荐，相似度为101
               * 2. 相同文章相似度为 -1，方便排序后剔除
               * 3. 其他情况比较文章标题和统计属性的组合字符串相似度
               */
              if (recommendations.includes(page2.attrs.id)) {
                similarity.value = 101;
              } else if (page.attrs.id === page2.attrs.id) {
                similarity.value = -1;
              } else {
                const simiName2 = `${page2.attrs.title}${statisticsAttrs.map((n) => page2.attrs[n])}`;
                similarity.value = getSimilarity(simiName, simiName2);
              }
              return similarity;
            });
            // 对相似度解析排序
            similaritys.sort((s1, s2) => s2.value - s1.value);
            // 去除相同文章
            similaritys.pop();
            // 获取用户推荐并且存在的文章数量
            const realRecommendNumer = similaritys.filter((d) => d.value === 101).length;
            // 覆盖文章的相似推荐属性，如果用户真实推荐的数量大于设置数，则使用真实推荐的
            page.attrs.recommendations = similaritys
              .slice(0, Math.max(similarRecommendNumber, realRecommendNumer))
              .map((d) => d.id);
          });
        }

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
        const targetDir = path.join(__dirname, '../../', config.tempDir);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        const targetFile = path.join(targetDir, 'docsData.json');
        fs.writeFile(targetFile, JSON.stringify(docsData), (err) => {
          if (err) console.log(`❗premd: ${err}`);
          console.log('🤖temp/docsData文件写入成功');
        });
      });
  });
}

generatePageList();

export default function (cc) {
  const docsDir = path.join(__dirname, '../docs');
  return {
    name: 'vite:premd',
    enforce: 'pre',

    // 文章更新时的钩子
    handleHotUpdate(ctx) {
      if (!ctx.file.startsWith(docsDir)) return;
      generatePageList();
    },
  };
}
