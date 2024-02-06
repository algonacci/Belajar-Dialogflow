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

  // 0_demo
  const demo = (agent) => {
    agent.add("Sending response from Webhook server as Belajar-Dialogflow v.1!");
  };

  // Reservation
  const reservation = (agent) => {
    agent.add("Hai, silahkan lengkapi biodata ini sebelum kamu melanjutkan. Siapa nama anda?");
  };

  const confirmReservation = (agent) => {
    const name = agent.parameters.name.name;
    const email = agent.parameters.email;
    const date = agent.parameters.date;
    //let dateTime = convertToFormattedDateTime(date);

    console.log(name);
    console.log(email);
    console.log(date);
    //console.log(dateTime);

    const ConfirmData = {
      richContent: [
        [
          {
            type: "info",
            subtitle: "Halo $name, email anda: $email, dan tanggal reservasi: $date. Kami telah mengkonfirmasi reservasi anda. Apakah anda akan melanjutkan reservasi?",
            title: "Konfirmasi Pemesanan",
          },
          {
            options: [
              {
                text: "Ya, lanjutkan reservasi!",
              },
              {
                text: "Tidak, saya masih belum bisa memastikannya.",
              },
            ],
            type: "chips",
          },
        ],
      ],
    };

    agent.add(new Payload(agent.UNSPECIFIED, ConfirmData, { sendAsMessage: true, rawPayload: true }));
  };

  // 01_customPayloadDemo
  const customPayloadDemo = (agent) => {
    const payloadData = {
      richContent: [
        [
          {
            type: "info",
            title: "Info item title",
            subtitle: "Info item subtitle",
            image: {
              src: {
                rawUrl: "https://example.com/images/logo.png",
              },
            },
            actionLink: "https://example.com",
          },
        ],
      ],
    };

    agent.add(new Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
  };

  // 02_hire_and_meeting
  const hireAndMeeting = (agent) => {
    agent.add("What is your name?");
  };

  // 03_ask_email
  const askEmail = (agent) => {
    agent.add("What's your email?");
  };

  // 04_confirm_meeting
  const confirmMeeting = (agent) => {
    const payloadData = {
      richContent: [
        [
          {
            type: "chips",
            options: [
              {
                text: "Yes",
              },
              {
                text: "No",
              },
            ],
          },
        ],
      ],
    };
    agent.add("Thanks, received. Do you want to confirm your booking meeting?");
    agent.add(new Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
  };

  const intentMap = new Map();

  intentMap.set("0_demo", demo);
  //   intentMap.set("01_customPayloadDemo", customPayloadDemo);
  //   intentMap.set("02_hire_and_meeting", hireAndMeeting);
  //   intentMap.set("03_ask_email", askEmail);
  //   intentMap.set("04_confirm_meeting", confirmMeeting);
  intentMap.set("01_Reservation", reservation);
  intentMap.set("askBiodata", confirmReservation);

  agent.handleRequest(intentMap);
});

module.exports = app;
