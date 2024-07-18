const OpenAI = require("openai");
const { sendEmail } = require("./mailer");

require("dotenv").config();

const apiKey1 = process.env.DEEP_SEEK_API_KEY;
const instance1 = {
  openai: new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: apiKey1,
  }),
  model: "deepseek-chat",
  key: apiKey1,
  isError: false,
};

const apiKey2 = process.env.DEEP_BRICKS_API_KEY;
const instance2 = {
  openai: new OpenAI({
    baseURL: "https://api.deepbricks.ai/v1/",
    apiKey: apiKey2,
  }),
  model: "gpt-3.5-turbo",
  key: apiKey2,
  isError: false,
};

let instanceList = [instance1, instance2]; // 还可以扩展多个
let index = 0;

function getOpenAIInstance() {
  if (instanceList.length === 0) {
    // 如果实例列表为空，则发送邮件通知
    console.error("instance list is empty, no instance available");
    sendEmail({
      subject: "OpenAI instance list is empty",
      text: "OpenAI instance list is empty",
    });
    return null;
  }

  const instance = instanceList[index];
  if (!instance.isError) {
    // 当前实例没有错误，则增加 index 并返回
    index = (index + 1) % instanceList.length;
    return instance;
  }

  // 如果当前实例有错误，则剔除当前实例
  console.log('instance error and removed from list, key: ', instance.key)
  instanceList = instanceList.filter((item) => item.key !== instance.key)
  index = 0 // 重置 index
  return getOpenAIInstance()
}

module.exports = {
  getOpenAIInstance,
};
