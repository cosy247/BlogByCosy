// https://www.zhipin.com/web/geek/job?query=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B&city=101020100&experience=104,105&scale=303,304,305,306,302&jobType=1901&salary=405
// https://www.zhipin.com/web/geek/job?query=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B&city=101270100&experience=104,105&scale=303,304,305,306,302&jobType=1901&salary=405

(function clickTask(taskCount = 1, jobs = [...document.querySelectorAll(".job-card-left")]) {
  const job = jobs.pop();
  if (job) {
    const jobTitle = job.querySelector(".job-name").textContent;
    if (/前端|js|javascript|vue/i.test(jobTitle) && !/外派|驻场|短期|调遣|外包/i.test(jobTitle)) {
      job.querySelector(".start-chat-btn")?.click();
      setTimeout(() => {
        if (!document.querySelector(".greet-boss-container")) return;
        document.querySelector(".greet-boss-container .icon-close").click();
        console.log(`已投${taskCount}份简历🤖: ${jobTitle}🦄`);
        if (taskCount <= 50) {
          clickTask(taskCount + 1, jobs);
        }
      }, Math.random() * 10 * 1000 + 5000);
    } else {
      clickTask(taskCount, jobs);
    }
  } else {
    document.querySelector(".ui-icon-arrow-right").click();
    setTimeout(() => {
      clickTask(taskCount);
    }, 3000);
  }
})();

(function clickTask(taskCount = 1, jobs = [...document.querySelectorAll(".job-card-left")]) {
  const job = jobs.pop();
  if (job) {
    const jobTitle = job.querySelector(".job-name").textContent;
    if (!/外派|驻场|短期|调遣/i.test(jobTitle)) {
      job.querySelector(".start-chat-btn")?.click();
      setTimeout(() => {
        if (!document.querySelector(".greet-boss-container")) return;
        document.querySelector(".greet-boss-container .icon-close").click();
        console.log(`已投${taskCount}份简历🤖: ${jobTitle}🦄`);
        clickTask(taskCount + 1, jobs);
      }, Math.random() * 3 * 1000 + 1000);
    } else {
      clickTask(taskCount, jobs);
    }
  } else {
    document.querySelector(".ui-icon-arrow-right").click();
    setTimeout(() => {
      clickTask(taskCount);
    }, 3000);
  }
})();

// https://www.zhipin.com/web/geek/chat
document.querySelector(".label-list > ul > li:nth-child(3)").click();

function sendMsg(taskCount = 1, jobs = [...document.querySelectorAll(".friend-content")]) {
  const job = jobs.pop();
  if (!job) return;
  const lastMsg = job.querySelector(".last-msg-text");
  if (["Boss还没查看你的消息？"].includes(lastMsg.textContent)) {
    job.click();
    setTimeout(() => {
      document.querySelector(".sentence-panel > ul > li").click();
      setTimeout(() => {
        const jobTitle = ele.querySelector(".name-text ~ span").textContent;
        console.log(`已发${taskCount}条消息🤖: ${jobTitle}🦄`);
        sendMsg(taskCount + 1, jobs);
      }, 1000);
    }, 1000);
  } else {
    sendMsg(taskCount, jobs);
  }
}

setTimeout(() => {
  sendMsg();
}, 1000);
