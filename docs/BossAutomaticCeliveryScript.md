---
id: 1752133053908 # 文章id
date: 2025/7/10 15:37 # 时间
title: Boss直聘网页自动投递脚本 # 文章标题
description: Boss直聘网页自动投递脚本 # 文章描述
tag: 随笔 # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Boss 直聘网页自动投递脚本

先在浏览器中登录 Boss 直聘网，筛选出自己要求的岗位列表。如以下地址：

[https://www.zhipin.com/web/geek/jobs?city=101270100&jobType=1901&salary=405&experience=105&scale=304,305,306,303&query=%E5%89%8D%E7%AB%AF](https://www.zhipin.com/web/geek/jobs?city=101270100&jobType=1901&salary=405&experience=105&scale=304,305,306,303&query=%E5%89%8D%E7%AB%AF)

按 `F12` 打开控制台输入以下代码并回车，将自动投递：

```js
(function clickTask(count = 1, jobCards = [...document.querySelectorAll('.job-card-box .job-name')]) {
  const job = jobCards.pop();
  if (job) {
    const jobName = job.innerText;
    if (['外包', '驻场', '短期', '长期', '稳定'].some((str) => jobName.includes(str))) {
      console.log(`跳过🤖: ${jobName}🦄`);
      return clickTask(count, jobCards);
    }

    job.click();
    console.log(`已投${count++}份简历🤖: ${jobName}🦄`);

    setTimeout(() => {
      document.querySelector('.op-btn.op-btn-chat')?.click();
      document.querySelector('.default-btn.sure-btn')?.click();
      document.querySelector('.default-btn.cancel-btn')?.click();
    }, 2000);

    setTimeout(() => {
      clickTask(count, jobCards);
    }, 4000);
  } else {
    document.querySelector('.search-btn').click();
    setTimeout(() => {
      clickTask(count);
    }, 2000);
  }
})();
```

![alt text](assets/@BossAutomaticCeliveryScript/image.png)
