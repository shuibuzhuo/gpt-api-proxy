const OpenAI = require('openai')
const Router = require('koa-router');
require('dotenv').config();

const router = new Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

router.post('/api/gpt/chat', async (ctx, next) => {
  const body = ctx.request.body;

  const gptStream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    // messages: [{ role: 'user', content: 'xxx' }],
    // max_tokens: 100,
    stream: true, // stream
    ...body
  })

  ctx.set('Content-Type', 'text/event-stream'); // 'text/event-stream' 标识 SSE 即 Server-Sent Events

  for await (const chunk of gptStream) {
    ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`) // 格式必须是 `data: xxx\n\n` ！！！
  }

  ctx.req.on('close', () => {
    console.log('req close...')
  })
});

module.exports = router
