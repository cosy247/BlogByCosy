import md5 from "md5";

export default ({ config, countMateNames = [], isArrMateNames = [] }) => ({
  name: "plugins-blog-meta",
  onPrepared(app) {
    const countMateData = countMateNames.reduce((countMateData, metaName) => {
      countMateData[metaName] = {};
      return countMateData;
    }, {});

    const themeConfig = app.pages.find((page) => page.filePathRelative === "README.md").frontmatter;
    if (themeConfig.shadowPassword) {
      themeConfig.shadowPassword = md5(themeConfig.shadowPassword);
    }

    const pageDatas = [];
    const shadowDatas = [];

    app.pages.forEach((page) => {
      const {
        htmlFilePathRelative: path,
        frontmatter,
        data: {
          git: { createdTime, updatedTime, contributors },
        },
      } = page;

      if (!path || path === "index.html" || path === "404.html") return pageDatas;
      if (path[0] === "@" && process.env.NODE_ENV !== "development") return pageDatas;

      frontmatter.date = frontmatter.createDate = createdTime ? new Date(createdTime).toLocaleDateString() : "代发布";
      frontmatter.updateDate = updatedTime ? new Date(updatedTime).toLocaleDateString() : "代发布";
      frontmatter.updateCount = contributors.reduce((count, contributor) => count + contributor.commits, 0);

      if (frontmatter.shadow === true) {
        // 记录数据
        shadowDatas.push({ path, frontmatter });
      } else {
        // 数组属性转化
        isArrMateNames.forEach((metaName) => {
          if (frontmatter[metaName]) {
            frontmatter[metaName] = frontmatter[metaName].split(" ");
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
        pageDatas.push({ path, frontmatter });
      }
    }, []);

    pageDatas.sort((b1, b2) => new Date(b2.frontmatter.date) - new Date(b1.frontmatter.date));
    shadowDatas.sort((b1, b2) => new Date(b2.frontmatter.date) - new Date(b1.frontmatter.date));

    app.writeTemp("pageConfig.json", JSON.stringify(config));
    app.writeTemp("blogMate.json", JSON.stringify({ pageDatas, countMateData, themeConfig }));
    app.writeTemp("shadows.json", JSON.stringify(shadowDatas));
  },
});
