---
id: 1742803372977 # 文章id
date: 2025/03/24 16:37
title: a标签下载文件时设置文件名失效问题 # 文章标题
description: a标签下载文件时设置文件名失效问题 # 文章描述
tag: 前端 # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
hidden: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# a 标签下载文件时设置文件名失效问题

## 问题描述

通过 a 标签下载文件时通常可用以下代码：

```html
<a href="http://127.0.0.1:8000/files/temp.pdf" download="参考文件.pdf">文件下载</a>
```

如果说页面地址也是 `http://127.0.0.1:8000` 开始的话是没有问题的。但是如果是其他域，`download` 属性将会失效。

## 解决方法

1. 将文件和页面放在同一个域中，如果为第三方文件托管，可以使用 nginx 等代理进行转发。参考配置如下：

```ini title=nginx.conf
server {
    listen 80;  # 监听端口
    server_name mydomain.com;  # 你的域名

    # 配置本地 HTML 文件服务
    location / {
        root /usr/share/nginx/html;  # HTML 文件的根目录
        index index.html;  # 默认索引文件
    }

    # 配置外部 HTTP 服务的代理
    location /file {
        proxy_pass http://external-service.com/path/to/file;  # 目标服务地址
        proxy_set_header Host $host;  # 传递原始 Host 头
        proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实 IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递客户端真实 IP
        proxy_set_header X-Forwarded-Proto $scheme;  # 传递原始协议
    }
}
```

2. 先将文件下载，生成临时 URL，再动态生成 a 标签进行下载。参考代码如下：

```js
function downloadFile(url, filename) {
  fetch(url) // 获取文件
    .then((response) => response.blob())
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename; // 设置自定义文件名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl); // 释放对象 URL
    });
}
```

## 参考

[a 标签简单设置 href 方式修改文件名失效-CSDN 博客](https://blog.csdn.net/sinat_36728518/article/details/123525637)
