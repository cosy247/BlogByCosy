---
id: 1778476977403 # 文章id
date: 2026/5/11 13:22 # 时间
title: Nginx 配置完全指南：从入门到生产实战 # 文章标题
description: Nginx 配置完全指南：从入门到生产实战 # 文章描述
tag: Nginx # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Nginx 配置完全指南：从入门到生产实战

## 引言

`Nginx` 是一款高性能的 HTTP 服务器和反向代理服务器，由 Igor Sysoev 于 2004 年发布。它的异步非阻塞事件驱动架构使其能够在高并发场景下保持极低的内存占用。无论是作为静态文件服务器、负载均衡器、API 网关，还是 SSL 终结器，Nginx 都表现得极为出色。

## 配置文件层次结构

Nginx 配置采用**层级嵌套**结构，从宏观到微观依次为：

```bash
main（主配置）
  ├── events（事件驱动配置）
  └── http（HTTP 协议配置）
        ├── upstream（上游服务器组，可选）
        └── server（虚拟主机配置，可以有多个）
              └── location（URL 路由规则，可以有多个）
```

### 主配置文件结构详解

```nginx
# ============================================
# 全局块（main context）- 影响整个 Nginx 运行的指令
# ============================================

# 指定 Nginx worker 进程的运行用户
# 安全建议：不要使用 root 用户运行，通常用 nginx 或 www-data
user nginx;

# worker 进程数量，通常设为 CPU 核心数
# auto 表示自动检测 CPU 核心数
worker_processes auto;

# 每个 worker 进程能打开的最大文件描述符数量
# 必须大于等于 worker_connections，通常设为系统的 "ulimit -n"
worker_rlimit_nofile 65535;

# 错误日志路径和日志级别
# 级别（从低到高）：debug | info | notice | warn | error | crit | alert | emerg
# 生产环境通常设为 warn 或 error，避免日志过多
error_log /var/log/nginx/warn.log warn;
error_log /var/log/nginx/error.log error;

# 主进程 PID 文件路径
pid /var/run/nginx.pid;

# 动态加载模块（如果需要编译第三方模块）
load_module modules/ngx_http_geoip_module.so;

# ============================================
# events 块 - 配置网络连接相关参数
# ============================================
events {
    # 每个 worker 进程可以同时处理的最大连接数
    # 总并发能力 = worker_processes × worker_connections
    worker_connections 10240;

    # 使用 epoll 事件模型（Linux 高性能网络 IO 模型）
    # 它是 Linux 2.6+ 内核的默认模型，比 select/poll 更高效
    use epoll;

    # 是否允许 worker 进程同时接受多个新连接
    # 设置为 on 可提高高并发下的接受效率
    multi_accept on;

    # 连接超时时间（毫秒），超过此时长没有活动则关闭连接
    # 适当设置可防止空闲连接占用资源
    accept_mutex_delay 100ms;
}


# ============================================
# http 块 - HTTP 协议的核心配置
# ============================================
http {
    # ========================================
    # 基础配置
    # ========================================

    # 引入 MIME 类型映射文件
    # MIME 类型告诉浏览器如何解释文件（如 .html → text/html，.css → text/css）
    include /etc/nginx/mime.types;

    # 默认 MIME 类型，当无法识别文件扩展名时使用
    default_type application/octet-stream;

    # 默认字符集
    charset utf-8;

    # ========================================
    # 日志格式配置
    # ========================================

    # 自定义日志格式（结合分析工具如 goaccess、ELK 使用）
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # JSON 格式日志，便于日志系统解析
    log_format json escape=json '{'
        '"time_local":"$time_local",'
        '"remote_addr":"$remote_addr",'
        '"request_method":"$request_method",'
        '"request_uri":"$request_uri",'
        '"status":$status,'
        '"body_bytes_sent":$body_bytes_sent,'
        '"request_time":$request_time,'
        '"http_referer":"$http_referer",'
        '"http_user_agent":"$http_user_agent",'
        '"http_x_forwarded_for":"$http_x_forwarded_for"'
    '}';

    # 访问日志配置
    access_log /var/log/nginx/access.log main buffer=32k flush=5s;
    # buffer：缓冲区大小，减少磁盘 IO
    # flush：缓冲区刷新间隔

    # ========================================
    # 文件传输优化
    # ========================================

    # 启用 sendfile 系统调用（零拷贝技术）
    # 直接从内核缓冲区发送文件，绕过用户空间，显著提升静态文件性能
    sendfile on;

    # 与 sendfile 配合使用，在数据包头部添加 TCP_NOPUSH 标志
    # 使数据包尽可能大，减少网络小包数量
    tcp_nopush on;

    # 禁用 Nagle 算法，立即发送小数据包
    # 适用于实时性要求高的场景（如 WebSocket、实时 API）
    tcp_nodelay on;

    # ========================================
    # 连接超时配置
    # ========================================

    # 长连接超时时间（秒）
    # 值越大，客户端可以复用同一 TCP 连接发起更多请求
    # 值越小，节省服务器资源
    keepalive_timeout 65;

    # 一个 keep-alive 连接上最多能发送的请求数
    keepalive_requests 100;

    # 客户端与服务器建立连接的超时时间（毫秒）
    client_header_timeout 60;
    client_body_timeout 60;

    # 响应超时时间（秒），超过此时长未发送完整响应则关闭连接
    send_timeout 60;

    # ========================================
    # 请求体大小限制
    # ========================================

    # 允许客户端请求的最大 body 大小（例如文件上传）
    # 超过此值返回 413 (Request Entity Too Large)
    client_max_body_size 20M;

    # 请求体缓冲区大小
    # 如果请求体超过此值，会写入临时文件
    client_body_buffer_size 128k;

    # 请求头缓冲区大小
    client_header_buffer_size 1k;

    # 大请求头缓冲区配置（数量 × 大小）
    # 某些客户端会发送特别大的 Cookie 或自定义头
    large_client_header_buffers 4 8k;

    # ========================================
    # 哈希表大小配置（影响主机名和类型的查找效率）
    # ========================================

    # 存放 server_name 的哈希表大小
    server_names_hash_bucket_size 64;
    server_names_hash_max_size 512;

    # MIME 类型哈希表
    types_hash_bucket_size 64;
    types_hash_max_size 2048;

    # ========================================
    # Gzip 压缩配置（减少传输体积，提升速度）
    # ========================================

    # 启用 gzip 压缩
    gzip on;

    # 压缩的最低 HTTP 版本
    gzip_http_version 1.1;

    # 设置 gzip 压缩级别（1-9，数字越大压缩率越高但更消耗 CPU）
    gzip_comp_level 6;

    # 压缩的最小响应大小（字节），小于此值不压缩
    gzip_min_length 1024;

    # 添加 Vary: Accept-Encoding 响应头
    # 告诉代理服务器根据客户端是否支持 gzip 缓存不同版本
    gzip_vary on;

    # 需要压缩的 MIME 类型
    gzip_types text/plain
               text/css
               text/xml
               text/javascript
               application/javascript
               application/json
               application/xml+rss
               application/x-javascript
               image/svg+xml
               font/ttf
               font/otf
               application/vnd.ms-fontobject;

    # 禁用对旧版 IE（小于 6 版本）的 gzip 压缩（它们不支持）
    gzip_disable "MSIE [1-6]\.";

    # 代理请求的 gzip 配置（当 Nginx 作为反向代理时）
    # off：不压缩；expired：如果请求头中有 Expires 且无效则压缩
    # no-cache/no-store/private/auth：相应条件下压缩
    # any：压缩所有代理响应
    gzip_proxied any;

    # ========================================
    # 缓存优化配置
    # ========================================

    # 打开文件缓存（提高静态文件访问性能）
    # max：缓存中最多能打开的文件描述符数量
    # inactive：文件在缓存中的存活时间，超过此时长未被访问则移除
    open_file_cache max=10000 inactive=60s;

    # 缓存的有效验证时间
    open_file_cache_valid 30s;

    # 最小使用次数，当文件被访问多少次后才会被缓存
    open_file_cache_min_uses 2;

    # 是否缓存文件查找错误（如文件不存在）
    open_file_cache_errors on;

    # ========================================
    # 上游服务器配置（负载均衡）
    # ========================================

    # 定义一组后端服务器（可在多个 server 中复用）
    upstream backend_api {
        # 负载均衡算法：轮询（默认）
        # 常用算法：
        # - 轮询（默认）：依次分发
        # - weight：按权重比例分发
        # - ip_hash：根据客户端 IP 的哈希值分发（保证同一用户访问同一后端）
        # - least_conn：分发到当前连接数最少的后端
        # - hash $request_uri：根据请求 URI 的哈希分发

        # 权重配置，数字越大分配越多请求
        server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
        server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;

        # 备份服务器，只有当主服务器全部不可用时才使用
        server 192.168.1.12:8080 backup;

        # 标记为 down 的服务器（临时下线，不发送请求）
        # server 192.168.1.13:8080 down;

        # 保持长连接的数量（与后端建立的长连接数）
        keepalive 32;
    }

    # 使用 ip_hash 的示例（常用于 Session 保持场景）
    upstream backend_sticky {
        ip_hash;
        server 192.168.1.10:8080;
        server 192.168.1.11:8080;
    }

    # 使用最少连接数的示例
    upstream backend_least {
        least_conn;
        server 192.168.1.10:8080;
        server 192.168.1.11:8080;
    }

    # ========================================
    # 限流配置（保护后端服务不被冲垮）
    # ========================================

    # 基于请求频率的限制
    # zone 名称：mylimit，分配 10M 共享内存（记录请求状态）
    # rate：每秒允许 10 个请求，超过的请求将被延迟或拒绝
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

    # 基于并发连接数的限制（同一 IP 允许的最大连接数）
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # 基于带宽的限制（对特定类型请求限速）
    map $slow $limit_rate {
        default        0;      # 不限速
        ~^1           20k;     # 限速 20KB/s
        ~^2           50k;     # 限速 50KB/s
    }

    # ========================================
    # 引入其他配置文件（模块化管理）
    # ========================================

    # 可以按站点拆分配置文件，每个站点一个 .conf 文件
    include /etc/nginx/conf.d/*.conf;

    # 也可以按功能拆分
    include /etc/nginx/sites-enabled/*;
}
```

