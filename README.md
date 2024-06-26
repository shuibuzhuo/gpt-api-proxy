# gpt-API-proxy

## 本地运行

git clone 项目

- 安装 `npm install`
- 重命名 `.env.example` 为 `.env` ，并修改内容

本地运行 `npm run dev`

## 测试机运行

git clone 项目

- 安装 `npm install`
- 重命名 `.env.example` 为 `.env` ，并修改内容

- `npm run prod`
- 查看项目列表 `npx pm2 list`
- 重启项目 `npx pm2 restart <id>`
- 停止项目 `npx pm2 stop <id>`
- 删除项目 `npx pm2 delete <id>`
- 查看日志 `npx pm2 log <id>`

使用 postman 测试，发送 GET 请求

```
/api/gpt/chat?x-auth-token=xxx&option=%7B%22messages%22%3A%20%5B%20%7B%20%20%22role%22%3A%20%22user%22%2C%20%22content%22%3A%20%22%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%BD%A0%E6%98%AF%E8%B0%81%22%20%7D%20%20%5D%7D
```

其中

- `x-auth-token` 值和 `.env` 中定义的要一致
- `option` 是 `encodeURIComponent('{"messages": [ {  "role": "user", "content": "你好，你是谁" }  ]}')`

## 发布上线

提交 `prod-deploy` 分支到 GitHub 会触发阿里云 FC 应用“gpt-api-proxy”重新部署 https://fcnext.console.aliyun.com/applications

注意，如有环境变量 `.env` 文件的改动

- 在阿里云 FC 应用“流水线配置”中，增加或修改环境变量 https://fcnext.console.aliyun.com/applications/gpt-api-proxy/env/default?tab=flowManagement
- 修改 `s.yaml` 文件，其中有动态创建线上 `.env` 文件的代码
