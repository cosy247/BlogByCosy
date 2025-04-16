const r=`---\r
id: 1742803372977 # 文章id\r
title: a标签下载文件时设置文件名失效问题 # 文章标题\r
description: a标签下载文件时设置文件名失效问题 # 文章描述\r
tags: 前端 # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# a 标签下载文件时设置文件名失效问题\r
\r
## 问题描述\r
\r
通过 a 标签下载文件时通常可用以下代码：\r
\r
\`\`\`html\r
<a href="http://127.0.0.1:8000/files/temp.pdf" download="参考文件.pdf">文件下载</a>\r
\`\`\`\r
\r
如果说页面地址也是 \`http://127.0.0.1:8000\` 开始的话是没有问题的。但是如果是其他域，\`download\` 属性将会失效。\r
\r
## 解决方法\r
\r
1. 将文件和页面放在同一个域中，如果为第三方文件托管，可以使用 nginx 等代理进行转发。参考配置如下：\r
\r
\`\`\`ini title=nginx.conf\r
server {\r
    listen 80;  # 监听端口\r
    server_name mydomain.com;  # 你的域名\r
\r
    # 配置本地 HTML 文件服务\r
    location / {\r
        root /usr/share/nginx/html;  # HTML 文件的根目录\r
        index index.html;  # 默认索引文件\r
    }\r
\r
    # 配置外部 HTTP 服务的代理\r
    location /file {\r
        proxy_pass http://external-service.com/path/to/file;  # 目标服务地址\r
        proxy_set_header Host $host;  # 传递原始 Host 头\r
        proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实 IP\r
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递客户端真实 IP\r
        proxy_set_header X-Forwarded-Proto $scheme;  # 传递原始协议\r
    }\r
}\r
\`\`\`\r
\r
2. 先将文件下载，生成临时 URL，再动态生成 a 标签进行下载。参考代码如下：\r
\r
\`\`\`js\r
function downloadFile(url, filename) {\r
  fetch(url) // 获取文件\r
    .then((response) => response.blob())\r
    .then((blob) => {\r
      const objectUrl = URL.createObjectURL(blob);\r
      const a = document.createElement('a');\r
      a.href = objectUrl;\r
      a.download = filename; // 设置自定义文件名\r
      document.body.appendChild(a);\r
      a.click();\r
      document.body.removeChild(a);\r
      URL.revokeObjectURL(objectUrl); // 释放对象 URL\r
    });\r
}\r
\`\`\`\r
\r
## 参考\r
\r
[a 标签简单设置 href 方式修改文件名失效-CSDN 博客](https://blog.csdn.net/sinat_36728518/article/details/123525637)\r
`;export{r as default};