## Server 块详解（虚拟主机配置）

`server` 块定义一个虚拟主机，可以绑定域名和端口，相当于一台独立的 Web 服务器。

### 基础 Server 配置

```nginx title='/etc/nginx/conf.d/example.com.conf'
server {
    # ========================================
    # 监听配置
    # ========================================

    # 监听 80 端口（标准 HTTP 端口）
    listen 80;

    # 更完整的监听语法
    # listen 80 default_server;           # 设置为默认服务器（匹配未明确指定的域名）
    # listen 443 ssl http2;               # 开启 SSL 和 HTTP/2
    # listen [::]:80 ipv6only=on;         # 同时监听 IPv6

    # ========================================
    # 域名配置
    # ========================================

    # 主域名（精确匹配）
    server_name example.com;

    # 也可以配置多个域名
    # server_name example.com www.example.com api.example.com;

    # 支持通配符
    # server_name *.example.com;

    # 支持正则表达式（以 ~ 开头）
    # server_name ~^(?<subdomain>.+)\.example\.com$;

    # ========================================
    # 日志路径（可以覆盖 http 级别的配置）
    # ========================================

    # 访问日志（独立于全局配置）
    access_log /var/log/nginx/example.com.access.log main buffer=32k;

    # 错误日志
    error_log /var/log/nginx/example.com.error.log warn;

    # 关闭某些资源的日志（如健康检查、静态资源）
    # location /health {
    #     access_log off;
    # }

    # ========================================
    # 根目录配置
    # ========================================

    # 网站文件存放的根目录
    root /var/www/example.com/html;

    # 默认首页文件（按顺序查找）
    index index.html index.htm index.php;

    # ========================================
    # 字符集
    # ========================================

    charset utf-8;

    # ========================================
    # 自定义错误页面
    # ========================================

    # 优雅的错误页面处理
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    # 错误页面的具体位置配置
    location = /50x.html {
        root /var/www/example.com/error;
        internal;  # 只允许内部跳转访问，防止外部直接请求
    }

    # ========================================
    # Location 路由规则（核心）
    # ========================================

    # 后面会详细展开，这里先给一个概述
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 多个虚拟主机的配置方式

```nginx title='/etc/nginx/conf.d/multi-sites.conf'
# 方式一：在一个配置文件中定义多个 server 块
server {
    listen 80;
    server_name site1.com;
    root /var/www/site1;
}

