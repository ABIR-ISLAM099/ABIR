const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { handleMessage } = require("./main.js");
const config = require("./config.json");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = config.VERIFY_TOKEN;
    console.log("verify",config.VERIFY_TOKEN)
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post("/webhook", async (req, res) => {
    const body = req.body;
    //console.log(body)
    if (body.object === "page") {
        for (const entry of body.entry) {
            const webhook_event = entry.messaging[0];
            const sender_psid = webhook_event.sender.id;
            
            if (webhook_event.message) {
                await handleMessage(sender_psid, webhook_event.message,webhook_event);
            }
        }
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});


app.listen(1337) 
// () => console.log("Server is running on port 1337"));
