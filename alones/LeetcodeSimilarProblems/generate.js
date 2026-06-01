import fs from 'fs';

const headers = {
  'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
  'Content-Type': 'application/json',
  Accept: '*/*',
  Host: 'leetcode.cn',
  Connection: 'keep-alive',
};

const MAX_DEPTH = 4;

/**
 * 去重并构建树（相同 slug 只保留第一次出现）
 * @param {Array} children - 子节点数组
 * @param {Set} seenSlugs - 已见过的 slug 集合
 * @returns {Array} 去重后的子节点数组
 */
const deduplicateChildren = (children, seenSlugs) => {
  if (!Array.isArray(children)) return [];
  
  const result = [];
  for (const child of children) {
    // 如果这个 slug 已经出现过，跳过（不加入结果）
    if (seenSlugs.has(child.slug)) {
      console.log(`  ⏭️ 跳过重复节点: ${child.slug} (${child.name})`);
      continue;
    }
    
    // 标记为已见过
    seenSlugs.add(child.slug);
    
    // 递归处理子节点的 children
    const dedupedChild = {
      ...child,
      children: deduplicateChildren(child.children, seenSlugs)
    };
    result.push(dedupedChild);
  }
  return result;
};

/**
 * 获取题目的相似题目列表
 * @param {Object} problem - 题目对象
 * @param {Set} fetched - 已访问集合
 * @param {number} depth - 当前深度
 * @returns {Promise<Array>} 相似题目列表
 */
const fetchSimilar = async (problem, fetched = new Set(), depth = 0) => {
  const currentDepth = depth + 1;
  const indent = '  '.repeat(currentDepth);

  console.log(`${indent}🔍 [深度 ${currentDepth}/${MAX_DEPTH}] 获取相似题目: ${problem.slug}`);

  // 检查深度限制
  if (currentDepth >= MAX_DEPTH) {
    console.log(`${indent}⏸️ 达到最大深度 ${MAX_DEPTH}，停止递归`);
    return [];
  }

  if (fetched.has(problem.slug)) {
    console.log(`${indent}⏭️ 跳过已访问: ${problem.slug}`);
    return [];
  }
  fetched.add(problem.slug);

  try {
    const res = await fetch('https://leetcode.cn/graphql/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: 'query questionDetail($titleSlug: String!) { question(titleSlug: $titleSlug) { similarQuestions } }',
        variables: {
          titleSlug: problem.slug,
        },
        operationName: 'questionDetail',
      }),
    });

    console.log(`${indent}📡 API 响应状态: ${res.status} - ${problem.slug}`);

    const json = await res.json();

    if (!json.data || !json.data.question || !json.data.question.similarQuestions) {
      console.log(`${indent}⚠️ 未找到相似题目: ${problem.slug}`);
      return [];
    }

    const similarList = JSON.parse(json.data.question.similarQuestions).map((item) => ({
      name: item.translatedTitle,
      slug: item.titleSlug,
      link: `https://leetcode.cn/problems/${item.titleSlug}/`,
    }));

    console.log(`${indent}✅ 找到 ${similarList.length} 个相似题目: ${problem.slug}`);

    const result = [];
    for (const item of similarList) {
      console.log(`${indent}  📌 处理子节点: ${item.slug}`);
      result.push({
        ...item,
        children: await fetchSimilar(item, fetched, currentDepth),
      });
    }
    return result;
  } catch (error) {
    console.error(`${indent}❌ 获取相似题目失败 ${problem.slug}:`, error.message);
    return [];
  }
};

/**
 * 递归构建题目树
 * @param {Object} problem - 题目对象
 * @returns {Promise<Object|null>} 题目节点对象
 */
const buildTree = async (problem) => {
  console.log(`\n🌳 开始构建树结构，根节点: ${problem.slug}`);
  console.log(`📏 最大深度限制: ${MAX_DEPTH}\n`);
  
  const rawTree = {
    ...problem,
    children: await fetchSimilar(problem, new Set(), 0),
  };
  
  // 去重：相同 slug 只保留第一次出现
  console.log(`\n🧹 开始去重处理...`);
  const seenSlugs = new Set();
  // 先将根节点加入已见过集合
  seenSlugs.add(rawTree.slug);
  console.log(`📌 保留根节点: ${rawTree.slug} (${rawTree.name})`);
  
  const dedupedTree = {
    ...rawTree,
    children: deduplicateChildren(rawTree.children, seenSlugs)
  };
  
  console.log(`✅ 去重完成，共保留 ${seenSlugs.size} 个唯一节点`);
  return dedupedTree;
};

/**
 * 获取今日题目
 * @returns {Promise<Object>} 今日题目信息
 */
async function getTodayQuestion() {
  console.log('📅 正在获取今日题目...');

  try {
    const res = await fetch('https://leetcode.cn/graphql/', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query:
          'query CalendarTaskSchedule($days: Int!) { calendarTaskSchedule(days: $days) { dailyQuestions {name slug link} } }',
        variables: {
          days: 0,
        },
        operationName: 'CalendarTaskSchedule',
      }),
    });

    console.log(`📡 获取今日题目 API 响应状态: ${res.status}`);

    const data = await res.json();

    if (
      !data.data ||
      !data.data.calendarTaskSchedule ||
      !data.data.calendarTaskSchedule.dailyQuestions ||
      data.data.calendarTaskSchedule.dailyQuestions.length === 0
    ) {
      throw new Error('未找到今日题目');
    }

    const todayQ = data.data.calendarTaskSchedule.dailyQuestions[0];
    console.log(`✅ 今日题目: ${todayQ.name} (${todayQ.slug})`);
    return todayQ;
  } catch (error) {
    console.error('❌ 获取今日题目失败:', error.message);
    throw error;
  }
}

/**
 * 统计树中的节点数量
 * @param {Object} node - 树节点
 * @returns {number} 节点总数
 */
const countNodes = (node) => {
  if (!node) return 0;
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
};

/**
 * 统计唯一的题目数量
 */
const countUniqueSlugs = (node, uniqueSet = new Set()) => {
  if (!node || !node.slug) return uniqueSet;
  uniqueSet.add(node.slug);
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      countUniqueSlugs(child, uniqueSet);
    }
  }
  return uniqueSet;
};

/**
 * 主函数
 */
async function main() {
  console.log('🚀 程序开始运行...');
  console.log(`⚙️ 配置: 最大深度 = ${MAX_DEPTH}`);
  console.log('='.repeat(60));

  try {
    const todayQ = await getTodayQuestion();
    console.log('='.repeat(60));

    const startTime = Date.now();
    const tree = await buildTree(todayQ);
    const endTime = Date.now();

    console.log('='.repeat(60));
    console.log(`⏱️ 构建耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);

    console.log('💾 正在写入文件...');
    fs.writeFileSync('./problemTree.js', `export const problemTree = ${JSON.stringify(tree, null, 2)}`);
    console.log('✅ 成功生成 ./problemTree.js');

    const totalNodes = countNodes(tree);
    const uniqueSlugs = countUniqueSlugs(tree);
    console.log(`📊 树节点统计: 共 ${totalNodes} 个节点`);
    console.log(`📊 唯一题目统计: 共 ${uniqueSlugs.size} 个不同题目`);
    console.log('✨ 程序执行完成！');
  } catch (error) {
    console.error('❌ 主程序执行失败:', error.message);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

// 执行主函数
console.log(`📂 当前工作目录: ${process.cwd()}`);
main();