server {
    listen 80;
    server_name site2.com;
    root /var/www/site2;
}

# ============================================
# 方式二：每个虚拟主机单独配置文件（推荐，便于维护）
# ============================================

# /etc/nginx/conf.d/site1.com.conf
server {
    listen 80;
    server_name site1.com;
    root /var/www/site1;
}

# /etc/nginx/conf.d/site2.com.conf
server {
    listen 80;
    server_name site2.com;
    root /var/www/site2;
}
```

## Location 块详解（URL 路由核心）

`location` 是 Nginx 配置中最重要、最复杂的部分，它决定了不同 URL 路径应该如何处理。

## Location 基础配置

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    # ========================================
    # Location 修饰符说明
    # ========================================

    # 1. "=" 精确匹配 - 优先级最高
    # 只有当请求的 URI 完全等于 "/" 时才匹配
    # 常用于网站首页的快速匹配
    location = / {
        # 由于精确匹配优先级最高，访问 http://example.com/ 会进入这里
        # 可以返回静态首页或者 rewrite 到其他路径
        try_files /index.html /index.htm =404;
    }

    # 精确匹配具体页面
    location = /favicon.ico {
        # 网站图标准确匹配，可以单独设置缓存和日志
        log_not_found off;      # 不要记录 favicon 找不到的错误日志
        access_log off;         # 不记录访问日志
        expires 1y;             # 缓存一年
        add_header Cache-Control "public, immutable";
    }

    location = /robots.txt {
        # 爬虫协议文件
        access_log off;
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /private/\nSitemap: https://example.com/sitemap.xml";
    }

    # 2. "^~" 前缀匹配 - 匹配后不再检查正则表达式
    # 以某个前缀开头的 URI 都会匹配（优先级高于正则）
    location ^~ /static/ {
        # 匹配 /static/css/style.css、/static/js/app.js 等
        # 这个匹配会比任何正则表达式优先，提升效率
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 3. "~" 正则匹配（区分大小写）
    location ~ \.php$ {
        # 匹配以 .php 结尾的 URI（区分大小写，即只匹配 .php，不匹配 .PHP）
        # 通常会转发给 PHP-FPM 处理
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # 4. "~*" 正则匹配（不区分大小写）
    location ~* \.(jpg|jpeg|png|gif|ico|svg|css|js)$ {
        # 匹配图片、CSS、JS 等静态资源（不区分大小写，所以 .JPG 也能匹配）
        expires 30d;
        add_header Cache-Control "public";
        # 为静态资源添加 CORS 头（如果需要跨域访问）
        add_header Access-Control-Allow-Origin "*";
        access_log off;  # 减少日志写入压力
    }

    # 5. 普通前缀匹配（无修饰符）- 优先级最低
    location /api/ {
        # 匹配以 /api/ 开头的请求
        # 如果有多个前缀匹配，Nginx 会选择最长的那个
        proxy_pass http://backend_api;
        proxy_set_header Host $host;
    }

    # 最长前缀匹配的示例
    location /api/v1/ {
        # 对于 /api/v1/users 请求，会匹配到这个而不是上面的 /api/
        # 因为更长的前缀优先（在正则检查之前）
        proxy_pass http://api_v1_backend;
    }

    # 6. @ 命名 location（内部跳转专用）
    location @handle_404 {
        # 只能通过 error_page 或 try_files 内部跳转访问
        return 404 "Custom 404 message";
    }
}
```

