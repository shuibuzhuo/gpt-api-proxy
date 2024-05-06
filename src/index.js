const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const chatRouter = require('./chat-router')

const app = new Koa();
app.use(cors()); // 跨域
app.use(bodyParser());

app.use(chatRouter.routes()).use(chatRouter.allowedMethods());

app.use(async ctx => {
  ctx.body = 'chat API proxy';
})

app.listen(3002);
