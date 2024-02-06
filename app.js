const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", express.json(), (request, response) => {
  const agent = new WebhookClient({ request, response });

  // 01_Demo
  const demo = (agent) => {
    agent.add("Sending response from Webhook server as Belajar-Dialogflow v.1!");
  };

  const intentMap = new Map();

  intentMap.set("01_Demo", demo);
  intentMap.set("0_Fallback", handleFallback);

  agent.handleRequest(intentMap);
});

module.exports = app;