### Location 匹配优先级

#### `=` 精确匹配

URI 必须完全等于指定路径，匹配后立即停止，不再检查其他 location

```nginx
location = / { ... }           # 精确匹配根路径
location = /login.html { ... } # 精确匹配登录页
location = /favicon.ico { ... } # 精确匹配网站图标
```

#### `^~` 前缀匹配（禁止正则）

匹配指定前缀的 URI，且匹配后不再检查任何正则表达式 location

```nginx
location ^~ /static/ { ... }   # 匹配所有 /static/ 开头的路径
location ^~ /assets/ { ... }   # 匹配所有 /assets/ 开头的路径
location ^~ /downloads/ { ... } # 匹配所有下载路径
```

#### `~` 正则匹配（区分大小写）

使用正则表达式匹配 URI，区分大小写，按配置文件中的出现顺序匹配

```nginx
location ~ \.php$ { ... }      # 匹配 .php 结尾（小写）
location ~ /api/v[0-9]+/ { ... } # 匹配 /api/v1/、/api/v2/ 等
location ~ ^/user/[0-9]+$ { ... } # 匹配 /user/123 格式
```

#### `~*` 正则匹配（不区分大小写）

使用正则表达式匹配 URI，不区分大小写，按配置文件中的出现顺序匹配

```nginx
location ~* \.jpg$ { ... }     # 匹配 .jpg、.JPG、.Jpg
location ~* \.html$ { ... }    # 匹配 .html、.HTML
location ~* ^/assets/ { ... }  # 匹配 /assets/、/ASSETS/
```

