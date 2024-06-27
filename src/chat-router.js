
const Router = require("koa-router");
const { getOpenAIInstance } = require("./lib/openai");

const router = new Router();



router.get("/api/gpt/chat", async (ctx, next) => {
  ctx.status = 200;
  ctx.set("Content-Type", "text/event-stream"); // 'text/event-stream' 标识 SSE 即 Server-Sent Events

  let gptStream;

  ctx.req.on("close", () => {
    console.log("req close...");

    // 取消请求
    console.log("try abort...");
    if (!ctx.gptStreamDone) {
      console.log("abort request...");
      gptStream.controller.abort();
      console.log("abort ok~");
    }
  });

  const query = ctx.query || {};

  // 简单的密钥
  const authToken = query["x-auth-token"] || "";
  if (!authToken.trim() || authToken !== process.env.AUTH_TOKEN) {
    const errMsg = "invalid token";
    console.log("error: ", errMsg);
    ctx.res.write(`data: [ERROR]${errMsg}\n\n`); // 格式必须是 `data: xxx\n\n`!!!
    return;
  }

  // option
  const optionStr = query["option"] || "{}";
  const decodeOptionStr = decodeURIComponent(optionStr);
  const option = JSON.parse(decodeOptionStr);

  if (!option.messages) {
    const errMsg = "invalid option: messages required";
    console.log("error: ", errMsg);
    ctx.res.write(`data: [ERROR]${errMsg}\n\n`);
    return;
  }

  // get openai instance
  const instance = getOpenAIInstance()
  if (instance == null) {
    const errMsg = 'openai instance is null'
    console.log('error: ', errMsg)
    ctx.res.write(`data: [ERROR]${errMsg}\n\n`)
    return 
  }
  
  const formatKey = instance.key.slice(0, 20) + '***'
  console.log('cur openai key: ', formatKey)

  try {
    // request GPT API
    gptStream = await instance.openai.chat.completions.create({
      model: instance.model,
      max_tokens: 600,
      stream: true, // stream
      stream_options: { include_usage: true },
      ...option,
    });
  } catch (error) {
    const errMsg = error.message || "request openapi API error";
    console.log("error: ", errMsg);
    ctx.res.write(`data: [ERROR]${errMsg}\n\n`);
    return;
  }

  if (gptStream == null) {
    const errMsg = "gptStream is not defined";
    ctx.res.write(`data: [ERROR]${errMsg}\n\n`);
    return;
  }

  for await (const chunk of gptStream) {
    const { choices = [], usage } = chunk;

    if (choices.length === 0 || usage != null) {
      ctx.res.write(`data: ${JSON.stringify({ usage })}\n\n`);

      // 结束
      ctx.gptStreamDone = true
      ctx.res.write(`data: [DONE]\n\n`) // 格式必须是 `data: xxx\n\n`
    }

    if (choices.length > 0) {
      const content = choices[0].delta.content;
      if (content != null) {
        const data = { c: content }
        ctx.res.write(`data: ${JSON.stringify(data)}\n\n`)
      }
    }
  }
});

module.exports = router;
