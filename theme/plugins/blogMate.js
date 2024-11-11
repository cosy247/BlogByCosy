import md5 from 'md5';

/**
 * 相似度对比
 * @param s 文本1
 * @param t 文本2
 * @param f 小数位精确度，默认2位
 * @returns {string|number|*} 百分数前的数值，最大100. 比如 ：90.32
 */
function similar(s, t, f = 2) {
    if (!s || !t) return 0;
    if (s === t) return 100;
    let l = s.length > t.length ? s.length : t.length;
    let n = s.length;
    let m = t.length;
    let d = [];
    const min = function (a, b, c) {
        return a < b ? (a < c ? a : c) : b < c ? b : c;
    };
    let i, j, si, tj, cost;
    if (n === 0) return m;
    if (m === 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1);
            if (si === tj) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    let res = (1 - d[n][m] / l) * 100;
    return res.toFixed(f);
}

export default (pageConfig) => ({
    name: 'plugins-blog-meta',
    onPrepared(app) {
        const { countMateNames = [], isArrMateNames = [] } = pageConfig;

        const countMateData = countMateNames.reduce((countMateData, metaName) => {
            countMateData[metaName] = {};
            return countMateData;
        }, {});

        if (pageConfig.shadowPassword) {
            pageConfig.shadowPassword = md5(pageConfig.shadowPassword);
        }

        const pageList = [];
        const shadowList = [];

        app.pages.forEach((page) => {
            const {
                htmlFilePathRelative: path,
                frontmatter,
                data: {
                    git: { createdTime, updatedTime, contributors },
                },
            } = page;

            if (!path || path === 'index.html' || path === '404.html') return pageList;
            if (path[0] === '@' && process.env.NODE_ENV !== 'development') return pageList;

            frontmatter.date = frontmatter.createDate = createdTime ? new Date(createdTime).toLocaleDateString() : '代发布';
            frontmatter.date = frontmatter.createDate = createdTime ? new Date(createdTime).toLocaleDateString() : '代发布';
            // frontmatter.updateDate = updatedTime ? new Date(updatedTime).toLocaleDateString() : '代发布';
            // frontmatter.updateCount = contributors.reduce((count, contributor) => count + contributor.commits, 0);

            if (path[0] === '@') {
                frontmatter.date = '草稿箱';
            }

            if (frontmatter.shadow === true) {
                // 记录数据
                shadowList.push({ path, frontmatter });
            } else {
                // 数组属性转化
                isArrMateNames.forEach((metaName) => {
                    if (frontmatter[metaName]) {
                        frontmatter[metaName] = frontmatter[metaName].split(' ');
                    }
                });

                // 属性计数
                countMateNames.forEach((metaName) => {
                    const metaValue = frontmatter[metaName];
                    if (metaValue) {
                        if (isArrMateNames.includes(metaName)) {
                            metaValue.forEach((value) => {
                                if (!countMateData[metaName][value]) {
                                    countMateData[metaName][value] = 0;
                                }
                                countMateData[metaName][value]++;
                            });
                        } else {
                            if (!countMateData[metaName][metaValue]) {
                                countMateData[metaName][metaValue] = 0;
                            }
                            countMateData[metaName][metaValue]++;
                        }
                    }
                });

                // 记录数据
                pageList.push({ path, frontmatter });
            }
        }, []);

        // 推荐文章 recommendations
        if (pageConfig.isOpenBlurRecommend) {
            pageList.forEach((item) => {
                const similars = pageList
                    .map((item2) => ({
                        id: item2.frontmatter.id,
                        similar: similar(
                            item.frontmatter.title + item.frontmatter.tags,
                            item2.frontmatter.title + item2.frontmatter.tags
                        ),
                    }))
                    .filter((item2) => item2.similar !== 100);
                similars.sort((i, j) => j.similar - i.similar).map((i) => i.id);
                if (item.frontmatter.recommendations) {
                    item.frontmatter.recommendations = Array.from(
                        new Set((item.frontmatter.recommendations + '').split(' ').concat(similars))
                    );
                } else {
                    item.frontmatter.recommendations = similars;
                }
                item.frontmatter.recommendations = item.frontmatter.recommendations
                    .slice(0, pageConfig.maxRecommendQuantity || 5)
                    .map((i) => i.id);
            });
        }

        // 排序
        pageList.sort((b1, b2) => (b2.frontmatter.top || 0) - (b1.frontmatter.top || 0));
        pageList.sort((b1, b2) =>
            b1.frontmatter.date == '代发布' ? -1 : new Date(b2.frontmatter.date) - new Date(b1.frontmatter.date)
        );
        shadowList.sort((b1, b2) => new Date(b2.frontmatter.date) - new Date(b1.frontmatter.date));

        app.writeTemp('blogMate.json', JSON.stringify({ pageList, countMateData, pageConfig, shadowList }));
    },
});