#### 普通前缀匹配（无修饰符）

匹配指定前缀的 URI，**最长匹配优先**（哪个路径更长就选哪个）

```nginx
location / { ... }              # 匹配所有，优先级最低
location /api/ { ... }          # 比 / 更优先（路径更长）
location /api/v1/ { ... }       # 比 /api/ 更优先（路径更长）
location /user/ { ... }         # 匹配 /user/ 开头
```

#### `/` 兜底匹配

当其他所有 location 都不匹配时，使用这个作为默认处理

```nginx
location / { ... }              # 最后的兜底方案
```

## 完整示例

### Web 应用配置

```nginx
# /etc/nginx/nginx.conf

user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 10240;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" $request_time';
    access_log /var/log/nginx/access.log main buffer=32k flush=5s;

    # 基础优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    client_max_body_size 20M;
    client_body_buffer_size 128k;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # 缓存
    open_file_cache max=10000 inactive=60s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;

    # 限流
    limit_req_zone $binary_remote_addr zone=global:10m rate=50r/s;
    limit_conn_zone $binary_remote_addr zone=conn:10m;

    # 上游后端
    upstream app_backend {
        least_conn;
        server 10.0.0.10:8080 max_fails=3 fail_timeout=30s;
        server 10.0.0.11:8080 max_fails=3 fail_timeout=30s;
        keepalive 64;
    }

    # 引入站点配置
    include /etc/nginx/conf.d/*.conf;
}
```

### 站点配置示例

```nginx
# /etc/nginx/conf.d/example.com.conf

# HTTP 跳转 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL 证书
    ssl_certificate /etc/nginx/ssl/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # 日志
    access_log /var/log/nginx/example.com.access.log main;
    error_log /var/log/nginx/example.com.error.log warn;

    # 根目录
    root /var/www/example.com/html;
    index index.html index.php;

    # 全局限流
    limit_req zone=global burst=20 nodelay;
    limit_conn conn 100;

    # 静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        log_not_found off;
    }

    # PHP 处理
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://app_backend/;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 默认入口
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## 参考
