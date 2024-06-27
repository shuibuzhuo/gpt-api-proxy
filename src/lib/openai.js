const OpenAI = require("openai");

require("dotenv").config();

const apiKey1 = process.env.DEEP_SEEK_API_KEY;
const instance1 = {
  openai: new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: apiKey1,
  }),
  model: 'deepseek-chat',
  key: apiKey1
};

const apiKey2 = process.env.DEEP_BRICKS_API_KEY
const instance2 = {
  openai: new OpenAI({
    baseURL: 'https://api.deepbricks.ai/v1/',
    apiKey: apiKey2,
  }),
  model: 'gpt-3.5-turbo',
  key: apiKey2
}

const instanceList = [instance1, instance2] // 还可以扩展多个
let index = 0

function getOpenAIInstance () {
  const instance = instanceList[index]
  index = (index + 1) % instanceList.length
  return instance
}

module.exports = {
  getOpenAIInstance
}
