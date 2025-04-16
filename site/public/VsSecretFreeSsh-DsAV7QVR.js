const r=`---\r
id: 240409103645\r
date: 2024/04/09\r
title: Vscode 免密连接远程服务器\r
tags: Vscode使用\r
archive:\r
description: Vscode 免密连接远程服务器\r
---\r
\r
# Vscode 免密连接远程 ssh\r
\r
## 原理\r
\r
免密登录需要使用私钥钥和公钥，将公钥放在服务器，私钥放在本机并指明私钥路径即可。\r
\r
## 生成私钥和公钥\r
\r
在任意路径(一般为\`C:\\Users\\mjren\\.ssh\`)的控制台中输入。\r
\r
\`\`\`\r
ssh-keygen\r
\`\`\`\r
\r
将有三次输入:\r
\r
1. 第一次为私钥公钥的名称，这里为 test。\r
1. 第二次为密码，这里直接回车没有设置。\r
1. 第三次为确认密码，没有设置密码直接回车。\r
\r
如下输出表示生成成功：\r
\r
\`\`\`\r
Generating public/private rsa key pair.\r
Enter file in which to save the key (C:\\Users\\mjren/.ssh/id_rsa): test\r
Enter passphrase (empty for no passphrase):\r
Enter same passphrase again:\r
Your identification has been saved in test\r
Your public key has been saved in test.pub\r
The key fingerprint is:\r
SHA256:kYNOdJkjnvV0fsb+YRunmXHBUd1lQYDR9lCKzm9WUTI wzh@DESKTOP-GBINSLM\r
The key's randomart image is:\r
+---[RSA 3072]----+\r
|      . .o .+.E+@|\r
|     ..o=...o+.=+|\r
|     .o+++ +.o+..|\r
|     oo  o+ . ++.|\r
|      . S  o + ..|\r
|            . ++o|\r
|             +.B=|\r
|            o +..|\r
|                 |\r
+----[SHA256]-----+\r
\`\`\`\r
\r
最终会在当前路径下生成私钥文件\`test\`和公钥文件\`test.pub\`。\r
\r
## 将公钥放入服务器\r
\r
连接远程服务器，这里使用 Vscode，也可以使用其他方式（如 XSheel，服务器浏览器连接等）。\r
\r
在Vscode中安装插件\`Remote-SSH\`，安装完成后在\`远程资源管理\`中打开配置文件。\r
\r
![alt text](assets/VsSecretFreeSsh/image-1.png)\r
\r
添加如下配置：\r
\r
\`\`\`\r
Host cosy\r
  HostName 122.521.21.251\r
  Port 22\r
  User root\r
\`\`\`\r
\r
> Host：远程连接的名称。  \r
> HostName：地址，如果有域名也可以用域名。  \r
> Port：端口，SSH 为 22 端口，注意服务器是否开启了此端口，是否开启防火墙等。  \r
> User：为登录用户名。\r
\r
设置完成后在\`远程资源管理\`中可以看到添加的服务器并连接。这次连接还是需要密码的。\r
\r
![alt text](assets/VsSecretFreeSsh/image-3.png)\r
\r
打开服务器文件，没有的话就创建一个：\r
\r
\`\`\`\r
/root/.ssh/authorized_keys\r
\`\`\`\r
\r
将刚刚生成的公钥文件内容复制到文件中，文件中有内容的话想换行在复制。\r
\r
![alt text](assets/VsSecretFreeSsh/image-2.png)\r
\r
## 本机使用私钥\r
\r
在刚刚的\`远程资源管理\`配置中追加配置如下：\r
\r
\`\`\`\r
Host cosy\r
  HostName 122.521.21.251\r
  Port 22\r
  User root\r
  IdentityFile C:\\Users\\xxx\\.ssh\\test\r
\`\`\`\r
\r
> IdentityFile：私钥文件路径\r
\r
至此，以后连接该远程将不在需要密码\r
\r
## 服务器多个公钥\r
\r
在需要给服务器配置多个公钥方便多台电脑连接时，可以把私钥同步，也可以在服务器上存放多个公钥。\r
\r
需要在服务器上存放多个公钥时直接在\`/root/.ssh/authorized_keys\`文件中换行追加即可。\r
\`\`\`\r
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDbKInL/8zpkQBhGjKWw2/+DRDuTEedCQztlh50aM3LBYc/7ze3aWLwQPLZ/pqx8sM+Ur7g9Z7Vl4qJi56ViWeUdXfc9TCcDl88PlN8g0mJ67d8FLh8M...\r
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCzOMdL352fvFVpHKt5yFxxYtxWZnVDnghMFT8PB1DE8AMjUrz3BWuyCWPrVQEg5lftA1KOUsnJqBRNcVoi1yWVfSSW2CXLTbY7bjpKDhQ9iLlc8LtNj...\r
\`\`\`\r
这样只要使用其中任意一个对应的私钥都可以进行免密连接。\r
`;export{r as default};
