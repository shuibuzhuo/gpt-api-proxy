const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const chatRouter = require('./chat-router')
const testRouter = require('./test-router');
require('dotenv').config()

const app = new Koa();
app.use(cors({
  origin: (ctx) => {
    const origin = ctx.request.header.origin
    const configOrigin = process.env.CORS_ORIGIN

    if (configOrigin === '*') {
      return origin
    }

    if (configOrigin.split(',').includes(origin)) {
      return origin
    }

    return ''
  }
})); // 跨域
app.use(bodyParser());

app.use(chatRouter.routes()).use(chatRouter.allowedMethods());
app.use(testRouter.routes()).use(testRouter.allowedMethods())

// 定义一个中间件函数，用于捕获错误
function errorMiddleware(ctx, next) {
  try {
    // 调用下一个中间件函数
    next();
  } catch (error) {
    // 捕获错误，可以在这里处理错误，例如记录日志、返回错误信息等
    console.error('发生错误:', error);
    // 返回错误信息给客户端
    ctx.status = 500;
    ctx.body = '发生错误，请稍后重试';
  }
}

// 使用 errorMiddleware 中间件函数来监听错误
app.use(errorMiddleware);

app.use(async ctx => {
  ctx.body = 'chat API proxy';
})

const port = 3002 // 和 s.yaml 的端口一致
app.listen(port);
