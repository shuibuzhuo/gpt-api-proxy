# gpt-API-proxy

git clone 项目

- 安装 `npm install`
- 重命名 `.env.example` 为 `.env` ，并修改内容

本地运行 `npm run dev`

线上运行

- `npm run prod`
- 查看项目列表 `npx pm2 list`
- 重启项目 `npx pm2 restart <id>`
- 停止项目 `npx pm2 stop <id>`
- 删除项目 `npx pm2 delete <id>`

使用 postman 测试

- 发送 POST 请求，路由 `/api/gpt/chat`
- body 设置 JSON 格式 `{"messages": [ {  "role": "user", "content": "你好，你是谁" }  ]}`
- headers 增加 `x-auth-token: xxx` ，值在 `.env` 中定义
