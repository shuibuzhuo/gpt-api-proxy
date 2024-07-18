const Router = require("koa-router");
const { sendEmail } = require("./lib/mailer");

const router = new Router();

// test send email
router.get("/api/test/send-email", async (ctx, next) => {
  const query = ctx.query || {};

  const testToken = query["test-token"] || "";
  console.log("testToken", testToken);

  if (testToken !== "koo*189") {
    ctx.body = "invalid token";
    return;
  }

  const res = await sendEmail({
    subject: "test title 测试标题",
    text: "test content 测试内容，Date.now " + Date.now(),
  });

  ctx.body = "send email" + res.messageId;
});

module.exports = router;
